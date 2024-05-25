import React, { useState, useMemo, useEffect } from "react";
import { Map } from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer, ArcLayer } from "@deck.gl/layers";
import { Layer } from "deck.gl";

const blueColor = [0, 0, 255];
const whiteColor = [255, 255, 255];

const INITIAL_VIEW_STATE = {
  longitude: 14.0323,
  latitude: 50.6611,
  zoom: 10,
  maxZoom: 15,
  pitch: 50,
  bearing: 10,
};

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

function calculateArcs(data, selectedCounty) {
  if (!data || !data.length) {
    return null;
  }
  if (!selectedCounty) {
    selectedCounty = {
      name: "unknown",
      latitude: 50.6810518,
      longitude: 14.0069265,
    }; // Select first entry as default
  }
  const arcs = data.map((f) => ({
    source: selectedCounty,
    target: f,
    value: Math.random() * 100, // Placeholder value for arcs
    quantile: 0,
  }));

  return arcs;
}

function MapComponent({ data, strokeWidth = 1, mapStyle = MAP_STYLE }) {
  const [selectedCounty, selectCounty] = useState();
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 100);
    }, 100); // Change 100 to control the speed of the animation
    return () => clearInterval(interval);
  }, []);

  const arcs = useMemo(
    () => calculateArcs(data, selectedCounty),
    [data, selectedCounty]
  );

  const layers = [
    new GeoJsonLayer({
      id: "geojson",
      data,
      stroked: false,
      filled: true,
      getFillColor: whiteColor,
      onClick: ({ object }) => selectCounty(object),
      pickable: true,
    }),
    new ArcLayer({
      id: "arc",
      data: arcs,
      getSourcePosition: (d) => [d.source.longitude, d.source.latitude],
      getTargetPosition: (d) => [d.target.longitude, d.target.latitude],
      getSourceColor: (d) => {
        const t = (animationStep + d.value) % 100;
        return [
          (blueColor[0] * t) / 100,
          (blueColor[1] * t) / 100,
          (blueColor[2] * t) / 100,
        ];
      },
      getTargetColor: (d) => {
        const t = (animationStep + d.value) % 100;
        return [
          (whiteColor[0] * t) / 100,
          (whiteColor[1] * t) / 100,
          (whiteColor[2] * t) / 100,
        ];
      },
      getWidth: (d) => strokeWidth * (4 + Math.sin((animationStep + d.value) * 5)),
      updateTriggers: {
        getSourceColor: animationStep,
        getTargetColor: animationStep,
        getWidth: animationStep,
      },
    }),
  ];

  return (
    <div className="map">
      <DeckGL
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
      >
        <Map reuseMaps mapStyle={mapStyle} />
      </DeckGL>
    </div>
  );
}

export default MapComponent;
