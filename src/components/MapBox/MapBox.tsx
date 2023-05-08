import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Marker, Popup } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DataItem, SelectedDataPoint } from "../../app/api/types";

interface MapBoxProps {
  data: DataItem[];
  selectedDataPoint: SelectedDataPoint | null;
  onDataPointSelection: (dataPoint: SelectedDataPoint) => void;
  setDecadeYear: (year: number) => void;
  decadeYear: number;
}

// Define the MapBox component
const MapBox: React.FC<MapBoxProps> = ({
  data,
  selectedDataPoint,
  onDataPointSelection,
  setDecadeYear,
  decadeYear,
}) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  // const [decadeYear, setDecadeYear] = useState(2030);

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

      // Set the marker element properties

      markerElement.className = "marker"; // CSS class to style the marker
      // Set the marker size based on whether the marker is selected
      if (selectedDataPoint && item.id === selectedDataPoint.id) {
        markerElement.style.width = "20px";
        markerElement.style.height = "20px";
        markerElement.style.border = "2px solid white";
        // zoom to the selected data point
        mapRef.current!.flyTo({
          center: [item.long, item.lat],
          zoom: 6,
        });
        // set the z-index to 1 to bring the marker to the top of the stack
        markerElement.style.zIndex = "1";
      } else {
        markerElement.style.width = "10px";
        markerElement.style.height = "10px";
      }

      // if selectedDataPoint and item.id === selectedDataPoint.id push to top of stack

      // Set the marker color based on the risk rating
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

      // Add event listener to select the data point when the user clicks on the marker
      markerElement.addEventListener("click", () => {
        // Send the selected data point to the parent component
        onDataPointSelection({
          id: item.id,
          riskRating: item.riskRating,
          assetName: item.assetName,
          riskFactors: item.riskFactors,
          businessCategory: item.businessCategory,
          year: item.year,
          lat: item.lat,
          long: item.long,
        });

        // Update the marker size when the selectedDataPoint changes
        if (selectedDataPoint && item.id === selectedDataPoint.id) {
          markerElement.style.width = "20px";
          markerElement.style.height = "20px";
          markerElement.style.border = "2px solid white";
        }
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

    // push the selectedDataPoint to the top of the markersRef array

    // Remove all markers when the decadeYear changes
    return () => {
      markersRef.current.forEach((marker) => {
        marker.remove();
      });
      markersRef.current = [];
    };
  }, [mapRef, data, decadeYear, selectedDataPoint]);

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
