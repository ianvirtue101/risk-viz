"use client";

import React, { useEffect, useRef, useState } from "react";
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";

// Register the necessary chart components
Chart.register(PieController, ArcElement, Tooltip, Legend);

// Define the PieChartProps interface
interface PieChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

// Define the PieChart component
const PieChart: React.FC<PieChartProps> = ({ data }) => {
  // Define the chart reference
  const chartRef = useRef<HTMLCanvasElement>(null);

  // Define the chart instance state
  const [chartInstance, setChartInstance] = useState<Chart<
    "pie",
    number[],
    string
  > | null>(null);

  // useEffect hook to create or update the chart when the data or the canvas ref changes
  useEffect(() => {
    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Check if the context exists
      if (ctx) {
        if (chartInstance) {
          chartInstance.destroy();
        }

        // Create a new chart instance
        const newChartInstance = new Chart(ctx, {
          type: "pie",
          data: {
            labels: data.labels,
            // Configure the chart data
            datasets: [
              {
                data: data.values,
                backgroundColor: [
                  "#0AAB8D", // Green
                  "#203845", // Red
                  "##064263", // Blue
                  "#B54838", // Amber
                  "#DE232E", // Purple
                  "#ff5722", // Deep Orange
                  "#009688", // Teal
                  "#cddc39", // Lime
                  "#795548", // Brown
                  "#607d8b", // Blue Grey
                ],
                borderColor: "#ffffff",
                borderWidth: 1,
              },
            ],
          },
          // Configure the chart options
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });

        setChartInstance(newChartInstance);
      }
    }
  }, [chartRef, data]);

  return (
    <div className="pie-chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PieChart;
