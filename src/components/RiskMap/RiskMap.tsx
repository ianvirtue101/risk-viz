import React, { useState } from "react";
import MapBox from "../MapBox/MapBox";
import { DataItem } from "../../app/api/types";
import Pagination from "../Pagination/Pagination";

interface RiskMapProps {
  data: DataItem[];
  selectedDataPoint: SelectedDataPoint | null;
}

interface SelectedDataPoint {
  id: number;
  riskRating: number;
  assetName: string;
  riskFactors: { [key: string]: number };
  year: number;
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
const RiskMap: React.FC<RiskMapProps> = ({ data, selectedDataPoint }) => {
  // Define the current page state
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total number of pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Function to handle page changes
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Fetch the data to display on the current page
  const displayedData = fetchPage(currentPage, data);

  return (
    <div className="w-full h-full">
      <MapBox data={displayedData} />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default RiskMap;
