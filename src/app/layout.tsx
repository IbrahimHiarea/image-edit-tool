'use client';

import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';

// You can still keep your viewport definition if needed.
export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <LocalizationProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>{children}</ThemeProvider>
          </QueryClientProvider>
        </LocalizationProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
