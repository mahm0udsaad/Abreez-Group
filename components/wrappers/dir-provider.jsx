"use client";

import { DirectionProvider } from "@radix-ui/react-direction";
import { dir } from "i18next";

export default function DirProvider({ children, lng }) {
  return <DirectionProvider dir={dir(lng)}>{children}</DirectionProvider>;
}
