"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Type } from "lucide-react";

const sizes = ["text-size-sm", "text-size-md", "text-size-lg"];

export function TextSizeControl() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const stored = localStorage.getItem("textSize") || "0";
    const i = parseInt(stored, 10) || 0;
    setIdx(i);
    document.documentElement.classList.remove(...sizes);
    document.documentElement.classList.add(sizes[i]);
  }, []);
  const cycle = () => {
    const next = (idx + 1) % sizes.length;
    setIdx(next);
    localStorage.setItem("textSize", String(next));
    document.documentElement.classList.remove(...sizes);
    document.documentElement.classList.add(sizes[next]);
  };
  return (
    <Button variant="ghost" size="icon" onClick={cycle} aria-label="Adjust text size">
      <Type className="h-5 w-5" />
    </Button>
  );
}