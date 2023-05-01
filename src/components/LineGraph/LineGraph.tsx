import React, { useEffect, useRef, useState } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

interface DataPoint {
  riskRating: number;
  assetName: string;
  riskFactors: { [key: string]: number };
  year: number;
}

interface LineGraphProps {
  data: {
    labels: string[];
    values: number[];
  };
  setSelectedDataPoint: (dataPoint: any) => void;
  filteredData?: Array<{
    riskRating: number;
    assetName: string;
    riskFactors: any; // Update the type according to your data structure
    year: number;
  }>;
}

const LineGraph: React.FC<LineGraphProps> = ({
  data,
  setSelectedDataPoint,
  filteredData = [],
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (ctx) {
        if (!chartInstance) {
          const newChartInstance = new Chart(ctx, {
            type: "line",
            data: {
              labels: data.labels,
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
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                tooltip: {
                  enabled: true,
                  callbacks: {
                    title: function (context) {
                      if (filteredData.length) {
                        const index = context[0].dataIndex;
                        return filteredData[index].assetName;
                      }
                      return "";
                    },
                    label: function (context) {
                      if (filteredData.length) {
                        const index = context.dataIndex;
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
              onClick: (event) => {
                if (filteredData.length) {
                  const elements = newChartInstance.getElementsAtEventForMode(
                    event,
                    "nearest",
                    { intersect: true },
                    true
                  );

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
