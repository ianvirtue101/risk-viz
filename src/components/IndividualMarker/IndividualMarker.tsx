import React, { useState } from "react";
import { Marker, Popup } from "react-map-gl";

const IndividualMarker = ({ asset, onClick }) => {
  const [showPopup, setShowPopup] = useState(false);

  const latitude = asset.latitude;
  const longitude = asset.longitude;
  const riskRating = asset.risk_rating;

  const getMarkerColor = (riskRating: any) => {
    if (riskRating < 0.25) return "green";
    if (riskRating < 0.5) return "yellow";
    if (riskRating < 0.75) return "orange";
    return "red";
  };

  const markerStyle = {
    backgroundColor: getMarkerColor(riskRating),
    borderRadius: "50%",
    cursor: "pointer",
    height: "10px",
    width: "10px",
  };

  const handleMouseEnter = () => {
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  return (
    <Marker latitude={latitude} longitude={longitude}>
      <div
        style={markerStyle}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      {showPopup && (
        <Popup
          latitude={latitude}
          longitude={longitude}
          closeButton={false}
          closeOnClick={false}
          anchor="top"
          offset={[0, -10]}
        >
          <div>
            <p>{asset.asset_name}</p>
            <p>{asset.business_category}</p>
          </div>
        </Popup>
      )}
    </Marker>
  );
};

export default IndividualMarker;