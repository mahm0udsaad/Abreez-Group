import React, { useState } from "react";

// Predefined color palette
export const COLOR_OPTIONS = [
  { name: "Custom Color", hex: "transparent" }, // First option for custom color
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
  const [customColorName, setCustomColorName] = useState("");

  const handleCustomColorSelect = () => {
    if (customColorName.trim()) {
      // Generate a random transparent hex
      const randomTransparentHex = `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}00`;

      const customColor = {
        name: customColorName.trim(),
        hex: randomTransparentHex,
      };

      onSelectColor(customColor);
      setIsOpen(false);
      setCustomColorName(""); // Reset input
    }
  };

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
          {/* Custom color input as first option */}
          <div className="p-2 flex items-center gap-2">
            <input
              type="text"
              value={customColorName}
              onChange={(e) => setCustomColorName(e.target.value)}
              placeholder="Enter custom color name"
              className="flex-grow p-1 bg-gray-700 text-white border border-gray-600 rounded"
            />
            <button
              onClick={handleCustomColorSelect}
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>

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
