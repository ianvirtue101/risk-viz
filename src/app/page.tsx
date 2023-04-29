"use client";
import React, { useEffect, useState } from "react";
import RiskMap from "@/components/RiskMap/RiskMap";
import DataTable from "@/components/DataTable/DataTable";
import LineGraph from "@/components/LineGraph/LineGraph";
import BarChart from "@/components/BarChart/BarChart";
import PieChart from "@/components/PieChart/PieChart";
import { fetchDataFromStorage } from "@/app/utils/fetchDataFromStorage";
import { DataItem } from "@/app/api/types";

interface RiskFactor {
  [key: string]: number;
}

interface SelectedDataPoint {
  riskRating: number;
  assetName: string;
  riskFactors: RiskFactor;
  year: number;
}

export default function Home() {
  const [data, setData] = useState<DataItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedDataPoint, setSelectedDataPoint] =
    useState<SelectedDataPoint | null>(null);

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
        // Set the processed data in the state
        setData(processedData);
      } catch (error: any) {
        console.error(`Error fetching data: ${error.message}`);
      }
    }
    fetchData();
  }, []);

  function aggregateDataByCategoryAndYear(
    data: DataItem[],
    selectedYear: number | null,
    selectedCategory: string | null
  ) {
    const filteredData = data.filter(
      (item) =>
        (!selectedYear || item.year === selectedYear) &&
        (!selectedCategory || item.businessCategory === selectedCategory)
    );

    const aggregatedData = filteredData.reduce((acc: any, item: any) => {
      const key = `${item.businessCategory}-${item.year}`;

      if (!acc[key]) {
        acc[key] = {
          businessCategory: item.businessCategory,
          year: item.year,
          totalRiskRating: item.riskRating,
          count: 1,
        };
      } else {
        acc[key].totalRiskRating += item.riskRating;
        acc[key].count += 1;
      }

      return acc;
    }, {});

    const groupedData = Object.values(aggregatedData);

    const labels = Array.from(
      new Set(groupedData.map((item) => item.businessCategory))
    );
    const values = labels.map((category) => {
      const filteredData = groupedData.filter(
        (item) => item.businessCategory === category
      );
      const totalRiskRating = filteredData.reduce(
        (sum, item) => sum + item.totalRiskRating,
        0
      );
      const averageRiskRating = totalRiskRating / filteredData.length;
      return averageRiskRating;
    });

    return { labels, values };
  }

  const { labels: labelsArray, values: valuesArray } =
    aggregateDataByCategoryAndYear(data, selectedYear, selectedCategory);

  const years = [...new Set(data.map((item) => item.year))].sort();

  const averageRiskRatingByYear = years.map((year) => {
    const assetsForYear = data.filter((item) => item.year === year);
    const totalRiskRating = assetsForYear.reduce(
      (sum, asset) => sum + asset.riskRating,
      0
    );
    return totalRiskRating / assetsForYear.length;
  });

  const riskRatingByYearData = {
    labels: years,
    values: averageRiskRatingByYear,
  };

  const businessCategories = Array.from(
    new Set(data.map((item) => item.businessCategory))
  ).sort();

  const businessCategoryData = {
    labels: businessCategories,

    values: businessCategories.map((category) => {
      const assetsForCategory = data.filter(
        (item) => item.businessCategory === category
      );
      return Number(assetsForCategory.length);
    }),
  };

  const assetCountByCategory = businessCategories.map((category) => {
    return data.filter((item) => item.businessCategory === category).length;
  });

  const pieChartData = {
    labels: businessCategories,
    values: assetCountByCategory,
  };

  return (
    <div className="w-full h-full bg-gray-100 p-8">
      <div className="container mx-auto">
        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <h1 className="text-2xl font-semibold text-primary-600 mb-4">
            Climate Risk Map
          </h1>
          <RiskMap data={data} />
          <LineGraph
            data={{ labels: labelsArray, values: valuesArray }}
            setSelectedDataPoint={setSelectedDataPoint}
          />
          <BarChart data={businessCategoryData} />
          <PieChart data={pieChartData} />
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
