import Link from 'next/link';

export default function SharePage({ params }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'var(--font-body)', color: 'var(--warm-cream)', gap: 16, textAlign: 'center', padding: 20 }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28 }}>Share Card</h1>
      <p style={{ fontSize: 15, opacity: 0.8 }}>Public team page: {params.id}</p>
      <Link className="btn primary" href="/">Return to Town Hub</Link>
    </div>
  );
}
