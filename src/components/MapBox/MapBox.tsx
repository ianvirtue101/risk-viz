import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Marker, Popup } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DataItem } from "../../app/api/types";

interface MapBoxProps {
  data: DataItem[];
}

// Define the MapBox component
const MapBox: React.FC<MapBoxProps> = ({ data }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [decadeYear, setDecadeYear] = useState(2030);

  // Initialize the map on component mount
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
    mapRef.current = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-100.746, 46.8797],
      zoom: 3,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    mapRef.current.addControl(new mapboxgl.FullscreenControl());

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  // Create and update markers on the map based on the data and decadeYear
  useEffect(() => {
    if (!mapRef.current) return;

    // Function to create marker elements and add them to the map
    const createMarkerElements = (item: DataItem) => {
      const markerElement = document.createElement("div");
      markerElement.className = "marker"; // CSS class to style the marker
      markerElement.style.width = "10px";
      markerElement.style.height = "10px";
      markerElement.style.borderRadius = "50%";

      if (item.riskRating < 0.25) {
        markerElement.style.backgroundColor = "green";
      } else if (item.riskRating < 0.5) {
        markerElement.style.backgroundColor = "orange";
      } else if (item.riskRating < 0.75) {
        markerElement.style.backgroundColor = "red";
      }

      // Create the popup
      const popupContent = `
        <div class="text-gray-800">
          <h3 class="text-xl font-semibold mb-2">${item.assetName}</h3>
          <p class="font-medium">${item.businessCategory}</p>
          <p>Year: ${item.year}</p>
          <p>Risk Rating: ${item.riskRating.toFixed(2)}</p>
        </div>
      `;

      const popup = new Popup({ offset: 25, className: "popup" })
        .setHTML(popupContent)
        .setMaxWidth("300px");

      // Create the marker
      const marker = new Marker({ element: markerElement })
        .setLngLat([item.long, item.lat])
        .addTo(mapRef.current!);

      // Add event listeners to show and hide the popup
      markerElement.addEventListener("mouseenter", () => {
        marker.setPopup(popup).togglePopup(); // Show the popup
      });

      // Remove the popup when the mouse leaves the marker
      markerElement.addEventListener("mouseleave", () => {
        marker.getPopup()?.remove(); // Remove the popup
      });

      markersRef.current.push(marker);
    };

    // Filter the data based on the decadeYear and create markers
    data
      .filter((item: DataItem) => {
        // Filter based on the decadeYear
        if (item.year < decadeYear || item.year >= decadeYear + 10)
          return false;

        // Filter out invalid latitude and longitude values
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
      .forEach(createMarkerElements);

    // Remove all markers when the decadeYear changes
    return () => {
      markersRef.current.forEach((marker) => {
        marker.remove();
      });
      markersRef.current = [];
    };
  }, [mapRef, data, decadeYear]);

  // Update the decadeYear state when the user selects a different decade
  const handleDecadeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDecadeYear(Number(event.target.value));
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <label htmlFor="decadeYear" className="block text-gray-800 font-bold">
            Decade Year:
          </label>
          <select
            id="decadeYear"
            value={decadeYear}
            onChange={handleDecadeChange}
            className="block w-full mt-1 bg-white shadow text-gray-800 p-2 rounded"
          >
            {Array.from({ length: 5 }, (_, i) => 2030 + i * 10).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div
          id="map"
          className="w-full h-[600px] rounded-lg shadow relative mapboxgl-map"
        ></div>
      </div>
    </div>
  );
};

export default MapBox;
