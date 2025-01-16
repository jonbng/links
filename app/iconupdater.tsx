"use client"
import { useEffect } from "react";

const icons = ["red", "yellow", "green", "blue", "purple", "pink"];

export default function ClientIconUpdater() {
  useEffect(() => {
    const updateIcon = () => {
      const icon = icons[Math.floor(Math.random() * icons.length)];
      const iconUrl = `/${icon}.svg?${new Date().getTime()}`;
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = iconUrl;
      document.head.appendChild(link);
    };

    updateIcon();
    const interval = setInterval(updateIcon, 60000); 

    return () => clearInterval(interval);
  }, []);

  return null;
}
