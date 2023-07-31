import React, { useState, useEffect } from "react";

export default function ImageSlider() {
  const images = [
    "/images/manha.jpg",
    "/images/tarde.jpg",
    "/images/noite.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
  }, [images.length]);

  return (
      <div className="flex justify-center space-x-2">
        <img
          className="w-7/10"
          src={images[currentImageIndex]}
          alt="Imagem do slide"
        />
      </div>
  );
}
