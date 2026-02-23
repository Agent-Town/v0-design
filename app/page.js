'use client';

import { Component } from 'react';
import dynamic from 'next/dynamic';

const TownHubPrototype = dynamic(() => import('../components/TownHubPrototype'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#2E1B0E', color: '#FFE4A0', fontFamily: 'Georgia, serif', fontSize: 24 }}>
      Loading Agent Town...
    </div>
  )
});

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error: error.message };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, background: '#2E1B0E', color: '#FFE4A0', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#c96a4a', marginBottom: 16 }}>Something went wrong</h1>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#F5E6C8' }}>{this.state.error}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function HomePage() {
  return (
    <ErrorBoundary>
      <TownHubPrototype />
    </ErrorBoundary>
  );
}
