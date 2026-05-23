import React, { createContext, useContext, useState, useEffect } from 'react';
import supabaseService from '../services/supabaseService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'checklist', 'settings'
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveMode] = useState(supabaseService.isLive());

  // Load initial data
  useEffect(() => {
    refreshState();
  }, []);

  const refreshState = async () => {
    setIsLoading(true);
    try {
      const user = await supabaseService.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        const docs = await supabaseService.getDocuments(user.org_role);
        const chks = await supabaseService.getChecklists(user.org_role);
        setDocuments(docs);
        setChecklists(chks);
      } else {
        setDocuments([]);
        setChecklists([]);
      }
    } catch (err) {
      console.error("Error refreshing state: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const switchRole = async (userId) => {
    setIsLoading(true);
    try {
      const user = await supabaseService.switchUser(userId, currentUser);
      if (user) {
        setCurrentUser(user);
        const docs = await supabaseService.getDocuments(user.org_role);
        const chks = await supabaseService.getChecklists(user.org_role);
        setDocuments(docs);
        setChecklists(chks);
        
        if (user.org_role === 'general_member' && activeTab === 'checklist') {
          setActiveTab('dashboard');
          showNotification("Switched to General Member. Checklist is restricted to officers.", "info");
        } else {
          const roleLabel = user.org_role.replace('_', ' ').toUpperCase();
          showNotification(`Switched role to: ${roleLabel} (${user.name})`, "info");
        }
      }
    } catch (err) {
      showNotification("Failed to switch role.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email, password) => {
    setIsLoading(true);
    try {
      const user = await supabaseService.signInWithPassword(email, password);
      setCurrentUser(user);
      if (user) {
        const docs = await supabaseService.getDocuments(user.org_role);
        const chks = await supabaseService.getChecklists(user.org_role);
        setDocuments(docs);
        setChecklists(chks);
        showNotification("Signed in successfully!");
      }
      return user;
    } catch (error) {
      showNotification(error.message || "Invalid credentials", "error");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (email, password, name, role) => {
    setIsLoading(true);
    try {
      const user = await supabaseService.signUp(email, password, name, role);
      setCurrentUser(user);
      if (user) {
        const docs = await supabaseService.getDocuments(user.org_role);
        const chks = await supabaseService.getChecklists(user.org_role);
        setDocuments(docs);
        setChecklists(chks);
        showNotification("Account registered successfully!");
      }
      return user;
    } catch (error) {
      showNotification(error.message || "Failed to create account", "error");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabaseService.signOut();
      setCurrentUser(null);
      setDocuments([]);
      setChecklists([]);
      setActiveTab('dashboard');
      showNotification("Logged out successfully.", "info");
    } catch (error) {
      showNotification("Sign out failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDoc = async (newDoc, file) => {
    setIsLoading(true);
    try {
      const doc = await supabaseService.uploadDocument(newDoc, file, currentUser);
      showNotification(`"${doc.title}" uploaded successfully!`);
      await refreshState();
      setIsUploadOpen(false);
      return doc;
    } catch (error) {
      showNotification(error.message || "Failed to upload document", "error");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDoc = async (docId) => {
    setIsLoading(true);
    try {
      await supabaseService.deleteDocument(docId);
      showNotification("Document deleted successfully.", "info");
      await refreshState();
    } catch (err) {
      showNotification("Failed to delete document.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetDatabase = async () => {
    setIsLoading(true);
    try {
      await supabaseService.resetDatabase();
      await refreshState();
      showNotification("Database reset to default records.", "info");
    } catch (err) {
      showNotification("Failed to reset database.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-rose-500/10 text-rose-700 border-rose-500/25';
      case 'executive_board':
        return 'bg-purple-500/10 text-purple-700 border-purple-500/25';
      case 'committee_head':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/25';
      case 'general_member':
      default:
        return 'bg-teal-500/10 text-teal-700 border-teal-500/25';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'President (Admin)';
      case 'executive_board':
        return 'Executive VP';
      case 'committee_head':
        return 'Committee Head';
      case 'general_member':
      default:
        return 'General Member';
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        documents,
        checklists,
        activeTab,
        setActiveTab,
        isUploadOpen,
        setIsUploadOpen,
        notification,
        showNotification,
        switchRole,
        loginWithEmail,
        signUpWithEmail,
        logout,
        uploadDoc,
        deleteDoc,
        resetDatabase,
        getRoleBadgeColor,
        getRoleLabel,
        usersList: supabaseService.getUsersList(),
        isLoading,
        isLiveMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
