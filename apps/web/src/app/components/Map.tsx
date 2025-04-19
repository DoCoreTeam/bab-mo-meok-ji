// src/app/components/Map.tsx
"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface MapProps {
  lat: number;
  lng: number;
}

export default function Map({ lat, lng }: MapProps) {
  const containerStyle = {
    width: "100%",
    height: "200px",
    borderRadius: "1rem",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  const center = { lat, lng };

  if (!lat || !lng) {
    return <div className="w-full h-[200px] bg-gray-200 animate-pulse rounded-xl" />;
  }

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}
