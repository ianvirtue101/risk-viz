import React, { useState } from "react";
import MapBox from "../MapBox/MapBox";
import { DataItem, SelectedDataPoint } from "../../app/api/types";
import Pagination from "../Pagination/Pagination";

interface RiskMapProps {
  data: DataItem[];
  selectedDataPoint: SelectedDataPoint | null;
  dataTableRef: React.RefObject<HTMLDivElement>;
  decadeYear: number;
  setDecadeYear: (year: number) => void;

  selectedMarkers: number | null;
  setSelectedMarkers: React.Dispatch<React.SetStateAction<number | null>>;
}

// Define the number of items to display per page
const itemsPerPage = 100;

// Function to fetch a specific page of data based on the provided page number and data array
function fetchPage(page: number, data: DataItem[]): DataItem[] {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return data.slice(startIndex, endIndex);
}

// Define the RiskMap component
const RiskMap: React.FC<RiskMapProps> = ({
  data,
  selectedDataPoint,
  dataTableRef,
  decadeYear,
  setDecadeYear,
  selectedMarkers,
  setSelectedMarkers,
}) => {
  // Define the current page state
  const [currentPage, setCurrentPage] = useState(1);

  const [clickedDataPoint, setClickedDataPoint] =
    useState<SelectedDataPoint | null>(null);

  // Calculate the total number of pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Function to handle page changes
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Fetch the data to display on the current page
  const displayedData = fetchPage(currentPage, data);

  // function to receive the selected data point from the MapBox component
  const handleDataPointSelection = (dataPoint: SelectedDataPoint) => {
    // find the index of the selected data point in the data array
    const dataIndex = data.findIndex((item) => item.id === dataPoint.id);
    // calculate the page that the selected data point is on
    const newPage = Math.ceil((dataIndex + 1) / itemsPerPage);

    // update the current page and selected data point states
    setCurrentPage(newPage);
    setClickedDataPoint(dataPoint);

    // Update the decadeYear in the MapBox component
    const newDecadeYear = Math.floor(dataPoint.year / 10) * 10;
    setDecadeYear(newDecadeYear);

    // push the selected data point to the top of the data table
    const updatedData = [...data];
    // remove the selected data point from the data array
    updatedData.splice(dataIndex, 1);
    // add the selected data point to the top of the data array
    updatedData.unshift(dataPoint);

    // scroll to the data table ref
    dataTableRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //

  return (
    <div className="w-full h-full">
      <MapBox
        // data={displayedData}
        data={data}
        selectedDataPoint={selectedDataPoint}
        setDecadeYear={setDecadeYear}
        decadeYear={decadeYear}
        onDataPointSelection={handleDataPointSelection}
        // pass data table ref to mapbox component
        dataTableRef={dataTableRef}
        // pass selected marker state to mapbox component
        selectedMarkers={selectedMarkers}
        setSelectedMarkers={setSelectedMarkers}
      />

      {/* <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      /> */}
    </div>
  );
};

export default RiskMap;
