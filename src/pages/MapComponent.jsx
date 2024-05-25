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
  zoom: 8,
  maxZoom: 15,
  pitch: 30,
  bearing: 30,
};

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

function calculateArcs(data, selectedCounty) {
  if (!data || !data.length) {
    return null;
  }
  if (!selectedCounty) {
    selectedCounty =  { name: "unknown", latitude: 50.6810518, longitude: 14.0069265 } // Select first entry as default
  }
  const arcs = data.map((f) => ({
    source: selectedCounty,
    target: f,
    value: Math.random() * 100, // Placeholder value for arcs
    quantile: 0,
  }));

  return arcs;
}


/*
function getTooltip({ object }) {
  return object && object.msg && `Sensor ID: ${object.msg.id_senzoru}`;
}
*/

function MapComponent({ data, strokeWidth = 1, mapStyle = MAP_STYLE }) {
  const [selectedCounty, selectCounty] = useState();
  const [colorState, setColorState] = useState(1);

  useEffect(() => {
    console.log(data);
    calculateArcs(data);
    }, [data]);

  const arcs = useMemo(
    () => calculateArcs(data, selectedCounty),
    [data, selectedCounty]
  );

/**
  useEffect(() => {
    let timer;
    console.log(colorState);
    if (colorState < 5) {
      timer = setTimeout(() => {
        setColorState((prev) => (prev === 4 ? 5 : prev + 1));
      }, 1000); // Changed to 1000ms (1 second) for better visibility
    }
    return () => clearTimeout(timer);
  }, [colorState]);

 */
  const getColors = () => {
    switch (colorState) {
      case 1:
        return { sourceColor: whiteColor, targetColor: blueColor };
      case 2:
        return { sourceColor: blueColor, targetColor: blueColor };
      case 3:
        return { sourceColor: blueColor, targetColor: whiteColor };
      case 4:
        return { sourceColor: whiteColor, targetColor: whiteColor };
      default:
        return { sourceColor: [0, 0, 0, 0], targetColor: [0, 0, 0, 0] }; // Transparent color when arcs are removed
    }
  };

  const { sourceColor, targetColor } = getColors();

  const layers = [
    new GeoJsonLayer({
      id: "geojson",
      data,
      stroked: false,
      filled: true,
      getFillColor: [0, 0, 0, 0],
      onClick: ({ object }) => selectCounty(object),
      pickable: true,
    }),
    new ArcLayer({
      id: "arc",
      data: colorState < 5 ? arcs : [], // Remove arcs when colorState is 5
      getSourcePosition: (d) => [d.source.longitude, d.source.latitude],
      getTargetPosition: (d) => [d.target.longitude, d.target.latitude],
      getSourceColor: () => sourceColor,
      getTargetColor: () => targetColor,
      getWidth: strokeWidth,
      /**
      updateTriggers: {
        getSourceColor: colorState,
        getTargetColor: colorState,
      },
       */
      updateTriggers: {
        getSourceColor: blueColor,
        getTargetColor: blueColor,
      },
    }),
  ];

  return (
    <div className="map">
      <DeckGL
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        //getTooltip={getTooltip}
      >
        <Map reuseMaps mapStyle={mapStyle} />
      </DeckGL>
    </div>
  );
}

export default MapComponent;
