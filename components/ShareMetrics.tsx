'use client';

import { useState, useRef } from 'react';

interface ShareMetricsProps {
    currentFollowers: number;
    history: { date: string; followers: number; change: number }[];
}

type Period = 'today' | 'week' | 'month';

export default function ShareMetrics({ currentFollowers, history }: ShareMetricsProps) {
    const [period, setPeriod] = useState<Period>('today');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const getMetrics = () => {
        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Caracas' });

        if (period === 'today') {
            const todayEntry = history.find(h => h.date === today);
            return {
                label: 'Hoy',
                change: todayEntry?.change || 0,
                dateRange: new Date().toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    timeZone: 'America/Caracas'
                })
            };
        }

        if (period === 'week') {
            const last7 = history.slice(-7);
            const change = last7.reduce((sum, d) => sum + d.change, 0);
            return {
                label: 'Esta Semana',
                change,
                dateRange: 'Últimos 7 días'
            };
        }

        // month
        const last30 = history.slice(-30);
        const change = last30.reduce((sum, d) => sum + d.change, 0);
        const monthName = new Date().toLocaleDateString('es-ES', { month: 'long', timeZone: 'America/Caracas' });
        return {
            label: 'Este Mes',
            change,
            dateRange: monthName.charAt(0).toUpperCase() + monthName.slice(1) + ' 2025'
        };
    };

    const generateImage = async () => {
        setIsGenerating(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const metrics = getMetrics();
        const size = 600;
        canvas.width = size;
        canvas.height = size;

        // Load background image (Trawayana)
        const bgImage = new Image();
        bgImage.crossOrigin = 'anonymous';

        await new Promise<void>((resolve) => {
            bgImage.onload = () => resolve();
            bgImage.onerror = () => resolve();
            bgImage.src = '/Trawayana.png';
        });

        // Draw blurred background (even less blur)
        ctx.filter = 'blur(10px) brightness(0.4)';
        ctx.drawImage(bgImage, -50, -50, size + 100, size + 100);
        ctx.filter = 'none';

        // Dark overlay for better readability (less opacity)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, size, size);

        // Accent line at top
        const accentGradient = ctx.createLinearGradient(0, 0, size, 0);
        accentGradient.addColorStop(0, '#3291ff');
        accentGradient.addColorStop(1, '#d946ef');
        ctx.fillStyle = accentGradient;
        ctx.fillRect(0, 0, size, 5);

        // Load logo
        const logo = new Image();
        logo.crossOrigin = 'anonymous';

        await new Promise<void>((resolve) => {
            logo.onload = () => resolve();
            logo.onerror = () => resolve();
            logo.src = '/Trawi_Logo_Sinfondo.png';
        });

        // Draw logo (top right, smaller, more transparent)
        const logoSize = 40;
        ctx.globalAlpha = 0.6;
        ctx.drawImage(logo, size - logoSize - 40, 30, logoSize, logoSize);
        ctx.globalAlpha = 1.0;

        // Main metric with gradient color (aligned with text below)
        const changeText = (metrics.change >= 0 ? '+' : '') + metrics.change.toLocaleString('en-US');
        ctx.font = 'bold 120px Inter, system-ui, sans-serif';

        // Create gradient for the number
        const textGradient = ctx.createLinearGradient(40, 200, 400, 320);
        textGradient.addColorStop(0, '#3291ff');
        textGradient.addColorStop(1, '#d946ef');
        ctx.fillStyle = metrics.change >= 0 ? textGradient : '#f87171';
        ctx.fillText(changeText, 28, 280);

        // Label with "en @trawi.viajes" (aligned with number)
        ctx.fillStyle = '#ffffff';
        ctx.font = '28px Inter, system-ui, sans-serif';
        ctx.fillText('seguidores ' + metrics.label.toLowerCase() + ' en @trawi.viajes', 40, 330);

        // Total followers
        ctx.fillStyle = '#a1a1a1';
        ctx.font = '20px Inter, system-ui, sans-serif';
        ctx.fillText(`Total: ${currentFollowers.toLocaleString('en-US')} seguidores en Instagram`, 40, 390);

        // Date at bottom left (with year)
        const dateWithYear = new Date().toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'America/Caracas'
        });
        ctx.fillStyle = '#888888';
        ctx.font = '14px Inter, system-ui, sans-serif';
        ctx.fillText(dateWithYear, 40, size - 30);

        // Watermark - bottom right
        ctx.textAlign = 'right';
        ctx.fillText('TrawiStats 1.2 ©', size - 40, size - 50);
        ctx.fillText('stats.trawi.net', size - 40, size - 30);
        ctx.textAlign = 'left';

        setIsGenerating(false);
        return canvas.toDataURL('image/png');
    };

    const handleCopy = async () => {
        const dataUrl = await generateImage();
        if (!dataUrl) return;

        try {
            const blob = await (await fetch(dataUrl)).blob();
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (e) {
            // Fallback: download instead
            handleDownload();
        }
    };

    const handleDownload = async () => {
        const dataUrl = await generateImage();
        if (!dataUrl) return;

        const link = document.createElement('a');
        link.download = `trawistats-${period}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    const periods: { value: Period; label: string }[] = [
        { value: 'today', label: 'Hoy' },
        { value: 'week', label: 'Semana' },
        { value: 'month', label: 'Mes' },
    ];

    return (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>📤 Compartir Logros</h3>

            {/* Period Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {periods.map((p) => (
                    <button
                        key={p.value}
                        onClick={() => setPeriod(p.value)}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            background: period === p.value
                                ? 'linear-gradient(135deg, var(--primary), var(--accent))'
                                : 'var(--card-bg)',
                            color: period === p.value ? 'white' : 'var(--text-muted)',
                            fontWeight: period === p.value ? '600' : '400',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Preview */}
            <div style={{
                background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                textAlign: 'center'
            }}>
                <p style={{ fontSize: '0.8rem', color: '#a1a1a1', marginBottom: '0.5rem' }}>
                    {getMetrics().dateRange}
                </p>
                <p style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: getMetrics().change >= 0 ? '#34d399' : '#f87171'
                }}>
                    {getMetrics().change >= 0 ? '+' : ''}{getMetrics().change}
                </p>
                <p style={{ fontSize: '0.9rem', color: 'white' }}>
                    seguidores {getMetrics().label.toLowerCase()}
                </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                    onClick={handleCopy}
                    disabled={isGenerating}
                    style={{
                        flex: 1,
                        padding: '0.7rem',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        background: 'var(--primary)',
                        color: 'white',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {showSuccess ? '✓ Copiado!' : '📋 Copiar imagen'}
                </button>
                <button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    style={{
                        flex: 1,
                        padding: '0.7rem',
                        borderRadius: '8px',
                        border: '1px solid var(--card-border)',
                        cursor: 'pointer',
                        background: 'transparent',
                        color: 'var(--foreground)',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                    }}
                >
                    💾 Descargar imagen
                </button>
            </div>

            {/* Hidden Canvas */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
}
