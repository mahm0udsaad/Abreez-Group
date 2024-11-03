import { Loader } from "lucide-react";

export const Spinner = ({ className = "" }) => (
  <div className={`animate-spin ${className}`}>
    <Loader />
  </div>
);
