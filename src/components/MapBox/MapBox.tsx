import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Marker, Popup } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DataItem } from "../../app/api/types";

interface MapBoxProps {
  data: DataItem[];
}

const MapBox: React.FC<MapBoxProps> = ({ data }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [markerElements, setMarkerElements] = useState<JSX.Element[]>([]);
  const [decadeYear, setDecadeYear] = useState(2000);

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
        // Filter based on the decadeYear
        if (item.year < decadeYear || item.year >= decadeYear + 10)
          return false;

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
        markerElement.style.borderRadius = "50%";

        if (item.riskRating < 0.25) {
          markerElement.style.backgroundColor = "green";
        } else if (item.riskRating < 0.5) {
          markerElement.style.backgroundColor = "orange";
        } else if (item.riskRating < 0.75) {
          markerElement.style.backgroundColor = "red";
        }

        const popupContent = `
          <div>
            <p>${item.assetName}</p>
            <p>${item.businessCategory}</p>
          </div>
        `;

        const popup = new Popup({ offset: 25 })
          .setHTML(popupContent)
          .setMaxWidth("300px");

        try {
          const marker = new Marker({ element: markerElement })
            .setLngLat([item.long, item.lat])
            .setPopup(popup) // Add the popup to the marker
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
  }, [mapRef, data, decadeYear]);

  const handleDecadeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDecadeYear(Number(event.target.value));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <label htmlFor="decadeYear" className="block text-gray-800">
            Decade Year:
          </label>
          <select
            id="decadeYear"
            value={decadeYear}
            onChange={handleDecadeChange}
            className="block w-full mt-1 bg-white shadow text-gray-800 p-2 rounded"
          >
            {Array.from({ length: 6 }, (_, i) => 2020 + i * 10).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div
          id="map"
          className="w-full h-[600px] rounded-lg shadow relative mapboxgl-map"
        >
          {markerElements}
        </div>
      </div>
    </div>
  );
};

export default MapBox;
