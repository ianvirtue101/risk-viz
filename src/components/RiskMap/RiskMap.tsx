"use client";
import React, { useEffect, useState } from "react";
import MapBox from "../MapBox/MapBox";
import { DataItem } from "../../app/api/types";

const RiskMap: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/data.ts");
        const loadedData: DataItem[] = await response.json();
        setData(loadedData);
      } catch (error) {
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
