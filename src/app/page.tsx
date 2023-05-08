"use client";
import React, { Suspense, useEffect, useState, useRef, RefObject } from "react";
import RiskMap from "@/components/RiskMap/RiskMap";
import DataTable from "@/components/DataTable/DataTable";
import LineGraph from "@/components/LineGraph/LineGraph";
import BarChart from "@/components/BarChart/BarChart";
import PieChart from "@/components/PieChart/PieChart";
import { fetchDataFromStorage } from "@/app/utils/fetchDataFromStorage";
import { DataItem } from "@/app/api/types";
import { SelectedDataPoint } from "@/app/api/types";
import TotalRiskFactorsByYear from "@/components/TotalRiskFactorByYear/TotalRiskFactorsByYear";
import Navbar from "@/components/NavBar/NavBar";
import Loading from "./loading";
import Head from "./head";

interface RiskFactor {
  [key: string]: number;
}

// interface SelectedDataPoint {
//   id: number;
//   riskRating: number;
//   assetName: string;
//   riskFactors: RiskFactor;
//   year: number;
// }

// Define the main Home component
export default function Home() {
  // State variables
  const [data, setData] = useState<DataItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedDataPoint, setSelectedDataPoint] =
    useState<SelectedDataPoint | null>(null);

  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  // Refs for scrolling functionality
  const mapRef: RefObject<HTMLHeadingElement> = useRef(null);
  const dataRef: RefObject<HTMLHeadingElement> = useRef(null);
  const dataTableRef = useRef<HTMLDivElement>(null);

  // Fetch and process the data on component mount
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
            lat: item.Lat,
            long: item.Long,
            businessCategory: item["Business Category"],
            riskRating: item["Risk Rating"],
            riskFactors: roundedRiskFactors,
            year: item.Year,
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

  // Helper function to round numbers to a specific number of decimal places
  function roundToDecimalPlaces(value: number, decimalPlaces: number): number {
    const multiplier = Math.pow(10, decimalPlaces);
    return Math.round(value * multiplier) / multiplier;
  }

  // Aggregate the data based on the selected year and category
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

    // Calculate aggregated data for the selected year and category
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

  // Extract unique years and business categories from the data
  const years = [...new Set(data.map((item) => item.year))].sort();

  // Calculate data for business categories chart
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

  // Calculate asset count by business category for the pie chart
  const assetCountByCategory = businessCategories.map((category) => {
    return data.filter((item) => item.businessCategory === category).length;
  });

  // Prepare data for the pie chart
  const pieChartData = {
    labels: businessCategories,
    values: assetCountByCategory,
  };

  // Calculate total risk factors by year
  const totalRiskFactorsByYear = years.map((year) => {
    const assetsForYear = data.filter((item) => item.year === year);
    const totalRiskFactors = assetsForYear.reduce(
      (sum, asset) => sum + Object.keys(asset.riskFactors).length,
      0
    );
    return totalRiskFactors;
  });

  // Prepare data for the total risk factors by year chart
  const totalRiskFactorsByYearData = {
    labels: years,
    values: totalRiskFactorsByYear,
  };

  // Scroll to the map section when the Explore More button is clicked
  const handleExploreMore = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to the data section when the Learn More button is clicked
  const handleLearnMore = () => {
    if (dataRef.current) {
      dataRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // function to receive the selected data point from the DataTable component
  const handleDataPointSelection = (dataPoint: SelectedDataPoint) => {
    console.log(dataPoint);
    // Set the selected data point in the state
    setSelectedDataPoint(dataPoint);
  };

  return (
    <>
      <main className="bg-hero-image bg-cover bg-center relative min-h-screen">
        <Head />
        <div className="bg-black bg-opacity-60 min-h-screen flex items-center py-16">
          <div className="absolute top-0 left-0 w-full">
            <Navbar />
          </div>
          <div className="container mx-auto px-4 flex flex-col items-center pt-16">
            <h1 className="text-white text-4xl font-bold mb-6">
              Climate Risk in Canada
            </h1>
            <p className="text-white text-xl mb-8">
              Evaluating the far-reaching consequences of climate change on
              Canadian businesses in the 21st century, our analysis delves into
              the mounting risks and challenges faced by diverse industries as
              global temperatures soar and extreme weather events intensify. We
              aim to deliver crucial insights into the potential ramifications
              of climate change, equipping businesses with the knowledge to make
              strategic decisions, adapt to the evolving landscape, and actively
              participate in shaping a sustainable future.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  Wildfires pose a significant risk to Canada&apos;s forests,
                  communities, and economy. Climate change has resulted in drier
                  and warmer conditions, increasing the likelihood of wildfires,
                  which can cause widespread damage, air quality issues, and
                  long-lasting ecological impacts.
                </p>
              </div>
            </div>
            <button
              className="bg-white text-black rounded-lg px-8 py-3 mt-8 font-bold text-xl hover:bg-gray-200 transition-all duration-300 ease-in cursor-pointer"
              onClick={handleExploreMore}
            >
              Explore More
            </button>
          </div>
        </div>
      </main>
      <Suspense fallback={<Loading />}>
        <div className="w-full h-full p-4 md:p-8 bg-background">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
            <p className="text-xl mb-4">
              Delve into our comprehensive climate risk dashboard to better
              understand the potential impacts of climate change on Canadian
              businesses. Explore the data through interactive visualizations,
              including a climate risk map, graphs showcasing average risk
              ratings, and more. Analyze trends over time, compare risks across
              different industries, and identify vulnerable areas or sectors. By
              utilizing this dashboard, businesses, policymakers, and other
              stakeholders can gain valuable insights to inform their
              strategies, adapt to changing conditions, and contribute to a more
              sustainable future.
            </p>
            <button
              onClick={handleLearnMore}
              className="bg-secondary text-white rounded-lg px-8 py-3 mb-8 font-bold text-xl hover:bg-gray-200 transition-all duration-300 ease-in cursor-pointer"
            >
              Learn More
            </button>

            <div className="bg-white rounded-lg p-6 shadow-md mb-8">
              <h2
                className="text-2xl font-semibold text-primary-600 mb-4"
                ref={mapRef}
                id="risk-map"
              >
                Climate Risk Map
              </h2>
              <p className="text-xl mb-4">
                Visualize the geographical distribution of climate risks in
                Canada. Hover over regions to view risk ratings.
              </p>
              <RiskMap
                data={data}
                // Pass the selected data point to the RiskMap component
                selectedDataPoint={selectedDataPoint}
                dataTableRef={dataTableRef}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2
                  className="text-2xl font-semibold text-primary-600 mb-4"
                  ref={dataRef}
                >
                  Average Risk Rating by Year
                </h2>
                <p className="text-xl mb-4">
                  Explore how the average risk rating for Canadian businesses
                  has changed over time. Identify patterns and trends to better
                  understand how climate change is impacting different
                  industries.
                </p>
                <LineGraph
                  data={{ labels: labelsArray, values: valuesArray }}
                  setSelectedDataPoint={setSelectedDataPoint}
                />
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-semibold text-primary-600 mb-4">
                  Average Risk Rating by Business Category
                </h2>
                <p className="text-xl mb-4">
                  Compare the average risk ratings across various business
                  categories to identify which industries are most affected by
                  climate change. Analyze how different sectors are coping with
                  climate risks.
                </p>
                <BarChart data={businessCategoryData} />
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-semibold text-primary-600 mb-4">
                  Percentage of Assets by Business Category
                </h2>
                <p className="text-xl mb-4">
                  Examine the distribution of assets among different business
                  categories to understand the potential financial implications
                  of climate change. Identify sectors with higher exposure to
                  climate risks.
                </p>
                <PieChart data={pieChartData} />
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-semibold text-primary-600 mb-4">
                  Total Risk Factors by Year
                </h2>
                <p className="text-xl mb-4">
                  Assess the evolution of total risk factors by year to track
                  the progression of climate change impacts. Monitor how risks
                  are developing over time and inform your adaptation strategies
                  accordingly.
                </p>
                <TotalRiskFactorsByYear data={totalRiskFactorsByYearData} />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md mb-8">
              <h1
                className="text-2xl font-semibold text-primary-600 mb-4"
                ref={dataTableRef}
              >
                Climate Risk Data Table
              </h1>
              <p className="text-xl mb-4">
                Access raw data on climate risks for Canadian businesses.
                Filter, sort, and search through the data to find specific
                information and gain a more granular understanding of climate
                risk factors.
              </p>
              <DataTable
                data={data}
                selectedRow={selectedRow}
                setSelectedRow={setSelectedRow}
                onDataPointSelection={handleDataPointSelection}
                mapRef={mapRef}
              />
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
}
