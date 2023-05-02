"use client";
import React, { useState } from "react";
import { DataItem } from "../../app/api/types";

interface DataTableProps {
  data: DataItem[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [filterTerm, setFilterTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedRiskFactor, setSelectedRiskFactor] = useState<string | null>(
    null
  );
  const [selectedBusinessCategory, setSelectedBusinessCategory] = useState<
    string | null
  >(null);
  const [selectedRiskRating, setSelectedRiskRating] = useState<number | null>(
    null
  );

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTerm(event.target.value);
  };

  const handleYearFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value ? parseInt(event.target.value) : null);
  };

  const handleRiskFactorFilter = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedRiskFactor(event.target.value || null);
  };

  const handleBusinessCategoryFilter = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedBusinessCategory(event.target.value || null);
  };

  const handleRiskRatingFilter = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedRiskRating(
      event.target.value ? parseFloat(event.target.value) : null
    );
  };

  const filteredData = data.filter((item) => {
    const matchesFilterTerm =
      !filterTerm ||
      item.assetName.toLowerCase().includes(filterTerm.toLowerCase());
    const matchesYear = !selectedYear || item.year === selectedYear;
    const matchesRiskFactor =
      !selectedRiskFactor || item.riskFactors[selectedRiskFactor] !== undefined;
    const matchesBusinessCategory =
      !selectedBusinessCategory ||
      item.businessCategory === selectedBusinessCategory;
    const matchesRiskRating =
      !selectedRiskRating || item.riskRating === selectedRiskRating;

    return (
      matchesFilterTerm &&
      matchesYear &&
      matchesRiskFactor &&
      matchesBusinessCategory &&
      matchesRiskRating
    );
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        value={filterTerm}
        onChange={handleFilter}
        className="border p-2 mb-4 rounded"
      />
      <div className="flex flex-wrap gap-4 mb-4">
        <select onChange={handleRiskFactorFilter} className="border p-2 mb-4">
          <option value="">All Risk Factors</option>
          <option value="Earthquake">Earthquake</option>
          <option value="Extreme heat">Extreme heat</option>
          <option value="Wildfire">Wildfire</option>
          <option value="Tornado">Tornado</option>
          <option value="Flooding">Flooding</option>
          <option value="Volcano">Volcano</option>
          <option value="Hurricane">Hurricane</option>
          <option value="Drought">Drought</option>
          <option value="Extreme cold">Extreme cold</option>
          <option value="Sea level rise">Sea level rise</option>
        </select>
        <select
          onChange={handleBusinessCategoryFilter}
          className="border p-2 mb-4"
        >
          <option value="">All Business Categories</option>
          <option value="Energy">Energy</option>
          <option value="Technology">Technology</option>
          <option value="Retail">Retail</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Finance">Finance</option>
        </select>
        <select onChange={handleRiskRatingFilter} className="border p-2 mb-4">
          <option value="">All Risk Ratings</option>
          <option value="0">0</option>
          <option value="0.1">0.1</option>
          <option value="0.2">0.2</option>
          <option value="0.3">0.3</option>
          <option value="0.4">0.4</option>
          <option value="0.5">0.5</option>
          <option value="0.6">0.6</option>
          <option value="0.7">0.7</option>
          <option value="0.8">0.8</option>
          <option value="0.9">0.9</option>
          <option value="1">1</option>
        </select>

        <select onChange={handleYearFilter} className="border p-2 mb-4">
          <option value="">All Years</option>
          <option value="2030">2030</option>
          <option value="2040">2040</option>
          <option value="2050">2050</option>
          <option value="2060">2060</option>
          <option value="2070">2070</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Asset Name</th>
              <th className="border p-2">Lat</th>
              <th className="border p-2">Long</th>
              <th className="border p-2">Business Category</th>
              <th className="border p-2">Risk Rating</th>
              <th className="border p-2">Risk Factors</th>
              <th className="border p-2">Year</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="border p-2">{item.id}</td>
                <td className="border p-2">{item.assetName}</td>
                <td className="border p-2">{item.lat}</td>
                <td className="border p-2">{item.long}</td>
                <td className="border p-2">{item.businessCategory}</td>
                <td className="border p-2">{item.riskRating}</td>
                <td className="border p-2">
                  {Object.entries(item.riskFactors).map(
                    ([factor, value], index) => (
                      <div key={index}>
                        {factor}: {value}
                      </div>
                    )
                  )}
                </td>
                <td className="border p-2">{item.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
