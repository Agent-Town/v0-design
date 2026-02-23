'use client';

import { useMemo, useState } from 'react';
import {
  DISTRICTS,
  getDistrictById,
  getStorefrontsByDistrict,
  searchStorefronts
} from '../lib/mockData';

function districtScale(agentCount) {
  const base = Math.log10(Math.max(agentCount, 10));
  return Math.max(1, Math.round(base * 1.4));
}

export default function AtlasPrototype() {
  const [query, setQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [activeDistrict, setActiveDistrict] = useState('ethereum');
  const [selectedStorefrontId, setSelectedStorefrontId] = useState('');

  const filteredStorefronts = useMemo(
    () => searchStorefronts(query, districtFilter),
    [query, districtFilter]
  );

  const activeStorefront = useMemo(() => {
    if (!selectedStorefrontId) return null;
    return filteredStorefronts.find((entry) => entry.id === selectedStorefrontId) || null;
  }, [filteredStorefronts, selectedStorefrontId]);

  const activeDistrictData = getDistrictById(activeDistrict);
  const districtAgents = getStorefrontsByDistrict(activeDistrict);

  return (
    <div className="atlasGrid">
      <div className="row" style={{ marginBottom: 4, flexWrap: 'wrap', gap: 8 }}>
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services, chains, agents..."
          aria-label="Search storefronts"
          style={{ flex: '1 1 200px', minWidth: 0 }}
        />
        <select
          className="input"
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          aria-label="Filter by district"
          style={{ flex: '0 1 200px' }}
        >
          <option value="">All districts</option>
          {DISTRICTS.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      {/* District Map */}
      <div className="atlasMap" role="img" aria-label="Atlas district graph">
        {DISTRICTS.map((district) => (
          <button
            key={district.id}
            className="atlasNode"
            style={{
              left: district.x,
              top: district.y,
              transform: `scale(${districtScale(district.agentCount) / 3.5})`
            }}
            type="button"
            onClick={() => setActiveDistrict(district.id)}
          >
            <strong>{district.name}</strong>
            <div className="small">Agents: {district.agentCount.toLocaleString()}</div>
          </button>
        ))}
      </div>

      {/* Active District Details */}
      <div className="panel" style={{ margin: 0 }}>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <h3 className="panelHeader" style={{ margin: 0 }}>
            {activeDistrictData ? activeDistrictData.name : 'District'}
          </h3>
          <span className="chip">services: {activeDistrictData?.serviceCount.toLocaleString() || 0}</span>
        </div>
        <p className="small" style={{ marginBottom: 8 }}>Scene: {activeDistrictData?.scene || 'n/a'}</p>
        <div className="listCompact">
          {districtAgents.map((entry) => (
            <div className="listRow" key={entry.id}>
              <strong style={{ fontFamily: 'var(--font-heading)', fontSize: 13 }}>{entry.name}</strong>
              <button className="btn" type="button" onClick={() => setSelectedStorefrontId(entry.id)}>
                Open storefront
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Market Cards */}
      <div className="panel" style={{ margin: 0 }}>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <h3 className="panelHeader" style={{ margin: 0 }}>Storefront Market</h3>
          <span className="chip">results: {filteredStorefronts.length}</span>
        </div>
        <div className="market">
          {filteredStorefronts.map((entry) => (
            <button
              type="button"
              className="marketCard"
              key={entry.id}
              onClick={() => setSelectedStorefrontId(entry.id)}
            >
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <strong>{entry.name}</strong>
                <span className="chip">{entry.chain}</span>
              </div>
              <div className="small">{entry.summary}</div>
              <div className="row">
                {entry.services.map((service) => (
                  <span className="chip" key={`${entry.id}-${service}`}>
                    {service}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Storefront Detail (nested overlay) */}
      {activeStorefront ? (
        <div
          className="modalBackdrop"
          role="presentation"
          onClick={() => setSelectedStorefrontId('')}
          style={{ zIndex: 55 }}
        >
          <section
            className="modal"
            role="dialog"
            aria-label="Storefront detail"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 700 }}
          >
            <div className="modalHeader">
              <h2 className="modalTitle">{activeStorefront.name}</h2>
              <button className="modalClose" type="button" onClick={() => setSelectedStorefrontId('')} aria-label="Close">
                {'X'}
              </button>
            </div>
            <div className="modalBody">
              <div className="gridTwo">
                <div className="panel" style={{ margin: 0 }}>
                  <h3 className="panelHeader">Agent</h3>
                  <code className="small" style={{ wordBreak: 'break-all' }}>{activeStorefront.id}</code>
                  <p className="small" style={{ marginTop: 8 }}>{activeStorefront.summary}</p>
                  <p className="small">
                    Endpoint: <code style={{ fontSize: 12 }}>{activeStorefront.endpoint}</code>
                  </p>
                </div>
                <div className="panel" style={{ margin: 0 }}>
                  <h3 className="panelHeader">Actions</h3>
                  <div className="row">
                    <button className="btn primary" type="button">Preview service</button>
                    <button className="btn teal" type="button">Open share hero</button>
                    <button className="btn bad" type="button">Opt out request</button>
                  </div>
                  <p className="small" style={{ marginTop: 8 }}>
                    Opt-out requires ERC-8004 ownership signature and soft-deletes the house.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
