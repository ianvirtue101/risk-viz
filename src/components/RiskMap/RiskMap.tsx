"use client";
import React, { useEffect, useState } from "react";
import MapBox from "../MapBox/MapBox";
import { DataItem } from "../../app/api/types";
import { fetchDataFromStorage } from "../../app/utils/fetchDataFromStorage";
import Pagination from "../Pagination/Pagination";

const itemsPerPage = 100; // Change this value as needed

function fetchPage(page: number, data: DataItem[]): DataItem[] {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return data.slice(startIndex, endIndex);
}

const RiskMap: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    async function fetchData() {
      try {
        const file_path =
          "gs://risk-viz-aedd5.appspot.com/UI_UX_Developer_Work_Sample_Data_sample_data.json"; // Replace with the actual path to your JSON file in Firebase Storage
        const downloadURL = await fetchDataFromStorage(file_path);
        const response = await fetch(downloadURL);
        const rawData: DataItem[] = await response.json();

        // Process the raw data
        const processedData = rawData.map((item: any, index: number) => ({
          id: index, // Add the index as the id
          assetName: item["Asset Name"],
          lat: item.Lat, // Updated property name
          long: item.Long, // Updated property name
          businessCategory: item["Business Category"],
          riskRating: item["Risk Rating"],
          riskFactors: JSON.parse(item["Risk Factors"]),
          year: item.Year, // Updated property name
        }));
        // console.log(processedData);
        // Set the processed data in the state
        setData(processedData);
      } catch (error: any) {
        console.error(`Error fetching data: ${error.message}`);
      }
    }
    fetchData();
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const displayedData = fetchPage(currentPage, data);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
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
