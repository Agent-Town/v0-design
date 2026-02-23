'use client';

import { useMemo, useState } from 'react';
import {
  DISTRICTS,
  getDistrictById,
  getStorefrontsByDistrict,
  searchStorefronts
} from '../lib/mockData';

/* Scale district node size by agent count */
function districtScale(agentCount) {
  const base = Math.log10(Math.max(agentCount, 10));
  return Math.max(1, Math.round(base * 1.4));
}

/* Family icon for the district type */
function familyIcon(family) {
  if (family === 'EVM') return '\u{26D3}';
  if (family === 'Solana') return '\u{2600}';
  return '\u{1F30E}';
}

export default function AtlasPrototype() {
  const [query, setQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [activeDistrict, setActiveDistrict] = useState('ethereum');
  const [selectedStorefrontId, setSelectedStorefrontId] = useState('');
  const [mapView, setMapView] = useState(true);

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
      {/* Search bar styled as a frontier office search */}
      <div className="atlasSearchBar">
        <span className="atlasSearchIcon" aria-hidden="true">{'\u{1F50D}'}</span>
        <input
          className="atlasSearchInput"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the frontier..."
          aria-label="Search storefronts"
        />
        <select
          className="atlasFilterSelect"
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          aria-label="Filter by district"
        >
          <option value="">All districts</option>
          {DISTRICTS.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
        <button
          className="btnIcon"
          type="button"
          onClick={() => setMapView(!mapView)}
          aria-label={mapView ? 'Switch to list view' : 'Switch to map view'}
          title={mapView ? 'List view' : 'Map view'}
        >
          {mapView ? '\u{2630}' : '\u{1F5FA}'}
        </button>
      </div>

      {/* The Map */}
      {mapView ? (
        <div className="atlasMap" role="img" aria-label="Atlas district map">
          {/* Compass rose */}
          <div className="atlasCompass" aria-hidden="true">
            <span className="atlasCompassN">N</span>
            <div className="atlasCompassRose" />
          </div>

          {/* Trail lines connecting districts */}
          <svg className="atlasTrails" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {DISTRICTS.map((d, i) => {
              const next = DISTRICTS[(i + 1) % DISTRICTS.length];
              return (
                <line
                  key={`trail-${d.id}`}
                  x1={parseFloat(d.x)} y1={parseFloat(d.y)}
                  x2={parseFloat(next.x)} y2={parseFloat(next.y)}
                  stroke="rgba(139,125,60,0.35)"
                  strokeWidth="0.4"
                  strokeDasharray="1.5,1.5"
                />
              );
            })}
          </svg>

          {/* District plot markers */}
          {DISTRICTS.map((district) => {
            const isActive = district.id === activeDistrict;
            const scale = districtScale(district.agentCount);
            return (
              <button
                key={district.id}
                className={`atlasPlot ${isActive ? 'active' : ''}`}
                style={{ left: district.x, top: district.y }}
                type="button"
                onClick={() => setActiveDistrict(district.id)}
                aria-label={`${district.name} - ${district.agentCount} agents`}
              >
                <div className="atlasPlotBuilding" style={{ transform: `scale(${0.7 + scale * 0.12})` }}>
                  {/* Roof */}
                  <div className="atlasPlotRoof" />
                  {/* Body */}
                  <div className="atlasPlotBody">
                    <span className="atlasPlotIcon">{familyIcon(district.family)}</span>
                  </div>
                </div>
                <div className="atlasPlotSign">
                  <strong>{district.name.split(' ')[0]}</strong>
                </div>
                <div className="atlasPlotCount">
                  {district.agentCount.toLocaleString()} agents
                </div>
                {isActive && <div className="atlasPlotGlow" />}
              </button>
            );
          })}

          {/* Map legend */}
          <div className="atlasLegend">
            <div className="atlasLegendTitle">Frontier Map</div>
            <div className="atlasLegendRow">
              <span className="atlasLegendDot" style={{ background: 'var(--ochre)' }} />
              <span>EVM District</span>
            </div>
            <div className="atlasLegendRow">
              <span className="atlasLegendDot" style={{ background: 'var(--faded-teal)' }} />
              <span>Solana District</span>
            </div>
            <div className="atlasLegendRow">
              <span className="atlasLegendDot" style={{ background: 'transparent', border: '1.5px dashed var(--aged-brass)' }} />
              <span>Trail route</span>
            </div>
          </div>
        </div>
      ) : (
        /* List view fallback */
        <div className="atlasListView">
          {DISTRICTS.map((district) => (
            <button
              key={district.id}
              className={`atlasListItem ${district.id === activeDistrict ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveDistrict(district.id)}
            >
              <span className="atlasListIcon">{familyIcon(district.family)}</span>
              <div className="atlasListInfo">
                <strong>{district.name}</strong>
                <span className="small">{district.scene}</span>
              </div>
              <div className="atlasListStats">
                <span className="chip">{district.agentCount.toLocaleString()}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Active District Detail */}
      {activeDistrictData && (
        <div className="atlasDetail">
          <div className="atlasDetailHeader">
            <div className="atlasDetailTitle">
              <span className="atlasDetailIcon">{familyIcon(activeDistrictData.family)}</span>
              <h3>{activeDistrictData.name}</h3>
            </div>
            <div className="row" style={{ gap: 6 }}>
              <span className="chip">{activeDistrictData.agentCount.toLocaleString()} agents</span>
              <span className="chip">{activeDistrictData.serviceCount.toLocaleString()} services</span>
            </div>
          </div>
          <p className="atlasDetailScene">{activeDistrictData.scene}</p>

          {/* Agents as storefront cards within the district */}
          <div className="atlasStorefronts">
            {districtAgents.map((entry) => (
              <button
                type="button"
                className="atlasStorefrontCard"
                key={entry.id}
                onClick={() => setSelectedStorefrontId(entry.id)}
              >
                <div className="atlasStorefrontSign">{entry.name}</div>
                <div className="small">{entry.summary}</div>
                <div className="row" style={{ gap: 4, marginTop: 'auto' }}>
                  {entry.services.map((service) => (
                    <span className="chip" key={`${entry.id}-${service}`} style={{ fontSize: 10, padding: '2px 8px' }}>
                      {service}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Full Market Search Results */}
      {(query || districtFilter) && (
        <div className="panel" style={{ margin: 0 }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            <h3 className="panelHeader" style={{ margin: 0, border: 'none', padding: 0 }}>
              Search Results
            </h3>
            <span className="chip">found: {filteredStorefronts.length}</span>
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
      )}

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
            data-theme="atlas"
            role="dialog"
            aria-label="Storefront detail"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 700 }}
          >
            <div className="modalHeader">
              <span className="modalHeaderIcon" aria-hidden="true">{'\u{1F3EA}'}</span>
              <h2 className="modalTitle">{activeStorefront.name}</h2>
              <button className="modalClose" type="button" onClick={() => setSelectedStorefrontId('')} aria-label="Close">
                {'\u2715'}
              </button>
            </div>
            <div className="modalBody">
              <div className="gridTwo">
                <div className="panel" style={{ margin: 0 }}>
                  <h3 className="panelHeader">{'\u{1F916}'} Agent</h3>
                  <code className="small" style={{ wordBreak: 'break-all' }}>{activeStorefront.id}</code>
                  <p className="small" style={{ marginTop: 8 }}>{activeStorefront.summary}</p>
                  <p className="small">
                    Endpoint: <code style={{ fontSize: 12 }}>{activeStorefront.endpoint}</code>
                  </p>
                </div>
                <div className="panel" style={{ margin: 0 }}>
                  <h3 className="panelHeader">{'\u{2694}'} Actions</h3>
                  <div className="row">
                    <button className="btn primary" type="button">Preview service</button>
                    <button className="btn teal" type="button">Open share hero</button>
                    <button className="btn bad" type="button">Opt out request</button>
                  </div>
                  <p className="small" style={{ marginTop: 8, fontStyle: 'italic', opacity: 0.7 }}>
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
