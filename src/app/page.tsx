'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="flex items-center gap-2">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <span className="text-3xl font-headline font-bold">
          Wanderlust India
        </span>
      </div>
      <p className="mt-4 text-lg text-muted-foreground">Redirecting to dashboard...</p>
    </div>
  );
}
