'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import { setAccessToken } from '@/lib/api';
import { StyleProvider } from '@ant-design/cssinjs'; // <-- важно

function TokenInitializer() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.accessToken) {
      setAccessToken(session.accessToken);
    }
  }, [session]);

  return null;
}

export default function SessionWrapper({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <StyleProvider hashPriority="high">
        <TokenInitializer />
        {children}
      </StyleProvider>
    </SessionProvider>
  );
}
