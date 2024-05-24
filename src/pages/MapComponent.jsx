import React, { useState, useMemo, useEffect } from 'react';
import { Map } from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer, ArcLayer } from '@deck.gl/layers';
import { scaleQuantile } from 'd3-scale';

export const inFlowColors = [
  [255, 255, 204],
  [199, 233, 180],
  [127, 205, 187],
  [65, 182, 196],
  [29, 145, 192],
  [34, 94, 168],
  [12, 44, 132]
];

export const outFlowColors = [
  [255, 255, 178],
  [254, 217, 118],
  [254, 178, 76],
  [253, 141, 60],
  [252, 78, 42],
  [227, 26, 28],
  [177, 0, 38]
];

const INITIAL_VIEW_STATE = {
  longitude: 14.0323,
  latitude: 50.6611,
  zoom: 8,
  maxZoom: 15,
  pitch: 30,
  bearing: 30
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';

function calculateArcs(data, selectedCounty) {
  if (!data || !data.length) {
    return null;
  }
  if (!selectedCounty) {
    selectedCounty = data[0]; // Select first entry as default
  }
  const arcs = data.map(f => ({
    source: selectedCounty,
    target: f,
    value: Math.random() * 100, // Placeholder value for arcs
    quantile: 0
  }));

  const scale = scaleQuantile()
    .domain(arcs.map(a => Math.abs(a.value)))
    .range(inFlowColors.map((c, i) => i));

  arcs.forEach(a => {
    a.quantile = scale(Math.abs(a.value));
  });

  return arcs;
}

function getTooltip({ object }) {
  return object && object.msg && `Sensor ID: ${object.msg.id_senzoru}`;
}

function MapComponent({
  data,
  strokeWidth = 1,
  mapStyle = MAP_STYLE
}) {
  const [selectedCounty, selectCounty] = useState();

  const arcs = useMemo(() => calculateArcs(data, selectedCounty), [data, selectedCounty]);

  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const layers = [
    new GeoJsonLayer({
      id: 'geojson',
      data,
      stroked: false,
      filled: true,
      getFillColor: [0, 0, 0, 0],
      onClick: ({ object }) => selectCounty(object),
      pickable: true
    }),
    new ArcLayer({
      id: 'arc',
      data: arcs,
      getSourcePosition: d => [d.source.msg.lon, d.source.msg.lat],
      getTargetPosition: d => [d.target.msg.lon, d.target.msg.lat],
      getSourceColor: d => (d.value > 0 ? inFlowColors : outFlowColors)[d.quantile],
      getTargetColor: d => (d.value > 0 ? outFlowColors : inFlowColors)[d.quantile],
      getWidth: strokeWidth
    })
  ];

  return (
    <div className='map'>
      <DeckGL
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        getTooltip={getTooltip}
      >
        <Map reuseMaps mapStyle={mapStyle} />
      </DeckGL>
    </div>
  );
}

export default MapComponent;
