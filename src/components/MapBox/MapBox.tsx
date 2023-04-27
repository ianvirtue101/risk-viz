import React, { useEffect, useRef } from "react";
import mapboxgl, { LngLatBoundsLike, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DataItem } from "../../app/api/types";
import clustersKmeans from "@turf/clusters-kmeans";
import { featureCollection, point } from "@turf/helpers";

interface MapBoxProps {
  data: DataItem[];
}

const MapBox: React.FC<MapBoxProps> = ({ data }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Marker[]>([]);

  // Debugging: log the data and the clusteredPoints
  // console.log("Data:", data);

  useEffect(() => {
    // Initialize the map
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
    mapRef.current = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-100.746, 46.8797],
      zoom: 3,
    });

    // Add navigation controls to the map
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      // Clean up the map
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && data.length > 0) {
      // Remove existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Convert data to GeoJSON points
      const points = data.map((item) => point([item.long, item.lat]));

      // Cluster the points using K-means clustering
      const clusteredPoints = clustersKmeans(featureCollection(points));

      // Render the clustered markers
      clusteredPoints.features.forEach((feature: any) => {
        const [longitude, latitude] = feature.geometry.coordinates;
        const clusterSize = feature.properties.cluster
          ? feature.properties.point_count
          : 1;
        const markerElement = document.createElement("div");
        markerElement.className = "cluster-marker";
        markerElement.style.width = `${10 + 2 * Math.sqrt(clusterSize)}px`;
        markerElement.style.height = `${10 + 2 * Math.sqrt(clusterSize)}px`;
        markerElement.style.borderRadius = "50%";
        markerElement.style.backgroundColor = "rgba(0, 0, 255, 0.6)";

        console.log("Marker coordinates:", longitude, latitude);

        const marker = new Marker({ element: markerElement })
          .setLngLat([longitude, latitude])
          .addTo(mapRef.current!);

        markersRef.current.push(marker);
      });

      console.log("Rendering markers:", clusteredPoints.features.length);
    }
  }, [data]);

  return <div id="map" style={{ width: "100%", height: "100%" }} />;
};

export default MapBox;
