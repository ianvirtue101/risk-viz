import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import mapboxgl, { Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DataItem } from "../../app/api/types";
import IndividualMarker from "../IndividualMarker/IndividualMarker";

interface MapBoxProps {
  data: DataItem[];
}

const MapBox: React.FC<MapBoxProps> = ({ data }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [markerElements, setMarkerElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
    mapRef.current = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-100.746, 46.8797],
      zoom: 3,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
  
    const newMarkerElements = data
      .filter((item: DataItem) => {
        if (
          item.lat < -90 ||
          item.lat > 90 ||
          item.long < -180 ||
          item.long > 180
        ) {
          console.warn("Invalid latitude or longitude:", item);
          return false;
        }
        return true;
      })
      .map((item: DataItem) => {
        const markerElement = document.createElement("div");
        markerElement.style.width = "10px";
        markerElement.style.height = "10px";
        markerElement.style.backgroundColor = "red";
        markerElement.style.borderRadius = "50%";
  
        try {
          const marker = new Marker({ element: markerElement })
            .setLngLat([item.long, item.lat]) // Swap latitude and longitude
            .addTo(mapRef.current!);
  
          markersRef.current.push(marker);
          return null;
        } catch (error) {
          console.error("Error creating marker:", error, item);
          return null;
        }
      });
  
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [mapRef, data]);
  return (
    <div id="map" style={{ width: "100%", height: "100%" }}>
      {markerElements}
    </div>
  );
};

export default MapBox;
