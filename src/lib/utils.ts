import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { techDescriptionMap, techIconMap } from "@/common/constants/tech-map";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTechIcon = (techName: string) => {
  const normalizedTechName = techName.toLowerCase().replace(/[ .]/g, "");
  const defaultIcon = "/images/brand.svg";

  return techIconMap[normalizedTechName]
    ? `${techIconMap[normalizedTechName]}`
    : defaultIcon;
};

export const getTechDescription = (techName: string) => {
  const normalizedTechName = techName.toLowerCase().replace(/[ .]/g, "");

  return techDescriptionMap[normalizedTechName]
    ? techDescriptionMap[normalizedTechName]
    : `${techName} is a technology or tool that is widely used in software development, providing valuable features and capabilities.`;
};
