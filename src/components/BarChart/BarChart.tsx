"use client";
import React, { useRef, useEffect, useState } from "react";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale);

interface BarChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (ctx) {
        if (chartInstance) {
          chartInstance.destroy();
        }

        const newChartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: data.labels,
            datasets: [
              {
                label: "Number of Assets",
                data: data.values,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
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

        setChartInstance(newChartInstance);
      }
    }
  }, [chartRef, data]);

  return (
    <div className="bar-chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default BarChart;
