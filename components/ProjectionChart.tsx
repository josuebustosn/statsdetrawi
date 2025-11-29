'use client';

import { useMemo, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Area,
    ComposedChart
} from 'recharts';

interface DailyStats {
    date: string;
    followers: number;
    change: number;
}

interface ProjectionChartProps {
    history: DailyStats[];
    currentFollowers: number;
}

export default function ProjectionChart({ history, currentFollowers }: ProjectionChartProps) {
    const [simulatedGrowth, setSimulatedGrowth] = useState<string>('');

    const data = useMemo(() => {
        if (!history || history.length < 2) return [];

        // 1. Prepare Historical Data
        const chartData = history.map(h => ({
            date: h.date,
            timestamp: new Date(h.date).getTime(),
            actual: h.followers as number | null,
            projected: null as number | null,
            isProjection: false
        }));

        // 2. Calculate Growth Rate
        let avgDailyGrowth = 0;

        if (simulatedGrowth && parseFloat(simulatedGrowth) > 0) {
            avgDailyGrowth = parseFloat(simulatedGrowth);
        } else {
            // Exclude today from average calculation because it's incomplete
            const today = new Date().toISOString().split('T')[0];
            const completedDays = history.filter(h => h.date !== today);

            if (completedDays.length === 0) {
                // If we only have today's data, we can't project based on history yet.
                // Unless we want to use today's partial data as a fallback, but user requested to ignore it.
                avgDailyGrowth = 0;
            } else {
                // Average of last 7 COMPLETED days
                const recentHistory = completedDays.slice(-7);
                const totalGrowth = recentHistory.reduce((acc, day) => acc + day.change, 0);
                avgDailyGrowth = totalGrowth / recentHistory.length;
            }
        }

        if (avgDailyGrowth <= 0) return chartData; // No growth to project

        // 3. Project Future
        const lastDay = history[history.length - 1];
        let currentCount = lastDay.followers;
        let currentDate = new Date(lastDay.date);

        // Connect the lines
        chartData[chartData.length - 1].projected = currentCount;

        const maxTarget = 10000;

        // Limit projection to 2 years or until max target reached + buffer
        let daysProjected = 0;
        const maxDays = 730;

        while (currentCount < maxTarget * 1.1 && daysProjected < maxDays) {
            daysProjected++;
            currentDate.setDate(currentDate.getDate() + 1);
            currentCount += avgDailyGrowth;

            chartData.push({
                date: currentDate.toISOString().split('T')[0],
                timestamp: currentDate.getTime(),
                actual: null,
                projected: Math.round(currentCount),
                isProjection: true
            });
        }

        return chartData;
    }, [history, simulatedGrowth]);

    if (history.length === 0) {
        return (
            <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Proyección de Crecimiento</h3>
                <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.7 }}>
                    <p>Se necesitan al menos 2 días de datos para generar una proyección.</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Vuelve mañana para ver tu curva de crecimiento.</p>
                </div>
            </div>
        );
    }

    const formatXAxis = (tickItem: string) => {
        const date = new Date(tickItem + 'T00:00:00');
        return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    };

    const formatYAxis = (tickItem: number) => {
        if (tickItem >= 1000) return `${(tickItem / 1000).toFixed(1)}k`;
        return tickItem.toString();
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.5rem' }}>Proyección de Crecimiento</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Simular Crecimiento Diario:</label>
                    <input
                        type="number"
                        value={simulatedGrowth}
                        onChange={(e) => setSimulatedGrowth(e.target.value)}
                        placeholder="Auto"
                        style={{
                            padding: '0.4rem',
                            borderRadius: '6px',
                            border: '1px solid var(--card-border)',
                            background: 'rgba(0,0,0,0.2)',
                            color: 'var(--foreground)',
                            width: '80px'
                        }}
                    />
                </div>
            </div>

            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatXAxis}
                            stroke="var(--text-muted)"
                            fontSize={12}
                            minTickGap={50}
                        />
                        <YAxis
                            tickFormatter={formatYAxis}
                            stroke="var(--text-muted)"
                            fontSize={12}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--card-bg)', border: 'var(--glass-border)', borderRadius: '8px' }}
                            labelStyle={{ color: 'var(--foreground)' }}
                            formatter={(value: number, name: string) => [value.toLocaleString('es-ES'), name === 'actual' ? 'Real' : 'Proyección']}
                            labelFormatter={(label) => new Date(label + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        />

                        {/* Actual Data Area */}
                        <Area
                            type="monotone"
                            dataKey="actual"
                            stroke="var(--primary)"
                            fillOpacity={1}
                            fill="url(#colorActual)"
                            strokeWidth={2}
                        />

                        {/* Projected Data Line (Dashed/Faded) */}
                        <Line
                            type="monotone"
                            dataKey="projected"
                            stroke="var(--accent)"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />

                        {/* Milestones Reference Lines */}
                        {[1000, 5000, 10000].map(milestone => (
                            <ReferenceLine
                                key={milestone}
                                y={milestone}
                                stroke="var(--success)"
                                strokeDasharray="3 3"
                                label={{
                                    value: `${milestone / 1000}k`,
                                    position: 'right',
                                    fill: 'var(--success)',
                                    fontSize: 12
                                }}
                            />
                        ))}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
