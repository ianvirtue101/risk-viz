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
        <div className="bg-black bg-opacity-60 min-h-screen flex items-center py-16">
          <div className="absolute top-0 left-0 w-full">
            <Navbar />
          </div>
          <div className="container mx-auto px-4 flex flex-col items-center">
            <h1 className="text-white text-4xl font-bold mb-6">
              Climate Risk in Canada
            </h1>
            <p className="text-white text-xl mb-8">
              Assessing the impact of climate change on Canadian businesses
              throughout the 21st century. As global temperatures rise and
              extreme weather events become more frequent, businesses across
              various industries are facing increasing risks and challenges.
              This analysis aims to provide insights into the potential
              consequences of climate change, empowering businesses to make
              informed decisions, adapt to changing conditions, and contribute
              to a sustainable future.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-4 hover:shadow-lg transition-all duration-300 ease-in">
                <h2 className="text-white text-2xl font-semibold">Flooding</h2>
                <p className="text-white">
                  Flooding is a major concern in Canada, causing significant
                  damage to infrastructure, property, and the environment. As
                  climate change intensifies, the frequency and severity of
                  floods are expected to increase.
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-600 rounded-lg p-4 hover:shadow-lg transition-all duration-300 ease-in">
                <h2 className="text-white text-2xl font-semibold">
                  Extreme Heat
                </h2>
                <p className="text-white">
                  Extreme heat events in Canada have become more common and
                  intense due to climate change. These events can lead to
                  heat-related illnesses, increased energy consumption, and
                  negative impacts on agriculture and ecosystems.
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-lg p-4 hover:shadow-lg transition-all duration-300 ease-in">
                <h2 className="text-white text-2xl font-semibold">Wildfires</h2>
                <p className="text-white">
                  Wildfires pose a significant risk to Canada's forests,
                  communities, and economy. Climate change has resulted in drier
                  and warmer conditions, increasing the likelihood of wildfires,
                  which can cause widespread damage, air quality issues, and
                  long-lasting ecological impacts.
                </p>
              </div>
            </div>
            <button className="bg-white text-black rounded-lg px-8 py-3 mt-8 font-bold text-xl hover:bg-gray-200 transition-all duration-300 ease-in cursor-pointer">
              Explore More
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-full p-8">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
          <p className="text-xl mb-8">
            Explore the climate risk data through interactive visualizations and
            a data table. Analyze trends, compare risks across different
            industries, and gain insights to make informed decisions for your
            business.
          </p>
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
