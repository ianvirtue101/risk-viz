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
  filteredData: Array<{
    riskRating: number;
    assetName: string;
    riskFactors: any; // Update the type according to your data structure
    year: number;
  }>;
  setSelectedDataPoint: (dataPoint: any) => void;
}

const LineGraph: React.FC<LineGraphProps> = ({
  data,
  filteredData,
  setSelectedDataPoint,
}) => {
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
          type: "line",
          data: {
            labels: data.labels,
            datasets: [
              {
                label: "Average Risk Rating",
                data: data.values,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
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
                    const index = context[0].dataIndex;
                    return filteredData[index].assetName;
                  },
                  label: function (context) {
                    const index = context.dataIndex;
                    const dataPoint = filteredData[index];
                    return [
                      `Risk Rating: ${dataPoint.riskRating}`,
                      `Risk Factors: ${JSON.stringify(dataPoint.riskFactors)}`,
                      `Year: ${dataPoint.year}`,
                    ];
                  },
                },
              },
            },
            onClick: (event) => {
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
            },
          },
        });

        setChartInstance(newChartInstance);
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
