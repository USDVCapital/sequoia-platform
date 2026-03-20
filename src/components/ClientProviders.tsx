'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { BookingProvider } from '@/contexts/BookingContext';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ProgressProvider>
          <BookingProvider>
            {children}
          </BookingProvider>
        </ProgressProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
