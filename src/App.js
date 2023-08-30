import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "mapbox-gl/dist/mapbox-gl.css";

const App = () => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_YOUR_MAPBOX_KEY;

    const newMap = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [2.2, 41.9],
      zoom: 6,
    });

    setMap(newMap);

    return () => newMap.remove();
  }, []);

  useEffect(() => {
    if (map) {
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
        },
      });

      const initialPolygon = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [2.0, 42.0],
                  [2.0, 42.2],
                  [2.2, 42.2],
                  [2.2, 42.0],
                  [2.0, 42.0],
                ],
              ],
            },
          },
        ],
      };

      map.addControl(draw);
      draw.add(initialPolygon);

      map.on("draw.selectionchange", (event) => {
        const selectedFeatures = event.features;
        if (selectedFeatures.length === 1) {
          draw.changeMode("direct_select", {
            featureId: selectedFeatures[0].id,
          });
        }
      });

      map.on("draw.update", (event) => {
        const updatedFeatures = event.features;
        updatedFeatures.forEach((feature) => {
          const newCoordinates = feature.geometry.coordinates[0];
          console.log("Updated coordinates:", newCoordinates);
        });
      });

      return () => {
        map.removeControl(draw);
      };
    }
  }, [map]);

  return (
    <div className="map-container">
      <div
        id="map"
        style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
        className="map"
      />
    </div>
  );
};

export default App;
