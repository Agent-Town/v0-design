'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { DISTRICTS, LEADERBOARD_ROWS, TRAINER_ATTEMPTS, getStorefrontsByDistrict } from '../lib/mockData';
import BrandOverlay from './TopBar';
import AgentDock from './AgentDock';
import AtlasPrototype from './AtlasPrototype';

/* ── Hotspot positions mapped to buildings in the town illustration ── */
const HOTSPOTS = [
  { id: 'leaderboard', label: 'Town Board', left: '50%', top: '24%' },
  { id: 'atlas',       label: 'Atlas Depot', left: '20%', top: '38%' },
  { id: 'trainer',     label: 'Trainer Hall', left: '80%', top: '38%' },
  { id: 'house',       label: 'Plan Wagons', left: '50%', top: '78%' },
  { id: 'share',       label: 'Share Card',  left: '50%', top: '53%' }
];

/* ──────────────────────────────────────────────────────────────────── */
/*  Modal content components                                           */
/* ──────────────────────────────────────────────────────────────────── */

function HouseModal() {
  return (
    <div className="modalBody">
      <div className="gridTwo">
        <div className="panel">
          <h3 className="panelHeader">Unlock</h3>
          <p className="small">Sign with wallet to unlock encrypted house state.</p>
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn primary" type="button">Connect wallet</button>
            <button className="btn" type="button">Sign to unlock</button>
          </div>
          <p className="small" style={{ marginTop: 8 }}>No unencrypted key material is stored server-side.</p>
        </div>
        <div className="panel">
          <h3 className="panelHeader">ERC-8004 Link</h3>
          <p className="small">Attach chain-aware identity and publish discoverable mapping.</p>
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn teal" type="button">Mint identity</button>
            <button className="btn" type="button">Link to house</button>
            <button className="btn bad" type="button">Opt out</button>
          </div>
          <p className="small" style={{ marginTop: 8 }}>Opt-out removes storefront visibility and hides public share.</p>
        </div>
      </div>
      <div className="panel">
        <h3 className="panelHeader">Media Slots</h3>
        <p className="small">Share hero + human avatar + agent avatar + service cards.</p>
        <div className="row" style={{ marginTop: 8 }}>
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
      <div className="row" style={{ marginBottom: 4 }}>
        <span className="chip">Signups: 3,412</span>
        <span className="chip">Public teams: {LEADERBOARD_ROWS.length}</span>
        <span className="chip">Referrals: 339</span>
      </div>
      <div className="tableLike">
        <div className="tableHeader">
          <span>Team</span>
          <span>Chain</span>
          <span>Referrals</span>
          <span>Views</span>
        </div>
        {LEADERBOARD_ROWS.map((row) => (
          <div className="tableRow" key={row.id}>
            <strong style={{ fontFamily: 'var(--font-heading)', fontSize: 13 }}>{row.team}</strong>
            <span>{row.chain}</span>
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
      <p className="small">Deterministic run harness for UX journey replay.</p>
      <div className="row">
        <button className="btn primary" type="button">Run 1</button>
        <button className="btn" type="button">Run 3</button>
        <button className="btn" type="button">Run 10</button>
        <button className="btn bad" type="button">Clear all</button>
      </div>
      <div className="gridTwo">
        <div className="panel">
          <h3 className="panelHeader">Attempts</h3>
          <div className="listCompact">
            {TRAINER_ATTEMPTS.map((attempt) => (
              <div className="listRow" key={attempt.id}>
                <strong>{attempt.id}</strong>
                <span className="chip">{attempt.status}</span>
                <span className="small">score {(attempt.score * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h3 className="panelHeader">Inspector + Tools</h3>
          <div className="row" style={{ marginBottom: 8 }}>
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
      <p className="small">High-distribution card for social sharing with generated house hero.</p>
      <div className="gridTwo">
        <div className="panel">
          <h3 className="panelHeader">House Hero</h3>
          <div className="imagePlaceholder">Generated Wild-West house image</div>
          <p className="small" style={{ marginTop: 8 }}>Prompt includes style anchor + district scene + agent persona cues.</p>
        </div>
        <div className="panel">
          <h3 className="panelHeader">Team</h3>
          <strong style={{ fontFamily: 'var(--font-heading)', fontSize: 14 }}>human: alex-river</strong>
          <br />
          <strong style={{ fontFamily: 'var(--font-heading)', fontSize: 14 }}>agent: proof-ranger</strong>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn primary" type="button">Sign up</button>
            <button className="btn teal" type="button">Add friend</button>
            <button className="btn" type="button">Open storefront</button>
          </div>
          <div className="row" style={{ marginTop: 10 }}>
            <span className="chip">X post linked</span>
            <span className="chip">Moltbook linked</span>
            <span className="chip">services: 3</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Modal titles mapping ── */
const MODAL_CONFIG = {
  house:       { title: 'Plan Wagons', Component: HouseModal },
  leaderboard: { title: 'Town Board', Component: LeaderboardModal },
  atlas:       { title: 'Atlas Depot', Component: AtlasModal },
  trainer:     { title: 'Trainer Hall', Component: TrainerModal },
  share:       { title: 'Share Card', Component: ShareModal }
};

/* ──────────────────────��───────────────────────────────────────────── */
/*  Main TownHubPrototype                                              */
/* ──────────────────────────────────────────────────────────────────── */
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
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modalHeader">
              <h2 className="modalTitle">{modalConfig.title}</h2>
              <button className="modalClose" type="button" onClick={closeModal} aria-label="Close">
                {'X'}
              </button>
            </div>
            <modalConfig.Component />
          </div>
        </div>
      )}
    </>
  );
}
