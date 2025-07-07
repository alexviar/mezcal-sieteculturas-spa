import React from "react";

export default function Loader({message="Cargando..."}: {
  message?: string
}) {
  return (
    <div className="loader-container">
      <div className="loader-component" />
      {message}
    </div>
  );
}
