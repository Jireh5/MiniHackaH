import { supabase, isSupabaseConfigured } from './supabaseClient';
import supabaseMock from './supabaseMock';

const ROLE_RANKING = {
  general_member: 0,
  committee_head: 1,
  executive_board: 2,
  admin: 3
};

const hasClearance = (userRole, requiredRole) => {
  const userRank = ROLE_RANKING[userRole] || 0;
  const requiredRank = ROLE_RANKING[requiredRole] || 0;
  return userRank >= requiredRank;
};

const MOCK_CHECKLIST_TEMPLATES = [
  { id: 1, title: "Finalize Annual Financial Audit", description: "Upload the audit report detailing revenues and sponsorships.", role_access: "executive_board", required_type: "REPORT", keywords: ["financial", "ledger", "audit", "budget"] },
  { id: 2, title: "Sponsor Decks and Portfolio Upload", description: "Hand over active corporate sponsorship decks and agreements.", role_access: "executive_board", required_type: "REPORT", keywords: ["sponsor", "sponsorship", "portfolio", "deal"] },
  { id: 3, title: "Create PR/Social Media Kits & Templates", description: "Document all designs and branding tools.", role_access: "committee_head", required_type: "SOP", keywords: ["pr", "media", "branding", "kit", "template"] },
  { id: 4, title: "Publish Executive Handover & Election Notes", description: "Upload notes on transition schedules and election rules.", role_access: "admin", required_type: "REPORT", keywords: ["handover", "transition", "election", "notes"] },
  { id: 5, title: "Upload Operational Event Plan Guide", description: "Write down the event SOP for organizing logistics.", role_access: "committee_head", required_type: "SOP", keywords: ["operational", "event", "plan", "permit", "room"] }
];

