import React, { useEffect, useRef, useState } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";

// Register necessary chart elements and scales
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

// Define the DataPoint interface
interface DataPoint {
  riskRating: number;
  assetName: string;
  riskFactors: { [key: string]: number };
  year: number;
}

// Define the LineGraphProps interface
interface LineGraphProps {
  data: {
    labels: string[];
    values: number[];
  };
  setSelectedDataPoint: (dataPoint: any) => void;
  filteredData?: DataPoint[];
}

// Define the LineGraph component
const LineGraph: React.FC<LineGraphProps> = ({
  data,
  setSelectedDataPoint,
  filteredData = [],
}) => {
  // Define the chart reference
  const chartRef = useRef<HTMLCanvasElement>(null);
  // Define the chart instance state
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);

  // useEffect hook to create or update the chart when the data or the canvas ref changes
  useEffect(() => {
    // Check if the chart reference and the data exist
    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Check if the context exists
      if (ctx) {
        if (!chartInstance) {
          const newChartInstance = new Chart(ctx, {
            type: "line",
            data: {
              labels: data.labels,
              // Configure the chart data
              datasets: [
                {
                  label: "Average Risk Rating",
                  data: data.values,
                  backgroundColor: "#29A08A",
                  borderColor: "#29A08A",
                  borderWidth: 2,
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
              // Configure the chart tooltip
              plugins: {
                tooltip: {
                  enabled: true,
                  callbacks: {
                    // Define the tooltip title and body
                    title: function (context) {
                      if (filteredData.length) {
                        const index = context[0].dataIndex;
                        return filteredData[index].assetName;
                      }
                      return "";
                    },
                    // Define the tooltip body
                    beforeBody: function (context) {
                      if (filteredData.length) {
                        const index = context[0].dataIndex;
                        const dataPoint = filteredData[index];
                        return [
                          `Risk Rating: ${dataPoint.riskRating}`,
                          `Risk Factors: ${JSON.stringify(
                            dataPoint.riskFactors
                          )}`,
                          `Year: ${dataPoint.year}`,
                        ];
                      }
                      return "";
                    },
                  },
                },
              },
              // Create an onClick event
              // When the user clicks on a data point, set the selected data point
              onClick: (event) => {
                // Check if the filtered data exists
                if (filteredData.length) {
                  const elements = (
                    chartInstance as any
                  ).getElementsAtEventForMode(
                    event,
                    "nearest",
                    { intersect: true },
                    true
                  );
                  // Get the index of the selected data point
                  if (elements.length) {
                    const index = elements[0].index;
                    setSelectedDataPoint(filteredData[index]);
                  } else {
                    setSelectedDataPoint(null);
                  }
                }
              },
            },
          });

          setChartInstance(newChartInstance);
        } else {
          // Update the chart data
          chartInstance.data.labels = data.labels;
          chartInstance.data.datasets[0].data = data.values;
          chartInstance.update();
        }
      }
    }
  }, [chartRef, data, filteredData]);

  return (
    <div className="line-graph-container">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default LineGraph;
