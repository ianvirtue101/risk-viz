import React, { useState } from "react";
import MapBox from "../MapBox/MapBox";
import { DataItem } from "../../app/api/types";
import Pagination from "../Pagination/Pagination";

type RiskMapProps = {
  data: DataItem[];
};



const itemsPerPage = 100; // Change this value as needed

function fetchPage(page: number, data: DataItem[]): DataItem[] {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return data.slice(startIndex, endIndex);
}

const RiskMap: React.FC<RiskMapProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

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
