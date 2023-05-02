"use client";
import React from "react";
import { Bar } from "react-chartjs-2";

// Define the TotalRiskFactorsByYearProps interface
interface TotalRiskFactorsByYearProps {
  data: {
    labels: number[];
    values: number[];
  };
}

// Define the TotalRiskFactorsByYear component
const TotalRiskFactorsByYear: React.FC<TotalRiskFactorsByYearProps> = ({
  data,
}) => {
  // Define the chart data
  const chartData = {
    labels: data.labels,
    // Configure the chart data
    datasets: [
      {
        label: "Total Risk Factors by Year",
        data: data.values,
        backgroundColor: "#29A08A",
        borderColor: "#29A08A",
        borderWidth: 1,
      },
    ],
  };

  // Configure the chart options
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Return the Bar component with the chart data and options
  return <Bar data={chartData} options={options} />;
};

export default TotalRiskFactorsByYear;
