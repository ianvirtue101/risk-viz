"use client";
import React, { useEffect, useState } from "react";
import MapBox from "../MapBox/MapBox";
import { DataItem } from "../../app/api/types";
import { fetchDataFromStorage } from "../../app/utils/fetchDataFromStorage";

const RiskMap: React.FC = () => {
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
        const processedData = rawData.map((item: any) => ({
          assetName: item["Asset Name"],
          lat: item.Lat, // Updated property name
          long: item.Long, // Updated property name
          businessCategory: item["Business Category"],
          riskRating: item["Risk Rating"],
          riskFactors: JSON.parse(item["Risk Factors"]),
          year: item.Year, // Updated property name
        }));

        // Set the processed data in the state
        setData(processedData);
      } catch (error: any) {
        console.error(`Error fetching data: ${error.message}`);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapBox data={data} />
    </div>
  );
};

export default RiskMap;
