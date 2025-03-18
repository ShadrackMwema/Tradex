import React, { useState, useEffect, useRef } from "react";

const LocationFilter = ({ selectedLocation, onLocationChange, locations }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  
  // Filter locations based on search term
  const filteredLocations = locations.filter(location => 
    location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLocationSelect = (location) => {
    onLocationChange(location);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="mb-6 relative" ref={dropdownRef}>
      <label htmlFor="location" className="font-medium text-gray-700">
        Location:
      </label>
      <div className="relative inline-block ml-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-48 p-2 border border-gray-300 rounded-md bg-white"
        >
          <span className="truncate">{selectedLocation}</span>
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
            ></path>
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute left-0 w-48 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            <div className="p-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Search locations..."
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <div
                    key={location}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleLocationSelect(location)}
                  >
                    {location}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No locations found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationFilter;