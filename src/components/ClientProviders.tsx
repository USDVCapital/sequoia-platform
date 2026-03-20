'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ProgressProvider } from '@/contexts/ProgressContext';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ProgressProvider>
          {children}
        </ProgressProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
