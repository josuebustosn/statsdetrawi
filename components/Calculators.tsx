'use client';

import { useState } from 'react';

interface DailyStats {
    date: string;
    followers: number;
    change: number;
}

export default function Calculators({ currentFollowers, history }: { currentFollowers: number, history: DailyStats[] }) {
    const [cpf, setCpf] = useState<string>('0.12');
    const [targetFollowers, setTargetFollowers] = useState<string>('');
    const [dailySpend, setDailySpend] = useState<string>('0');
    const [dailyGrowth, setDailyGrowth] = useState<string>('0');

    const calculateCost = (target: number) => {
        if (target <= currentFollowers) return '$0.00';
        const needed = target - currentFollowers;
        const cost = needed * parseFloat(cpf || '0');
        return cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const calculatedCpf = () => {
        const spend = parseFloat(dailySpend || '0');
        const growth = parseFloat(dailyGrowth || '0');
        if (growth === 0) return '$0.00';
        return (spend / growth).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {/* CPF Projection */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>¿Cuantos $ para llegar a...?</h3>
                <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Tu Costo Por Seguidor (CPF) en $
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '8px',
                                border: '1px solid var(--card-border)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'var(--foreground)',
                                fontSize: '1.1rem'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Cantidad de seguidores deseada
                        </label>
                        <input
                            type="number"
                            value={targetFollowers}
                            onChange={(e) => setTargetFollowers(e.target.value)}
                            placeholder="Ej: 15000"
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '8px',
                                border: '1px solid var(--card-border)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'var(--foreground)',
                                fontSize: '1.1rem'
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {/* Custom Target Result */}
                    {targetFollowers && parseInt(targetFollowers) > currentFollowers && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid var(--success)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span>Para llegar a <strong>{parseInt(targetFollowers).toLocaleString('es-ES')}</strong></span>
                            </div>
                            <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.2rem' }}>{calculateCost(parseInt(targetFollowers))}</span>
                        </div>
                    )}

                    {/* Fixed 10k Milestone */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>Para llegar a <strong>10.000</strong></span>
                        </div>
                        <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{calculateCost(10000)}</span>
                    </div>

                    {/* Fixed 100k Milestone */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>Para llegar a <strong>100.000</strong></span>
                        </div>
                        <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{calculateCost(100000)}</span>
                    </div>
                </div>
            </div>

            {/* Inverse Calculator */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Calculadora de CPF Diario</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Gasto en Ads Hoy ($)
                        </label>
                        <input
                            type="number"
                            value={dailySpend}
                            onChange={(e) => setDailySpend(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '8px',
                                border: '1px solid var(--card-border)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'var(--foreground)',
                                fontSize: '1.1rem'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Seguidores Ganados Hoy
                        </label>
                        <input
                            type="number"
                            value={dailyGrowth}
                            onChange={(e) => setDailyGrowth(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '8px',
                                border: '1px solid var(--card-border)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'var(--foreground)',
                                fontSize: '1.1rem'
                            }}
                        />
                    </div>
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--primary)', borderRadius: '8px', textAlign: 'center' }}>
                        <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.9 }}>CPF Calculado</span>
                        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{calculatedCpf()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
