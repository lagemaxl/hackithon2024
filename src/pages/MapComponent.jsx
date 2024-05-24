import React, { useState, useMemo, useEffect } from 'react';
import { Map } from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer, ArcLayer } from '@deck.gl/layers';
import { scaleQuantile } from 'd3-scale';

const blueColor = [0, 0, 255];

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
      getSourceColor: () => blueColor,
      getTargetColor: () => blueColor,
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
