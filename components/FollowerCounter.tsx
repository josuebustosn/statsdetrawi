'use client';



interface FollowerCounterProps {
    followers: number;
    username: string;
    profilePicUrl: string;
    loading?: boolean;
}

export default function FollowerCounter({ followers, username, profilePicUrl, loading = false }: FollowerCounterProps) {
    if (loading) {
        return <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <h1 className="text-gradient" style={{ fontSize: '5rem', fontWeight: '800', lineHeight: 1 }}>
                {followers.toLocaleString('es-ES')}
            </h1>
            <p style={{ color: 'var(--success)', fontSize: '1.2rem' }}>Seguidores</p>
        </div>
    );
}
