"use client";
import React, { useState } from "react";
import { DataItem, SelectedDataPoint } from "../../app/api/types";
import Pagination from "../Pagination/Pagination";

interface DataTableProps {
  data: DataItem[];
  selectedRow: number | null;
  setSelectedRow: React.Dispatch<React.SetStateAction<number | null>>;
  SelectedDataPoint: SelectedDataPoint | null;
  onDataPointSelection: (dataPoint: SelectedDataPoint) => void;
  mapRef: React.RefObject<HTMLDivElement>;
  setDecadeYear: (year: number) => void;
}

// Define the number of items to display per page
const itemsPerPage = 100;

// Function to fetch a specific page of data based on the provided page number and data array
function fetchPage(page: number, data: DataItem[]): DataItem[] {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return data.slice(startIndex, endIndex);
}

// Define the DataTable component
const DataTable: React.FC<DataTableProps> = ({
  data,
  selectedRow,
  setSelectedRow,
  onDataPointSelection,
  mapRef,
  setDecadeYear,
}) => {
  // Define the filter term state
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

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 10; // Define the number of items per page

  // Handler function for updating the current page
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Handler functions for updating filter values
  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTerm(event.target.value);
  };

  // Handler functions for updating filter values
  const handleYearFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value ? parseInt(event.target.value) : null);
  };

  // Handler functions for updating filter values
  const handleRiskFactorFilter = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedRiskFactor(event.target.value || null);
  };

  // Handler functions for updating filter values
  const handleBusinessCategoryFilter = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedBusinessCategory(event.target.value || null);
  };

  // Handler functions for updating filter values
  const handleRiskRatingFilter = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedRiskRating(
      event.target.value ? parseFloat(event.target.value) : null
    );
  };

  // Filter the data based on the current filter values
  const filteredData = data.filter((item) => {
    // Check if the item matches the filter term
    const matchesFilterTerm =
      !filterTerm ||
      item.assetName.toLowerCase().includes(filterTerm.toLowerCase());

    // Check if the item matches the filter term
    const matchesYear = !selectedYear || item.year === selectedYear;

    // Check if the item matches the filter term
    const matchesRiskFactor =
      !selectedRiskFactor || item.riskFactors[selectedRiskFactor] !== undefined;

    // Check if the item matches the filter term
    const matchesBusinessCategory =
      !selectedBusinessCategory ||
      item.businessCategory === selectedBusinessCategory;

    // Check if the item matches the filter term
    const matchesRiskRating =
      !selectedRiskRating || item.riskRating === selectedRiskRating;

    // Return true if the item matches all the filter values
    return (
      matchesFilterTerm &&
      matchesYear &&
      matchesRiskFactor &&
      matchesBusinessCategory &&
      matchesRiskRating
    );
  });

  // Calculate the start and end indices for the items on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Slice the filteredData array to only include items for the current page
  const dataToRender = filteredData.slice(startIndex, endIndex);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handler function for row click
  const handleRowClick = (rowData: DataItem) => {
    const newDecadeYear = Math.floor(rowData.year / 10) * 10;
    setDecadeYear(newDecadeYear);
    // Set the selected row
    setSelectedRow(rowData.id);

    // Call the onDataPointSelection function with the rowData
    onDataPointSelection(rowData);

    console.log(rowData.id);
    console.log(rowData);

    // Scroll to the map
    mapRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
        <div className="pagination-container flex flex-grow sm:justify-center md:justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
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
            {dataToRender.map((item, index) => (
              <tr
                key={item.id}
                onClick={() => {
                  setSelectedRow(index);
                  handleRowClick(item);
                }}
                className={
                  index === selectedRow
                    ? "bg-blue-100"
                    : index % 2 === 0
                    ? "bg-gray-50"
                    : ""
                }
              >
                <td className="border p-2">{item.id + 1}</td>
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
