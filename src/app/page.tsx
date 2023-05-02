"use client";
import React, { useEffect, useState } from "react";
import RiskMap from "@/components/RiskMap/RiskMap";
import DataTable from "@/components/DataTable/DataTable";
import LineGraph from "@/components/LineGraph/LineGraph";
import BarChart from "@/components/BarChart/BarChart";
import PieChart from "@/components/PieChart/PieChart";
import { fetchDataFromStorage } from "@/app/utils/fetchDataFromStorage";
import { DataItem } from "@/app/api/types";
import TotalRiskFactorsByYear from "@/components/TotalRiskFactorByYear/TotalRiskFactorsByYear";
import Navbar from "@/components/NavBar/NavBar";

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
        const processedData = rawData.map((item: any, index: number) => {
          const riskFactors = JSON.parse(item["Risk Factors"]);
          const roundedRiskFactors: RiskFactor = {};

          Object.keys(riskFactors).forEach((key) => {
            roundedRiskFactors[key] = roundToDecimalPlaces(riskFactors[key], 2);
          });

          return {
            id: index, // Add the index as the id
            assetName: item["Asset Name"],
            lat: item.Lat, // Updated property name
            long: item.Long, // Updated property name
            businessCategory: item["Business Category"],
            riskRating: item["Risk Rating"],
            riskFactors: roundedRiskFactors,
            year: item.Year, // Updated property name
          };
        });
        // Set the processed data in the state
        setData(processedData);
      } catch (error: any) {
        console.error(`Error fetching data: ${error.message}`);
      }
    }
    fetchData();
  }, []);

  function roundToDecimalPlaces(value: number, decimalPlaces: number): number {
    const multiplier = Math.pow(10, decimalPlaces);
    return Math.round(value * multiplier) / multiplier;
  }

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

    const aggregatedData = filteredData.reduce(
      (acc: { [key: string]: any }, item: DataItem) => {
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
      },
      {}
    );

    const groupedData = Object.values(aggregatedData);

    const labels = Array.from(
      new Set(groupedData.map((item: any) => item.businessCategory))
    );
    const values = labels.map((category) => {
      const filteredData = groupedData.filter(
        (item: any) => item.businessCategory === category
      );
      const totalRiskRating = filteredData.reduce(
        (sum, item: any) => sum + item.totalRiskRating,
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

  const totalRiskFactorsByYear = years.map((year) => {
    const assetsForYear = data.filter((item) => item.year === year);
    const totalRiskFactors = assetsForYear.reduce(
      (sum, asset) => sum + Object.keys(asset.riskFactors).length,
      0
    );
    return totalRiskFactors;
  });

  const totalRiskFactorsByYearData = {
    labels: years,
    values: totalRiskFactorsByYear,
  };

  return (
    <>
      <div className="bg-hero-image bg-cover bg-center relative min-h-screen">
        <div className="bg-black bg-opacity-60 min-h-screen flex items-center">
          <div className="absolute top-0 left-0 w-full">
            <Navbar />
          </div>
          <div className="container mx-auto py-10 px-4">
            <h1 className="text-white text-4xl font-bold">
              Climate Risk in Canada
            </h1>
            <p className="text-white text-xl mt-4">
              Assessing the impact of climate change on Canadian businesses
              throughout the 21st century.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-rose-400 to-rose-600 rounded-lg p-4">
                <h2 className="text-white text-2xl font-semibold">Risk 1</h2>
                <p className="text-white">Short description about Risk 1</p>
              </div>
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg p-4">
                <h2 className="text-white text-2xl font-semibold">Risk 2</h2>
                <p className="text-white">Short description about Risk 2</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg p-4">
                <h2 className="text-white text-2xl font-semibold">Risk 3</h2>
                <p className="text-white">Short description about Risk 3</p>
              </div>
            </div>
            <button className="bg-white text-black rounded-lg px-6 py-2 mt-8 font-bold">
              Explore More
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-full p-8">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
          <div className="bg-white rounded-lg p-6 shadow-md mb-8">
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">
              Climate Risk Map
            </h2>
            <RiskMap data={data} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-semibold text-primary-600 mb-4">
                Average Risk Rating by Year
              </h2>
              <LineGraph
                data={{ labels: labelsArray, values: valuesArray }}
                setSelectedDataPoint={setSelectedDataPoint}
              />
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-semibold text-primary-600 mb-4">
                Average Risk Rating by Business Category
              </h2>
              <BarChart data={businessCategoryData} />
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-semibold text-primary-600 mb-4">
                Percentage of Assets by Business Category
              </h2>
              <PieChart data={pieChartData} />
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-semibold text-primary-600 mb-4">
                Total Risk Factors by Year
              </h2>
              <TotalRiskFactorsByYear data={totalRiskFactorsByYearData} />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md mb-8">
            <h1 className="text-2xl font-semibold text-primary-600 mb-4">
              Climate Risk Data Table
            </h1>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
