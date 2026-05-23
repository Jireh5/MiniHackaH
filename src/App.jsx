import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import DocumentHub from './components/DocumentHub';
import TurnoverChecklist from './components/TurnoverChecklist';
import SettingsAdmin from './components/SettingsAdmin';
import UploadModal from './components/UploadModal';
import Login from './components/Login';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Loader2
} from 'lucide-react';

const AppContent = () => {
  const { currentUser, activeTab, notification, isLoading } = useApp();

  // If initializing session, show loading spinner inside glass panel
  if (isLoading && !currentUser) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-tr from-sky-100 via-teal-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center space-y-3 shadow-xl">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Checking Session...</span>
        </div>
      </div>
    );
  }

  // If no user session exists, display the login auth gateway
  if (!currentUser) {
    return <Login />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DocumentHub />;
      case 'checklist':
        return <TurnoverChecklist />;
      case 'settings':
        return <SettingsAdmin />;
      default:
        return <DocumentHub />;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-sky-600" />;
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/35 text-emerald-800';
      case 'error':
        return 'bg-rose-500/10 border-rose-500/35 text-rose-800';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/35 text-amber-800';
      case 'info':
      default:
        return 'bg-sky-500/10 border-sky-500/35 text-sky-800';
    }
  };

  return (
    <>
      <Layout>
        {renderTab()}
      </Layout>
      <UploadModal />

      {/* Global Glassmorphic Toast Notifications */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md shadow-lg ${getNotificationStyle(notification.type)}`}>
            {getNotificationIcon(notification.type)}
            <span className="text-xs font-bold tracking-tight">{notification.message}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
