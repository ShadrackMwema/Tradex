import React, { useState } from "react";

const LocationFilter = ({ onLocationChange }) => {
  const [selectedLocation, setSelectedLocation] = useState("");

  const locations = [
    "All Locations",
    "Nairobi",
    "Kisumu",
    "Mombasa",
    "Nakuru",
    "Eldoret",
  ];

  const handleLocationChange = (e) => {
    const newLocation = e.target.value;
    setSelectedLocation(newLocation);
    onLocationChange(newLocation); // Notify parent component
  };

  return (
    <div className="location-filter">
      <label htmlFor="location">Location:</label>
      <select
        id="location"
        value={selectedLocation}
        onChange={handleLocationChange}
      >
        {locations.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationFilter;