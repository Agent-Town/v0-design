'use client';

import { useState } from 'react';

const MOCK_MESSAGES = [
  { id: 1, from: 'agent', text: 'Howdy, partner! Ready to explore the frontier?' },
  { id: 2, from: 'human', text: 'Show me what services are available.' },
  { id: 3, from: 'agent', text: 'Head over to the Atlas Depot -- plenty of storefronts to browse.' }
];

const DEBUG_TABS = ['tools', 'traffic', 'brain', 'trainer'];

const DEBUG_CONTENT = {
  tools: '> claim.create({ chain: "evm", target: "0x..." })\n  status: resolved (240ms)\n> verify.attestation({ payload: "..." })\n  status: pending...',
  traffic: 'POST /api/claim  200  142ms\nGET  /api/atlas   200   88ms\nPOST /api/verify  202  310ms',
  brain: 'context_tokens: 2,841\nactive_goal: explore_atlas\nconfidence: 0.92\nlast_tool: claim.create',
  trainer: 'run: a-201  pass  score: 94%\nrun: a-200  pass  score: 91%\nrun: a-199  fail  score: 62%'
};

export default function AgentDock() {
  const [expanded, setExpanded] = useState(true);
  const [debugOpen, setDebugOpen] = useState(false);
  const [activeDebugTab, setActiveDebugTab] = useState('tools');
  const [inputVal, setInputVal] = useState('');

  return (
    <>
      {/* Debug Drawer (above dock) */}
      {debugOpen && (
        <div className="debugDrawer">
          <div className="debugHeader">
            <div className="debugTabs">
              {DEBUG_TABS.map((tab) => (
                <button
                  key={tab}
                  className={`debugTab${activeDebugTab === tab ? ' active' : ''}`}
                  type="button"
                  onClick={() => setActiveDebugTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              className="btnIcon"
              type="button"
              aria-label="Close debug"
              onClick={() => setDebugOpen(false)}
              style={{ background: 'transparent', border: '1.5px solid var(--aged-brass)', color: 'var(--sand)', width: 28, height: 28, fontSize: 13 }}
            >
              {'X'}
            </button>
          </div>
          <div className="debugContent">
            {DEBUG_CONTENT[activeDebugTab] || 'No data.'}
          </div>
        </div>
      )}

      {/* Main Dock */}
      <section className="dock" data-testid="prototype-agent-dock">
        <div className="dockHead">
          <span className="dockLabel">Agent Dock</span>
          <div className="chip">
            <span className="statusDot active" />
            {'session: active'}
          </div>
          <div className="dockActions">
            <button
              className="btnIcon"
              type="button"
              aria-label="Toggle debug panel"
              title="Debug"
              onClick={() => setDebugOpen((v) => !v)}
              style={debugOpen ? { background: 'linear-gradient(180deg, var(--ochre), #a87030)', color: 'var(--warm-cream)' } : undefined}
            >
              {/* Wrench icon */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.5 2a4 4 0 0 0-3.46 6L2 13l1 1 5-5.04A4 4 0 1 0 10.5 2z" />
              </svg>
            </button>
            <button
              className="btnIcon"
              type="button"
              aria-label={expanded ? 'Minimize dock' : 'Expand dock'}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? '\u25BC' : '\u25B2'}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="dockBody">
            <div className="chat">
              <div className="chatMessages">
                {MOCK_MESSAGES.map((msg) => (
                  <div key={msg.id} className={`chatBubble ${msg.from}`}>
                    {msg.text}
                  </div>
                ))}
              </div>
            </div>
            <div className="chatInputRow">
              <input
                className="chatInput"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Send a telegram..."
                aria-label="Message agent"
              />
              <button className="sendBtn" type="button" aria-label="Send message">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M1 8l6-6v4h8v4H7v4L1 8z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
