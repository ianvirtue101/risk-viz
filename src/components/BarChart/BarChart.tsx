"use client";
import React, { useRef, useEffect, useState } from "react";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register the necessary chart components
Chart.register(BarController, BarElement, CategoryScale, LinearScale);

// Define the BarChartProps interface
interface BarChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}
// Define the BarChart component
const BarChart: React.FC<BarChartProps> = ({ data }) => {
  // Define the chart reference
  const chartRef = useRef<HTMLCanvasElement>(null);

  // Define the chart instance state
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);

  // useEffect hook to create or update the chart when the data or the canvas ref changes
  useEffect(() => {
    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (ctx) {
        // Destroy the previous chart instance if it exists
        if (chartInstance) {
          chartInstance.destroy();
        }

        // Create a new chart instance
        const newChartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: data.labels,
            // Configure the chart data
            datasets: [
              {
                label: "Number of Assets",
                data: data.values,
                backgroundColor: "#29A08A",
                borderColor: "#29A08A",
                borderWidth: 1,
              },
            ],
          },

          // Configure the chart options
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });

        // Save the chart instance to the chart instance state
        setChartInstance(newChartInstance);
      }
    }
  }, [chartRef, data]);

  // Return the chart
  return (
    <div className="bar-chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default BarChart;
