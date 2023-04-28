"use client";
import React, { useEffect, useState } from "react";
import RiskMap from "@/components/RiskMap/RiskMap";
import DataTable from "@/components/DataTable/DataTable";
import { fetchDataFromStorage } from "@/app/utils/fetchDataFromStorage";
import { DataItem } from "@/app/api/types";

export default function Home() {
  const [data, setData] = useState<DataItem[]>([]);

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

  return (
    <div className="w-full h-full bg-gray-100 p-8">
      <div className="container mx-auto">
        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <h1 className="text-2xl font-semibold text-primary-600 mb-4">
            Climate Risk Map
          </h1>
          <RiskMap />
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <h1 className="text-2xl font-semibold text-primary-600 mb-4">
            Climate Risk Data Table
          </h1>
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
}
