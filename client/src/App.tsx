import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import MarketingLayout from './layouts/MarketingLayout';
import LandingPage from './pages/marketing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UnauthorizedPage from './pages/common/UnauthorizedPage';
import NotFoundPage from './pages/common/NotFoundPage';
import AuthenticatedApp from './components/auth/AuthenticatedApp';

// Initialize TanStack React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Root Application component.
 * Registers global providers (QueryClient, AuthProvider) and mounts top-level routes.
 */
export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Marketing Route */}
            <Route element={<MarketingLayout />}>
              <Route path="/" element={<LandingPage />} />
            </Route>

            {/* Public Authentication Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Standard Error & Fallback pages */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/404" element={<NotFoundPage />} />

            {/* Protected Routes Wrapper */}
            <Route path="/*" element={<AuthenticatedApp />} />

            {/* Redirect any unhandled route to 404 */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
