import React, { useState } from "react";

// Predefined color palette
export const COLOR_OPTIONS = [
  { name: "Black", hex: "#1A1A1D" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#FF4C4C" },
  { name: "Green", hex: "#4CFF4C" },
  { name: "Blue", hex: "#4C4CFF" },
  { name: "Yellow", hex: "#FFFF4C" },
  { name: "Purple", hex: "#A64CA6" },
  { name: "Gray", hex: "#A6A6A6" },
  { name: "Pink", hex: "#FFB6C1" },
  { name: "Orange", hex: "#FFA64C" },
  { name: "Gold", hex: "#FFD700" },
  { name: "Copper", hex: "#B87333" },
  { name: "Silver", hex: "#C0C0C0" },
];

// Color selection dropdown component
export const ColorSelector = ({ selectedColor, onSelectColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-10">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center cursor-pointer border border-gray-600 rounded p-2 bg-gray-700"
      >
        {selectedColor ? (
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mx-2 shadow border-white"
              style={{ backgroundColor: selectedColor.hex }}
            />
            <span className="text-white">{selectedColor.name}</span>
          </div>
        ) : (
          <span className="text-gray-400">Select Color</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full border border-gray-600 rounded bg-gray-800 shadow-lg">
          {COLOR_OPTIONS.map((color) => (
            <div
              key={color.name}
              onClick={() => {
                onSelectColor(color);
                setIsOpen(false);
              }}
              className="flex items-center p-2 hover:bg-gray-700 cursor-pointer"
            >
              <div
                className="w-4 h-4 rounded-full mx-2 shadow border-white"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-white">{color.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
