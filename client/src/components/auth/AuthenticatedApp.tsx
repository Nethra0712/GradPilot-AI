import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import RouteLoading from '@/components/common/RouteLoading';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import DocumentsPage from '@/pages/documents/DocumentsPage';
import SettingsPage from '@/pages/settings/SettingsPage';

/**
 * AuthenticatedApp router wrapper.
 * Resolves the authenticated user state, renders the DashboardLayout,
 * and hosts all protected sub-routes (/dashboard, /profile, /documents, /settings).
 */
export const AuthenticatedApp: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <RouteLoading />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        {/* Default route redirecting to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Core Protected Sub-routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Fallback to NotFound route */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AuthenticatedApp;
