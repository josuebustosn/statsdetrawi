'use client';

interface DailyStats {
    date: string;
    followers: number;
    change: number;
}

export default function GrowthCalendar({ history = [] }: { history: DailyStats[] }) {
    // Take the last 30 entries
    const recentHistory = history.slice(-30);

    // Calculate monthly total
    const monthlyTotal = recentHistory.reduce((sum, day) => sum + day.change, 0);

    if (recentHistory.length === 0) {
        return (
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Crecimiento (30 Días)</h3>
                <p style={{ opacity: 0.6 }}>No hay datos históricos disponibles aún.</p>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <h3 style={{ fontSize: '1.5rem' }}>Crecimiento (30 días)</h3>
                <span style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '20px',
                    background: monthlyTotal >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: monthlyTotal >= 0 ? 'var(--success)' : 'var(--danger)',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                }}>
                    {monthlyTotal > 0 ? '+' : ''}{monthlyTotal} este mes
                </span>
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
                gap: '0.8rem'
            }}>
                {recentHistory.map((day, index) => (
                    <div
                        key={index}
                        className="calendar-day"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            background: day.change >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            border: `1px solid ${day.change >= 0 ? 'var(--success)' : 'var(--danger)'}`,
                            color: day.change >= 0 ? 'var(--success)' : 'var(--danger)',
                            cursor: 'default',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                    >
                        <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                            {new Date(day.date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </span>
                        <span style={{ fontWeight: 'bold' }}>{day.change > 0 ? '+' : ''}{day.change}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
