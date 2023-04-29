"use client";

import React from "react";
import { Bar } from "react-chartjs-2";

interface TotalRiskFactorsByYearProps {
  data: {
    labels: number[];
    values: number[];
  };
}

const TotalRiskFactorsByYear: React.FC<TotalRiskFactorsByYearProps> = ({
  data,
}) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Total Risk Factors by Year",
        data: data.values,
        backgroundColor: "#2ecc71",
        borderColor: "#2ecc71",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default TotalRiskFactorsByYear;
