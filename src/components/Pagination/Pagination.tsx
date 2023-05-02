import React from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

// Define the Pagination component
const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  // Define the previousPage and nextPage functions
  const previousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Return the Pagination component
  return (
    <div className="flex items-center justify-center my-4">
      <button
        onClick={previousPage}
        disabled={currentPage === 1}
        className={`bg-secondary text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-opacity-50 ${
          currentPage === 1 && "opacity-50 cursor-not-allowed"
        }`}
      >
        Previous
      </button>
      <span className="mx-4 text-gray-700">
        {currentPage} of {totalPages}
      </span>
      <button
        onClick={nextPage}
        disabled={currentPage === totalPages}
        className={`bg-secondary text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-opacity-50 ${
          currentPage === totalPages && "opacity-50 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
