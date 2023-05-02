import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="p-4 md:p-8">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl md:text-4xl text-white font-bold">
          Climate Risk Dashboard
        </h1>
      </div>
    </nav>
  );
};

export default Navbar;
