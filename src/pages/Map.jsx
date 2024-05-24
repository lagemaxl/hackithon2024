/* global fetch */
import React, {useState, useMemo, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {Map} from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import {GeoJsonLayer, ArcLayer} from '@deck.gl/layers';
import {scaleQuantile} from 'd3-scale';

// Source data GeoJSON
const DATA_URL =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/arc/counties.json'; // eslint-disable-line

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
  longitude: 14.0323, // Updated longitude for Ústecký kraj
  latitude: 50.6611,  // Updated latitude for Ústecký kraj
  zoom: 8, // Adjusted zoom level for better visibility
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
    selectedCounty = data.find(f => f.properties.name === 'Los Angeles, CA');
  }
  const {flows} = selectedCounty.properties;

  const arcs = Object.keys(flows).map(toId => {
    const f = data[Number(toId)];
    return {
      source: selectedCounty,
      target: f,
      value: flows[toId],
      quantile: 0
    };
  });

  const scale = scaleQuantile()
    .domain(arcs.map(a => Math.abs(a.value)))
    .range(inFlowColors.map((c, i) => i));

  arcs.forEach(a => {
    a.quantile = scale(Math.abs(a.value));
  });

  return arcs;
}

function getTooltip({object}) {
  return object && object.properties.name;
}

/* eslint-disable react/no-deprecated */
export default function App({
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
      onClick: ({object}) => selectCounty(object),
      pickable: true
    }),
    new ArcLayer({
      id: 'arc',
      data: arcs,
      getSourcePosition: d => d.source.properties.centroid,
      getTargetPosition: d => d.target.properties.centroid,
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

export async function renderToDOM(container) {
  const root = createRoot(container);
  root.render(<App />);

  const resp = await fetch(DATA_URL);
  const {features} = await resp.json();
  root.render(<App data={features} />);
}
