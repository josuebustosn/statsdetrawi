'use client';

import { useState, useEffect } from 'react';
import FollowerCounter from '@/components/FollowerCounter';
import GrowthCalendar from '@/components/GrowthCalendar';
import Calculators from '@/components/Calculators';
import ProjectionChart from '@/components/ProjectionChart';
import ThemeToggle from '@/components/ThemeToggle';

import Image from 'next/image';

interface DashboardData {
  profile: {
    followers: number;
    profilePicUrl?: string;
  };
  history: any[]; // We can refine this if we export the type from storage
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const username = 'trawi.viajes';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/followers?username=${username}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every 60s
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Image
            src="/trawi-logo.jpg"
            alt="Trawi Logo"
            width={50}
            height={50}
            style={{ borderRadius: '8px' }}
          />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>TrawiStats</h1>
        </div>
        <ThemeToggle />
      </header>

      <div className="grid" style={{ gap: '2rem' }}>
        {/* Top Section: Counter and Calendar */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <FollowerCounter
            username={username}
            followers={data?.profile?.followers || 0}
            profilePicUrl={data?.profile?.profilePicUrl || ''}
            loading={loading && !data}
          />
          <GrowthCalendar history={data?.history || []} />
        </div>

        {/* Bottom Section: Calculators */}
        <section>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', opacity: 0.8 }}>Herramientas</h2>
          <Calculators
            currentFollowers={data?.profile?.followers || 0}
            history={data?.history || []}
          />
        </section>

        {/* Projection Chart */}
        <section>
          <ProjectionChart
            currentFollowers={data?.profile?.followers || 0}
            history={data?.history || []}
          />
        </section>
      </div>
    </main>
  );
}
