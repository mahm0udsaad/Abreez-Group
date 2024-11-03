"use client";

import React, { useRef } from "react";
import { FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";

// Excel Upload Component
export const ExcelUploadForm = () => {
  const fileInputRef = useRef(null);
  const dragDropRef = useRef(null);

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      console.log("Uploaded products:", json);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (dragDropRef.current) {
      dragDropRef.current.classList.add("border-blue-400");
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (dragDropRef.current) {
      dragDropRef.current.classList.remove("border-blue-400");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (dragDropRef.current) {
      dragDropRef.current.classList.remove("border-blue-400");
    }
    const files = event.dataTransfer.files;
    if (files && files.length) {
      handleExcelUpload({ target: { files: [files[0]] } });
    }
  };

  return (
    <div
      ref={dragDropRef}
      className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 hover:border-blue-400"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()}
    >
      <FileSpreadsheet className="mx-auto h-12 w-12 text-blue-400" />
      <p className="mt-2 text-sm text-gray-300">
        Drag and drop your Excel file here, or click to select
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        onChange={handleExcelUpload}
        className="hidden"
      />
    </div>
  );
};
