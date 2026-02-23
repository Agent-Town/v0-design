'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { DISTRICTS, LEADERBOARD_ROWS, TRAINER_ATTEMPTS, getStorefrontsByDistrict } from '../lib/mockData';
import BrandOverlay from './TopBar';
import AgentDock from './AgentDock';
import AtlasPrototype from './AtlasPrototype';

/* Hotspot positions mapped to buildings in the town illustration */
const HOTSPOTS = [
  { id: 'leaderboard', label: 'Town Board', left: '50%', top: '24%' },
  { id: 'atlas',       label: 'Atlas Depot', left: '20%', top: '38%' },
  { id: 'trainer',     label: 'Trainer Hall', left: '80%', top: '38%' },
  { id: 'house',       label: 'Plan Wagons', left: '50%', top: '78%' },
  { id: 'share',       label: 'Share Card',  left: '50%', top: '53%' }
];

/* Modal content components */

function HouseModal() {
  return (
    <div className="modalBody">
      <div style={{
        textAlign: 'center',
        padding: '16px 0 8px',
        fontSize: 40,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
      }} aria-hidden="true">
        {'\u{1F512}'}
      </div>
      <p className="small" style={{ textAlign: 'center', maxWidth: 400, margin: '0 auto' }}>
        Your wagon plan is locked. Connect your wallet and sign to unlock your encrypted house state.
      </p>
      <div className="gridTwo">
        <div className="panel">
          <h3 className="panelHeader">{'\u{1F511}'} Unlock Chest</h3>
          <p className="small">Sign with wallet to unlock encrypted house state.</p>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn primary" type="button">Connect wallet</button>
            <button className="btn" type="button">Sign to unlock</button>
          </div>
          <p className="small" style={{ marginTop: 10, fontStyle: 'italic', opacity: 0.7 }}>
            No unencrypted key material is stored server-side.
          </p>
        </div>
        <div className="panel">
          <h3 className="panelHeader">{'\u{26D3}'} ERC-8004 Link</h3>
          <p className="small">Attach chain-aware identity and publish discoverable mapping.</p>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn teal" type="button">Mint identity</button>
            <button className="btn" type="button">Link to house</button>
            <button className="btn bad" type="button">Opt out</button>
          </div>
          <p className="small" style={{ marginTop: 10, fontStyle: 'italic', opacity: 0.7 }}>
            Opt-out removes storefront visibility and hides public share.
          </p>
        </div>
      </div>
      <div className="panel">
        <h3 className="panelHeader">{'\u{1F5BC}'} Media Slots</h3>
        <p className="small">Share hero + human avatar + agent avatar + service cards.</p>
        <div className="row" style={{ marginTop: 10 }}>
          <span className="chip">shareHeroImageUrl</span>
          <span className="chip">humanAvatarImageUrl</span>
          <span className="chip">agentAvatarImageUrl</span>
          <span className="chip">{'serviceCardImages[]'}</span>
        </div>
      </div>
    </div>
  );
}

