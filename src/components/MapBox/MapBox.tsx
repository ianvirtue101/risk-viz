import React, { useEffect, useRef } from "react";
import mapboxgl, { Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DataItem } from "@/app/api/types";

const Token =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  process.env.NEXT_PUBLIC_DEFAULT_ACCESS_TOKEN;

mapboxgl.accessToken = Token || "";

const MapBox: React.FC<{ data: DataItem[] }> = ({ data }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  console.log(data);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      accessToken: Token,
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0],
      zoom: 1,
    });

    mapRef.current = map;

    return () => {
      // Remove the markers and the map when the component is unmounted
      markersRef.current.forEach((marker) => marker.remove());
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || data.length === 0) return;

    // Remove any existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Iterate through the data and create a marker for each item
    data.forEach((item) => {
      // Check if both longitude and latitude are valid numbers
      if (!isNaN(item.long) && !isNaN(item.lat)) {
        const marker = new Marker()
          .setLngLat([item.long, item.lat]) // Updated property names here
          .addTo(mapRef.current!);
        markersRef.current.push(marker);
      } else {
        console.warn(`Invalid coordinates for item: ${JSON.stringify(item)}`);
      }
    });
    console.log(data);
  }, [data]);

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
