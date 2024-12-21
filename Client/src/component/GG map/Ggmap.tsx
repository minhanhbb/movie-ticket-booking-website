import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 21.0285,
  lng: 105.8542, // Tọa độ của Hà Nội
};

const MyMapComponent = () => {
  const [isApiLoaded, setIsApiLoaded] = useState(false);  // State để theo dõi khi API tải xong

  // Hàm xử lý khi Google Maps API tải xong
  const handleApiLoaded = () => {
    setIsApiLoaded(true);  // API đã tải xong, cập nhật trạng thái
    // console.log("Google Maps API đã tải xong");
  };

  const handleError = (error:any) => {
    console.error("Lỗi tải Google Maps API:", error);
  };

  return (
    <LoadScript
      googleMapsApiKey="YOUR_API_KEY"
      onLoad={handleApiLoaded}  // Thực thi khi API đã tải xong
      onError={handleError}    // Xử lý lỗi nếu không tải được API
    >
      {isApiLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
        >
          <Marker position={center} />
        </GoogleMap>
      ) : (
        <p>Đang tải bản đồ...</p>  // Hiển thị thông báo khi chưa tải xong
      )}
    </LoadScript>
  );
};

export default MyMapComponent;
