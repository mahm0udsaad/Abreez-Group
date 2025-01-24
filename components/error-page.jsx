"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const ErrorPage = ({
  statusCode = 500,
  message = "An unexpected error occurred",
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <AlertTriangle className="h-24 w-24 text-[#3b51a3]" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
          Error {statusCode}
        </h1>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-6">
          <Button
            className="w-full bg-[#3b51a3] hover:bg-[#2a3b7a] text-white"
            asChild
          >
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
