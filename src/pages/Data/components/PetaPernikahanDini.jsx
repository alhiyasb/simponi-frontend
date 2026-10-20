import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { getPetaPernikahanDini } from '../../../services/api';

const RISK_STYLE = {
  tinggi: { color: '#DC2626', label: 'Risiko Tinggi' },
  sedang: { color: '#F59E0B', label: 'Risiko Sedang' },
  rendah: { color: '#10B981', label: 'Risiko Rendah' },
};

const DEFAULT_COLOR = '#CBD5E1';
const JABAR_CENTER = [-6.9, 107.6];
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function formatNumber(num) {
  return Number(num || 0).toLocaleString('id-ID', {
    maximumFractionDigits: 2,
  });
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getRisk(feature) {
  return String(feature?.properties?.tingkat_risiko || '').toLowerCase();
}

function featureStyle(feature, zoom = 8) {
  const risk = RISK_STYLE[getRisk(feature)];

  if (zoom >= 12) {
    return {
      fillColor: risk?.color || DEFAULT_COLOR,
      fillOpacity: 0,
      color: '#ffffff',
      opacity: 0,
      weight: 0,
    };
  }

  return {
    fillColor: risk?.color || DEFAULT_COLOR,
    fillOpacity: 0.38,
    color: '#ffffff',
    weight: 1.25,
  };
}

function RiskGeoJSON({ data, layerKey }) {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    const updateStyleForZoom = () => {
      layerRef.current?.eachLayer((layer) => {
        layer.setStyle(featureStyle(layer.feature, map.getZoom()));
      });
    };

    map.on('zoomend', updateStyleForZoom);
    updateStyleForZoom();

    return () => map.off('zoomend', updateStyleForZoom);
  }, [map]);

  const onEachFeature = (feature, layer) => {
    const props = feature.properties || {};

    layer.bindTooltip(props.nama_kabupaten || '-', { sticky: true });
    layer.bindPopup(buildPopupHtml(props));

    layer.on({
      mouseover: (event) =>
        event.target.setStyle({
          weight: 2.5,
          fillOpacity: map.getZoom() >= 12 ? 0 : 0.4,
        }),
      mouseout: (event) =>
        event.target.setStyle(featureStyle(feature, map.getZoom())),
    });
  };

  return (
    <LayersControl.Overlay checked name="Tingkat risiko wilayah">
      <GeoJSON
        ref={layerRef}
        key={layerKey}
        data={data}
        style={(feature) => featureStyle(feature, map.getZoom())}
        onEachFeature={onEachFeature}
      />
    </LayersControl.Overlay>
  );
}

function buildPopupHtml(props) {
  const risk = RISK_STYLE[String(props.tingkat_risiko || '').toLowerCase()];

  return `
    <div style="min-width:180px;font-family:inherit">
      <p style="margin:0 0 6px;font-weight:800;font-size:14px">
        ${escapeHtml(props.nama_kabupaten || '-')}
      </p>
      <p style="margin:0;font-size:12px">
        Jumlah kasus: <b>${formatNumber(props.jumlah_kasus)}</b>
      </p>
      <p style="margin:0;font-size:12px">
        Rata-rata Jabar: <b>${formatNumber(props.rata_rata_kasus)}</b>
      </p>
      <p style="margin:0;font-size:12px">
        Di atas rata-rata: <b>${props.di_atas_rata_rata ? 'Ya' : 'Tidak'}</b>
      </p>
      <p style="margin:6px 0 0;font-size:12px">
        Tingkat risiko:
        <b style="color:${risk?.color || '#64748b'}">${risk?.label || '-'}</b>
      </p>
      ${
        props.tahun
          ? `<p style="margin:4px 0 0;font-size:11px;color:#64748b">Tahun ${escapeHtml(
              props.tahun
            )}</p>`
          : ''
      }
    </div>
  `;
}

export default function PetaPernikahanDini({ availableYears = [] }) {
  const [tahun, setTahun] = useState('');
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError('');

        const geojson = await getPetaPernikahanDini({
          tahun: tahun || undefined,
        });

        if (!cancelled) {
          if (!geojson || !Array.isArray(geojson.features)) {
            throw new Error('Format respons bukan GeoJSON.');
          }

          setGeoData(geojson);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError('Gagal memuat data peta pernikahan dini.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [tahun, reloadKey]);

  const riskSummary = useMemo(() => {
    const summary = { tinggi: 0, sedang: 0, rendah: 0 };

    (geoData?.features || []).forEach((feature) => {
      const risk = getRisk(feature);
      if (risk in summary) summary[risk] += 1;
    });

    return summary;
  }, [geoData]);

  return (
    <section className="mt-12">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#155DFC]">
            Pelacakan Wilayah
          </p>

          <h2 className="mt-1 text-2xl font-black text-slate-900">
            Peta Sebaran Pernikahan Dini
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Warna wilayah menunjukkan tingkat risiko berdasarkan jumlah kasus
            dibandingkan rata-rata Jawa Barat. Klik wilayah untuk melihat
            detail.
          </p>
        </div>

        <div className="w-full md:w-48">
          <label
            htmlFor="peta-tahun"
            className="mb-2 block text-xs font-semibold text-slate-600"
          >
            Tahun
          </label>

          <select
            id="peta-tahun"
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#155DFC] focus:ring-2 focus:ring-[#155DFC]/20"
          >
            <option value="">Semua tahun</option>

            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* "isolate" menjaga z-index Leaflet agar tidak menimpa Navbar */}
      <div className="relative isolate overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        {error ? (
          <div className="flex h-[520px] flex-col items-center justify-center p-6 text-center">
            <p className="font-semibold text-red-700">{error}</p>

            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="mt-4 rounded-full bg-[#155DFC] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0f47d6]"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <>
            {loading && (
              <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/60">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#155DFC] border-t-transparent" />
              </div>
            )}

            <MapContainer
              center={JABAR_CENTER}
              zoom={8}
              minZoom={6}
              maxZoom={19}
              dragging
              scrollWheelZoom
              style={{ height: 520, width: '100%' }}
            >
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Peta jalan">
                  <TileLayer
                    attribution={TILE_ATTRIBUTION}
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxNativeZoom={19}
                    maxZoom={19}
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Peta jalan detail">
                  <TileLayer
                    attribution="Tiles &copy; Esri"
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                    maxNativeZoom={19}
                    maxZoom={19}
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Peta satelit">
                  <TileLayer
                    attribution="Imagery &copy; Esri, Maxar, Earthstar Geographics"
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    maxNativeZoom={19}
                    maxZoom={19}
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Peta topografi">
                  <TileLayer
                    attribution="Tiles &copy; Esri"
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                    maxNativeZoom={19}
                    maxZoom={19}
                  />
                </LayersControl.BaseLayer>

                {geoData?.features?.length > 0 && (
                  <RiskGeoJSON
                    layerKey={`${tahun || 'semua'}-${reloadKey}`}
                    data={geoData}
                  />
                )}
              </LayersControl>
            </MapContainer>

            {/* LEGENDA */}
            <div className="absolute bottom-4 left-4 z-[1000] rounded-xl border border-slate-200 bg-white/95 p-3 text-xs shadow-md">
              <p className="mb-2 font-bold text-slate-800">Tingkat Risiko</p>

              {Object.entries(RISK_STYLE).map(([key, item]) => (
                <div key={key} className="mb-1 flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />

                  <span className="text-slate-600">
                    {item.label} ({riskSummary[key]})
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}