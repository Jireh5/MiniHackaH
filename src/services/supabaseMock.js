// OrgVault Supabase Mock Client & Database Layer
// Simulates Supabase auth, storage, and database features for easy transition to the real client later.

const ROLE_RANKING = {
  general_member: 0,
  committee_head: 1,
  executive_board: 2,
  admin: 3
};

const MOCK_USERS = [
  {
    id: "user-admin",
    name: "Sarah Jenkins",
    email: "sarah.president@orgvault.edu",
    org_role: "admin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  },
  {
    id: "user-exec",
    name: "Marcus Chen",
    email: "marcus.vp@orgvault.edu",
    org_role: "executive_board",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    id: "user-committee",
    name: "Elena Rostova",
    email: "elena.pr@orgvault.edu",
    org_role: "committee_head",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
  },
  {
    id: "user-general",
    name: "Alex Patel",
    email: "alex.member@orgvault.edu",
    org_role: "general_member",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"
  }
];

const INITIAL_DOCUMENTS = [
  {
    id: "doc-1",
    title: "Annual Orientation Event Plan SOP",
    description: "Detailed walkthrough for coordinating the freshmen welcoming ceremony, including program flow, venue layout, and contact list.",
    type: "SOP",
    role_access: "general_member",
    file_name: "Annual_Orientation_2026_SOP.pdf",
    file_size: "1.2 MB",
    uploaded_at: "2026-04-12T10:30:00Z",
    uploaded_by: "Sarah Jenkins"
  },
  {
    id: "doc-2",
    title: "Media Kit & Branding Guidelines",
    description: "Official color codes, typography, logos, and post templates to be used across all social media channels.",
    type: "SOP",
    role_access: "committee_head",
    file_name: "PR_Branding_Guide_v3.pdf",
    file_size: "4.5 MB",
    uploaded_at: "2026-05-01T14:15:00Z",
    uploaded_by: "Elena Rostova"
  },
  {
    id: "doc-3",
    title: "Q1 Financial Ledger & Budget Balance",
    description: "Confidential financial ledger covering membership dues, event spending, sponsorship earnings, and equipment rentals.",
    type: "Report",
    role_access: "executive_board",
    file_name: "Q1_Financials_Secret.xlsx",
    file_size: "820 KB",
    uploaded_at: "2026-05-10T09:00:00Z",
    uploaded_by: "Marcus Chen"
  },
  {
    id: "doc-4",
    title: "Annual Sponsorship Portfolio & Deals",
    description: "Executive deck containing contract templates, pricing tiers, and contact sheets for active brand sponsors.",
    type: "Report",
    role_access: "admin",
    file_name: "Executive_Sponsor_Portfolio_2026.pdf",
    file_size: "5.7 MB",
    uploaded_at: "2026-05-18T16:45:00Z",
    uploaded_by: "Sarah Jenkins"
  },
  {
    id: "doc-5",
    title: "Freshmen Welcoming 2026 Project Report",
    description: "Wrap-up presentation summarizing participation rates, volunteer feedback, and areas of improvement.",
    type: "Project",
    role_access: "general_member",
    file_name: "Welcoming_Event_WrapUp.pptx",
    file_size: "8.1 MB",
    uploaded_at: "2026-05-20T11:20:00Z",
    uploaded_by: "Alex Patel"
  }
];

const INITIAL_CHECKLISTS = [
  {
    id: "chk-1",
    title: "Finalize Annual Financial Audit",
    description: "Upload the comprehensive audit report detailing revenues, assets, and sponsorships for the upcoming term.",
    role_access: "executive_board",
    required_type: "Report",
    keywords: ["financial", "ledger", "audit", "budget"],
    status: "Completed",
    completed_doc_id: "doc-3"
  },
  {
    id: "chk-2",
    title: "Sponsor Decks and Portfolio Upload",
    description: "Hand over active corporate sponsorship decks and partnership agreements for next year's executive board.",
    role_access: "executive_board",
    required_type: "Report",
    keywords: ["sponsor", "sponsorship", "portfolio", "deal"],
    status: "Completed",
    completed_doc_id: "doc-4"
  },
  {
    id: "chk-3",
    title: "Create PR/Social Media Kits & Templates",
    description: "Document all designs and branding tools so the next PR head can maintain consistent messaging.",
    role_access: "committee_head",
    required_type: "SOP",
    keywords: ["pr", "media", "branding", "kit", "template"],
    status: "Completed",
    completed_doc_id: "doc-2"
  },
  {
    id: "chk-4",
    title: "Publish Executive Handover & Election Notes",
    description: "Upload notes on standard leadership transition processes, voting protocols, and calendar details.",
    role_access: "admin",
    required_type: "Report",
    keywords: ["handover", "transition", "election", "notes"],
    status: "Pending",
    completed_doc_id: null
  },
  {
    id: "chk-5",
    title: "Upload Operational Event Plan Guide",
    description: "Write down the event SOP for organizing logistics, room bookings, and university permits.",
    role_access: "committee_head",
    required_type: "SOP",
    keywords: ["operational", "event", "plan", "permit", "room"],
    status: "Pending",
    completed_doc_id: null
  }
];

const initializeStorage = () => {
  if (!localStorage.getItem("orgvault_documents")) {
    localStorage.setItem("orgvault_documents", JSON.stringify(INITIAL_DOCUMENTS));
  }
  if (!localStorage.getItem("orgvault_checklists")) {
    localStorage.setItem("orgvault_checklists", JSON.stringify(INITIAL_CHECKLISTS));
  }
  if (!localStorage.getItem("orgvault_current_user")) {
    localStorage.setItem("orgvault_current_user", JSON.stringify(MOCK_USERS[0]));
  }
};

initializeStorage();

export const supabaseMock = {
  auth: {
    getUser: () => {
      initializeStorage();
      return JSON.parse(localStorage.getItem("orgvault_current_user"));
    },
    getUsersList: () => MOCK_USERS,
    setUser: (userId) => {
      const user = MOCK_USERS.find(u => u.id === userId);
      if (user) {
        localStorage.setItem("orgvault_current_user", JSON.stringify(user));
        return user;
      }
      return null;
    }
  },

  documents: {
    select: (currentUserRole) => {
      initializeStorage();
      const docs = JSON.parse(localStorage.getItem("orgvault_documents"));
      const userRank = ROLE_RANKING[currentUserRole] || 0;
      return docs.filter(doc => {
        const requiredRank = ROLE_RANKING[doc.role_access] || 0;
        return userRank >= requiredRank;
      });
    },

    insert: (newDoc, currentUser) => {
      initializeStorage();
      const docs = JSON.parse(localStorage.getItem("orgvault_documents"));
      
      const document = {
        id: `doc-${Date.now()}`,
        uploaded_at: new Date().toISOString(),
        uploaded_by: currentUser.name,
        file_size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
        ...newDoc
      };

      docs.unshift(document);
      localStorage.setItem("orgvault_documents", JSON.stringify(docs));
      supabaseMock.checklists.updateProgressForUpload(document);
      return document;
    },

    delete: (docId) => {
      initializeStorage();
      let docs = JSON.parse(localStorage.getItem("orgvault_documents"));
      docs = docs.filter(doc => doc.id !== docId);
      localStorage.setItem("orgvault_documents", JSON.stringify(docs));

      let checklists = JSON.parse(localStorage.getItem("orgvault_checklists"));
      checklists = checklists.map(chk => {
        if (chk.completed_doc_id === docId) {
          return {
            ...chk,
            status: "Pending",
            completed_doc_id: null
          };
        }
        return chk;
      });
      localStorage.setItem("orgvault_checklists", JSON.stringify(checklists));
    }
  },

  checklists: {
    select: (currentUserRole) => {
      initializeStorage();
      const checklists = JSON.parse(localStorage.getItem("orgvault_checklists"));
      const userRank = ROLE_RANKING[currentUserRole] || 0;
      return checklists.filter(chk => {
        const requiredRank = ROLE_RANKING[chk.role_access] || 0;
        return userRank >= requiredRank;
      });
    },

    updateProgressForUpload: (document) => {
      initializeStorage();
      const checklists = JSON.parse(localStorage.getItem("orgvault_checklists"));
      const titleLower = document.title.toLowerCase();
      const descriptionLower = document.description.toLowerCase();

      const updatedChecklists = checklists.map(chk => {
        if (chk.status === "Completed") return chk;
        const typeMatches = chk.required_type === document.type;
        const keywordMatches = chk.keywords.some(kw => 
          titleLower.includes(kw) || descriptionLower.includes(kw)
        );

        if (typeMatches && keywordMatches) {
          return {
            ...chk,
            status: "Completed",
            completed_doc_id: document.id
          };
        }
        return chk;
      });

      localStorage.setItem("orgvault_checklists", JSON.stringify(updatedChecklists));
    },

    resetAll: () => {
      localStorage.removeItem("orgvault_documents");
      localStorage.removeItem("orgvault_checklists");
      localStorage.removeItem("orgvault_current_user");
      initializeStorage();
      return true;
    }
  }
};

export default supabaseMock;
