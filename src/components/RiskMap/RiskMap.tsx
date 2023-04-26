"use client";
import React, { useEffect, useState } from "react";
import MapBox from "../MapBox/MapBox";
import { DataItem } from "../../app/api/data/route";

const RiskMap: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/data");
      const loadedData: DataItem[] = await response.json();
      setData(loadedData);
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
