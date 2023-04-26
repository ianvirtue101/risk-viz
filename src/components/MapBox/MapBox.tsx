"use client";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

import { DataItem } from "../../app/api/data/route";

const Token =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  process.env.NEXT_PUBLIC_DEFAULT_ACCESS_TOKEN;

mapboxgl.accessToken = Token || "";

const MapBox: React.FC<{ data: DataItem[] }> = ({ data }) => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        accessToken: Token,
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [0, 0],
        zoom: 1,
      });

      map.on("load", () => {
        // data goes here
      });

      return () => {
        map.remove();
      };
    }
  }, [mapContainer, data]);

  return (
    <div
      ref={mapContainer}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default MapBox;
