import React, { useState, useEffect } from "react";

const SchemeBannerSlider = () => {
  const slides = [
    {
      id: 1,
      image: "/schemeImg/scheme1.jpg",
      title: "Pradhan Mantri Kisan Samman Nidhi",
      subtitle: "Financial support for farmers across India",
    },
    {
      id: 2,
      image: "/schemeImg/scheme2.jpg",
      title: "PM Fasal Bima Yojana",
      subtitle: "Crop insurance for farmer protection",
    },
    {
      id: 3,
      image: "/schemeImg/scheme3.png",
      title: "Soil Health Card Scheme",
      subtitle: "Improving soil productivity nationwide",
    },
  ];

  const [current, setCurrent] = useState(0);

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000); // change every 4 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[550px] overflow-hidden rounded-xl shadow-lg">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute w-full h-full transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"
            }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          {/* <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white px-4">
            <h2 className="text-2xl md:text-4xl font-bold mb-2">
              {slide.title}
            </h2>
            <p className="text-sm md:text-lg">{slide.subtitle}</p>
          </div> */}
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${index === current ? "bg-white" : "bg-white/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SchemeBannerSlider;