export const supabaseService = {
  isLive: () => isSupabaseConfigured,

  // AUTH USER
  getCurrentUser: async () => {
    if (!isSupabaseConfigured) {
      return supabaseMock.auth.getUser();
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        return null;
      }

      const user = session.user;

      const { data: userRow, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (dbError || !userRow) {
        const newProfile = {
          user_id: user.id,
          email: user.email,
          role: 'general_member'
        };
        await supabase.from('users').insert([newProfile]);
        
        return {
          id: user.id,
          email: user.email,
          org_role: 'general_member',
          name: user.email.split('@')[0],
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
        };
      }

      return {
        id: userRow.user_id,
        email: userRow.email,
        org_role: userRow.role,
        name: userRow.email.split('@')[0],
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
      };
    } catch (e) {
      console.error("Supabase Auth Error: ", e);
      return null;
    }
  },

  getUsersList: () => {
    return supabaseMock.auth.getUsersList();
  },

  switchUser: async (userId, currentUser) => {
    if (!isSupabaseConfigured) {
      return supabaseMock.auth.setUser(userId);
    }

    const targetMockUser = supabaseMock.auth.getUsersList().find(u => u.id === userId);
    if (!targetMockUser) return null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        const { data: updatedProfile } = await supabase
          .from('users')
          .update({ role: targetMockUser.org_role })
          .eq('user_id', session.user.id)
          .select()
          .single();

        if (updatedProfile) {
          return {
            id: updatedProfile.user_id,
            email: updatedProfile.email,
            org_role: updatedProfile.role,
            name: updatedProfile.email.split('@')[0],
            avatar: targetMockUser.avatar
          };
        }
      }
    } catch (e) {
      console.error("RBAC Profile Swap Failed, fallback to local state: ", e);
    }
    
    return supabaseMock.auth.setUser(userId);
  },

  signInWithPassword: async (email, password) => {
    if (!isSupabaseConfigured) {
      const user = supabaseMock.auth.getUsersList().find(u => u.email === email);
      if (user) {
        supabaseMock.auth.setUser(user.id);
        return user;
      }
      throw new Error("User not found with matching email.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const { data: userRow } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (!userRow) {
      const newProfile = {
        user_id: data.user.id,
        email: data.user.email,
        role: 'general_member'
      };
      await supabase.from('users').insert([newProfile]);
      return {
        id: data.user.id,
        email: data.user.email,
        org_role: 'general_member',
        name: data.user.email.split('@')[0],
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
      };
    }

    return {
      id: userRow.user_id,
      email: userRow.email,
      org_role: userRow.role,
      name: userRow.email.split('@')[0],
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
    };
  },

  signUp: async (email, password, name, org_role) => {
    if (!isSupabaseConfigured) {
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        org_role,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
      };
      supabaseMock.auth.getUsersList().push(newUser);
      supabaseMock.auth.setUser(newUser.id);
      return newUser;
    }

    let passwordHash = '';
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      passwordHash = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (e) {
      console.warn("Could not generate client-side password hash:", e);
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
        }
      }
    });
    if (error) throw error;

    if (data.user) {
      const profile = {
        user_id: data.user.id,
        email,
        role: org_role,
        password_hash: passwordHash
      };
      
      const { error: dbError } = await supabase.from('users').insert([profile]);
      if (dbError) console.error("Profile creation error: ", dbError);
      
      return {
        id: data.user.id,
        email,
        org_role,
        name: email.split('@')[0],
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
      };
    }
    return null;
  },

  signOut: async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem("orgvault_current_user");
      return true;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },

  // DOCUMENTS
  getDocuments: async (currentUserRole) => {
    if (!isSupabaseConfigured) {
      return supabaseMock.documents.select(currentUserRole);
    }

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*, users(email)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const allowedDocs = data.filter(doc => hasClearance(currentUserRole, doc.role_access));

      return allowedDocs.map(doc => ({
        id: doc.docu_id,
        title: doc.title,
        description: doc.description,
        type: (doc.document_type || 'sop').toUpperCase(),
        role_access: doc.role_access,
        file_name: doc.storage_path ? doc.storage_path.replace('documents/', '') : 'document.pdf',
        file_size: doc.file_size || '2.0 MB',
        uploaded_by: doc.users?.email ? doc.users.email.split('@')[0] : 'Unknown Officer',
        uploaded_at: doc.created_at
      }));
    } catch (e) {
      console.error("Failed to fetch documents: ", e);
      return [];
    }
  },

  uploadDocument: async (newDoc, file, currentUser) => {
    if (!isSupabaseConfigured) {
      return supabaseMock.documents.insert(newDoc, currentUser);
    }

    try {
      let storagePath = `documents/${Date.now()}_${newDoc.file_name}`;
      let formattedSize = '2.0 MB';

      // Perform actual file upload to 'org_documents' Supabase bucket
      if (file) {
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('org_documents')
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;
        
        storagePath = uploadData.path;
        
        // Calculate file size string
        const sizeBytes = file.size;
        if (sizeBytes < 1024 * 1024) {
          formattedSize = `${(sizeBytes / 1024).toFixed(1)} KB`;
        } else {
          formattedSize = `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
        }
      }

      const payload = {
        title: newDoc.title,
        description: newDoc.description,
        document_type: newDoc.type.toLowerCase(),
        role_access: newDoc.role_access,
        storage_path: storagePath,
        file_size: formattedSize, // Save actual file size to DB if column exists
        uploaded_by: currentUser.id
      };

      let result = await supabase
        .from('documents')
        .insert([payload])
        .select('*, users(email)');

      // Self-healing: if file_size column doesn't exist in database, retry without it
      if (result.error && (result.error.message?.includes('file_size') || result.error.code === 'PGRST204')) {
        console.warn("file_size column not found in documents table. Retrying insert without file_size...");
        const defensivePayload = { ...payload };
        delete defensivePayload.file_size;
        
        result = await supabase
          .from('documents')
          .insert([defensivePayload])
          .select('*, users(email)');
      }

      if (result.error) throw result.error;
      const document = result.data?.[0];
      if (!document) throw new Error("Failed to retrieve uploaded document record.");

      return {
        id: document.docu_id,
        title: document.title,
        description: document.description,
        type: document.document_type.toUpperCase(),
        role_access: document.role_access,
        file_name: document.storage_path.replace('documents/', ''),
        file_size: document.file_size || formattedSize,
        uploaded_by: document.users?.email ? document.users.email.split('@')[0] : currentUser.name,
        uploaded_at: document.created_at
      };
    } catch (e) {
      console.error("Upload error: ", e);
      throw e;
    }
  },

  deleteDocument: async (docId) => {
    if (!isSupabaseConfigured) {
      return supabaseMock.documents.delete(docId);
    }

    try {
      // Fetch storage path first to delete the file from Supabase Storage
      const { data: doc } = await supabase
        .from('documents')
        .select('storage_path')
        .eq('docu_id', docId)
        .single();

      if (doc && doc.storage_path) {
        await supabase
          .storage
          .from('org_documents')
          .remove([doc.storage_path]);
      }

      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('docu_id', docId);

      if (error) throw error;
    } catch (e) {
      console.error("Deletion error: ", e);
      throw e;
    }
  },

  // CHECKLISTS
  getChecklists: async (currentUserRole) => {
    if (!isSupabaseConfigured) {
      return supabaseMock.checklists.select(currentUserRole);
    }

    try {
      const { data: docs } = await supabase
        .from('documents')
        .select('*');

      const userRank = ROLE_RANKING[currentUserRole] || 0;
      
      const checklistsFiltered = MOCK_CHECKLIST_TEMPLATES.filter(chk => {
        const reqRank = ROLE_RANKING[chk.role_access] || 0;
        return userRank >= reqRank;
      });

      return checklistsFiltered.map(chk => {
        const matchingDoc = docs?.find(d => {
          const typeMatches = (d.document_type || '').toUpperCase() === chk.required_type;
          const titleLower = (d.title || '').toLowerCase();
          const descLower = (d.description || '').toLowerCase();
          const keywordMatches = chk.keywords.some(kw => 
            titleLower.includes(kw) || descLower.includes(kw)
          );
          return typeMatches && keywordMatches;
        });

        return {
          id: `chk-${chk.id}`,
          title: chk.title,
          description: chk.description,
          role_access: chk.role_access,
          required_type: chk.required_type,
          status: matchingDoc ? 'Completed' : 'Pending',
          completed_doc_id: matchingDoc ? matchingDoc.docu_id : null
        };
      });
    } catch (e) {
      console.error("Failed to map checklists dynamically: ", e);
      return [];
    }
  },

  resetDatabase: async () => {
    if (!isSupabaseConfigured) {
      return supabaseMock.checklists.resetAll();
    }

    try {
      await supabase.from('documents').delete().neq('docu_id', '00000000-0000-0000-0000-000000000000');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const initialDocs = [
        {
          title: "Annual Orientation Event Plan SOP",
          description: "Detailed walkthrough for coordinating the freshmen welcoming ceremony, including program flow and venue permits.",
          document_type: "sop",
          role_access: "general_member",
          storage_path: "documents/Annual_Orientation_2026_SOP.pdf",
          file_size: "1.2 MB",
          uploaded_by: user.id
        },
        {
          title: "Media Kit & Branding Guidelines",
          description: "Official color codes, typography, logos, and post templates to be used across all social media channels.",
          document_type: "sop",
          role_access: "committee_head",
          storage_path: "documents/PR_Branding_Guide_v3.pdf",
          file_size: "4.5 MB",
          uploaded_by: user.id
        },
        {
          title: "Q1 Financial Ledger & Budget Balance",
          description: "Confidential financial ledger covering membership dues, event spending, and sponsorship earnings.",
          document_type: "report",
          role_access: "executive_board",
          storage_path: "documents/Q1_Financials_Secret.xlsx",
          file_size: "820 KB",
          uploaded_by: user.id
        }
      ];

      const { error } = await supabase.from('documents').insert(initialDocs);
      
      // Self-healing: if file_size column doesn't exist, retry without it
      if (error && (error.message?.includes('file_size') || error.code === 'PGRST204')) {
        console.warn("file_size column not found during db reset. Retrying insert without file_size...");
        const defensiveDocs = initialDocs.map(({ file_size, ...rest }) => rest);
        const { error: retryError } = await supabase.from('documents').insert(defensiveDocs);
        if (retryError) throw retryError;
      } else if (error) {
        throw error;
      }

      return true;
    } catch (e) {
      console.error("Database seeding failed: ", e);
      return false;
    }
  }
};

export default supabaseService;