function LeaderboardModal() {
  return (
    <div className="modalBody">
      <div className="row" style={{ justifyContent: 'center', gap: 12 }}>
        <div className="panel" style={{ textAlign: 'center', flex: '1 1 120px' }}>
          <div style={{ fontSize: 24, marginBottom: 4 }} aria-hidden="true">{'\u{1F465}'}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--dark-wood)' }}>3,412</div>
          <div className="small">Signups</div>
        </div>
        <div className="panel" style={{ textAlign: 'center', flex: '1 1 120px' }}>
          <div style={{ fontSize: 24, marginBottom: 4 }} aria-hidden="true">{'\u{1F3C6}'}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--dark-wood)' }}>{LEADERBOARD_ROWS.length}</div>
          <div className="small">Public teams</div>
        </div>
        <div className="panel" style={{ textAlign: 'center', flex: '1 1 120px' }}>
          <div style={{ fontSize: 24, marginBottom: 4 }} aria-hidden="true">{'\u{1F4E8}'}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--dark-wood)' }}>339</div>
          <div className="small">Referrals</div>
        </div>
      </div>
      <div className="tableLike">
        <div className="tableHeader">
          <span>{'\u{2B50}'} Team</span>
          <span>Chain</span>
          <span>Referrals</span>
          <span>Views</span>
        </div>
        {LEADERBOARD_ROWS.map((row, i) => (
          <div className="tableRow" key={row.id}>
            <strong style={{ fontFamily: 'var(--font-heading)', fontSize: 13 }}>
              {i < 3 ? ['#1 ', '#2 ', '#3 '][i] : ''}{row.team}
            </strong>
            <span className="chip" style={{ fontSize: 10, padding: '2px 8px' }}>{row.chain}</span>
            <span>{row.referrals}</span>
            <span>{row.views}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AtlasModal() {
  return (
    <div className="modalBody">
      <AtlasPrototype />
    </div>
  );
}

function TrainerModal() {
  return (
    <div className="modalBody">
      <div className="panel" style={{ textAlign: 'center', background: 'linear-gradient(180deg, rgba(139,125,60,0.15), transparent)' }}>
        <p className="small" style={{ marginBottom: 10, fontSize: 14 }}>
          {'\u{2694}'} Deterministic run harness for UX journey replay
        </p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <button className="btn primary" type="button">{'\u{25B6}'} Run 1</button>
          <button className="btn" type="button">Run 3</button>
          <button className="btn" type="button">Run 10</button>
          <button className="btn bad" type="button">Clear all</button>
        </div>
      </div>
      <div className="gridTwo">
        <div className="panel">
          <h3 className="panelHeader">{'\u{1F3AF}'} Attempts</h3>
          <div className="listCompact">
            {TRAINER_ATTEMPTS.map((attempt) => {
              const pct = (attempt.score * 100).toFixed(0);
              return (
                <div className="listRow" key={attempt.id}>
                  <strong style={{ fontFamily: 'var(--font-heading)', fontSize: 12 }}>{attempt.id}</strong>
                  <span className="chip">{attempt.status}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 48, height: 6, borderRadius: 3,
                      background: 'var(--sand-dark)',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${pct}%`, height: '100%', borderRadius: 3,
                        background: Number(pct) > 70 ? 'var(--faded-teal)' : 'var(--ochre)'
                      }} />
                    </div>
                    <span className="small">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="panel">
          <h3 className="panelHeader">{'\u{1F527}'} Inspector + Tools</h3>
          <div className="row" style={{ marginBottom: 10 }}>
            <span className="chip">Trace</span>
            <span className="chip">Tool Lab</span>
            <span className="chip">Traffic</span>
            <span className="chip">Session</span>
          </div>
          <pre className="codeBlock">tool.invoke({`{ name: 'claim.create', args: { chain: 'evm' } }`})</pre>
        </div>
      </div>
    </div>
  );
}

function ShareModal() {
  return (
    <div className="modalBody">
      <p className="small" style={{ textAlign: 'center', fontSize: 14 }}>
        {'\u{1F4DC}'} High-distribution card for social sharing with generated house hero.
      </p>
      <div className="gridTwo">
        <div className="panel">
          <h3 className="panelHeader">{'\u{1F3A8}'} House Hero</h3>
          <div className="imagePlaceholder" style={{ minHeight: 200 }}>
            {'\u{1F3E0}'} Generated Wild-West house image
          </div>
          <p className="small" style={{ marginTop: 10, fontStyle: 'italic' }}>
            Prompt includes style anchor + district scene + agent persona cues.
          </p>
        </div>
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 className="panelHeader">{'\u{1F464}'} Team</h3>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 6,
            padding: 12, borderRadius: 'var(--radius-sm)',
            background: 'rgba(91,138,138,0.1)', border: '2px solid rgba(91,138,138,0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }} aria-hidden="true">{'\u{1F920}'}</span>
              <strong style={{ fontFamily: 'var(--font-heading)', fontSize: 13 }}>alex-river</strong>
              <span className="chip" style={{ fontSize: 9 }}>human</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }} aria-hidden="true">{'\u{1F916}'}</span>
              <strong style={{ fontFamily: 'var(--font-heading)', fontSize: 13 }}>proof-ranger</strong>
              <span className="chip" style={{ fontSize: 9 }}>agent</span>
            </div>
          </div>
          <div className="row">
            <button className="btn primary" type="button">Sign up</button>
            <button className="btn teal" type="button">Add friend</button>
            <button className="btn" type="button">Open storefront</button>
          </div>
          <div className="row">
            <span className="chip">X post linked</span>
            <span className="chip">Moltbook linked</span>
            <span className="chip">services: 3</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Modal titles mapping */
const MODAL_CONFIG = {
  house:       { title: 'Plan Wagons', theme: 'house', icon: '\u{1F512}', Component: HouseModal },
  leaderboard: { title: 'Town Board', theme: 'leaderboard', icon: '\u{1F3C6}', Component: LeaderboardModal },
  atlas:       { title: 'Atlas Depot', theme: 'atlas', icon: '\u{1F5FA}', Component: AtlasModal },
  trainer:     { title: 'Trainer Hall', theme: 'trainer', icon: '\u{2694}', Component: TrainerModal },
  share:       { title: 'Share Card', theme: 'share', icon: '\u{1F4DC}', Component: ShareModal }
};

/* --- Main TownHubPrototype --- */
export default function TownHubPrototype() {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = useCallback((id) => setActiveModal(id), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  /* Close modal on Escape */
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') closeModal();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closeModal]);

  const mapSummary = useMemo(() => {
    const totalAgents = DISTRICTS.reduce((sum, d) => sum + d.agentCount, 0);
    const totalServices = DISTRICTS.reduce((sum, d) => sum + d.serviceCount, 0);
    return { totalAgents, totalServices };
  }, []);

  const modalConfig = activeModal ? MODAL_CONFIG[activeModal] : null;

  return (
    <>
      {/* Brand overlay (top-left) */}
      <BrandOverlay onOpenModal={openModal} />

      {/* Town map (full viewport) */}
      <section className="townMap" aria-label="Agent Town map">
        <div className="townMapOverlay" />

        {/* Clickable building hotspots */}
        {HOTSPOTS.map((spot) => (
          <button
            key={spot.id}
            className="districtHotspot"
            style={{ left: spot.left, top: spot.top }}
            type="button"
            onClick={() => openModal(spot.id)}
            aria-label={`Open ${spot.label}`}
          >
            <span className="hotspotPulse" />
            <span className="hotspotLabel">{spot.label}</span>
          </button>
        ))}

        {/* Stats bar at bottom of map */}
        <div className="mapStats">
          <span className="mapChip">districts: {DISTRICTS.length}</span>
          <span className="mapChip">agents: {mapSummary.totalAgents.toLocaleString()}</span>
          <span className="mapChip">services: {mapSummary.totalServices.toLocaleString()}</span>
        </div>
      </section>

      {/* Agent Dock */}
      <AgentDock />

      {/* Modal overlay */}
      {modalConfig && (
        <div className="modalBackdrop" role="presentation" onClick={closeModal}>
          <div
            className="modal"
            role="dialog"
            aria-label={modalConfig.title}
            data-theme={modalConfig.theme}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modalHeader">
              <span className="modalHeaderIcon" aria-hidden="true">{modalConfig.icon}</span>
              <h2 className="modalTitle">{modalConfig.title}</h2>
              <button className="modalClose" type="button" onClick={closeModal} aria-label="Close">
                {'\u2715'}
              </button>
            </div>
            <modalConfig.Component />
          </div>
        </div>
      )}
    </>
  );
}
