import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { techDescriptionMap, techIconMap } from "@/common/constants/tech-map";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatFieldName = (fieldName: string): string => {
  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

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

export const getTimeStamp = (createdAt: Date) => {
  const date = new Date(createdAt);
  const now = new Date();

  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks !== 1 ? "s" : ""} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
  } else {
    return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
  }
};

export const formatNumber = (number: number) => {
  if (number && number >= 1e6) {
    return `${(number / 1e6).toFixed(1)}M`;
  } else if (number && number >= 1e3) {
    return `${(number / 1e3).toFixed(1)}K`;
  } else {
    return number?.toString();
  }
};
