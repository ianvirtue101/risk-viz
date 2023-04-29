"use client";

import React, { useEffect, useRef, useState } from "react";
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(PieController, ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<Chart<
    "pie",
    number[],
    string
  > | null>(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (ctx) {
        if (chartInstance) {
          chartInstance.destroy();
        }

        const newChartInstance = new Chart(ctx, {
          type: "pie",
          data: {
            labels: data.labels,
            datasets: [
              {
                data: data.values,
                backgroundColor: [
                  "#4caf50", // Green
                  "#f44336", // Red
                  "#2196f3", // Blue
                  "#ffc107", // Amber
                  "#9c27b0", // Purple
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
