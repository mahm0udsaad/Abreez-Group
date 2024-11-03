"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileSpreadsheet, PenTool } from "lucide-react";
import { ExcelUploadForm } from "@/components/forms/excel-form";
import { ManualProductForm } from "@/components/forms/product-form";

export default function AddProduct() {
  const [isExcelUpload, setIsExcelUpload] = useState(false);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-400">
          Add New Product
        </h2>
        <div className="mb-4 flex space-x-4">
          <Button
            variant={isExcelUpload ? "outline" : "default"}
            onClick={() => setIsExcelUpload(false)}
            className="flex items-center bg-blue-500 text-white hover:bg-blue-600"
          >
            <PenTool className="mr-2 h-4 w-4" />
            Manual Entry
          </Button>
          <Button
            variant={isExcelUpload ? "default" : "outline"}
            onClick={() => setIsExcelUpload(true)}
            className="flex items-center bg-blue-500 text-white hover:bg-blue-600"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excel Upload
          </Button>
        </div>
        {isExcelUpload ? <ExcelUploadForm /> : <ManualProductForm />}
      </CardContent>
    </Card>
  );
}
