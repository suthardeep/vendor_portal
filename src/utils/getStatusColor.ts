import type { ChipColor } from "../components/base/Chip";

const AVAILABLE_COLORS: ChipColor[] = [
  "gray",
  "blue",
  "green",
  "yellow",
  "red",
  "purple",
  "orange",
  "teal",
  "pink",
  "indigo",
  "sky",
];

// Semantic status to color mapping
const SEMANTIC_STATUS_MAP: Record<string, ChipColor> = {
  // Not started states
  "not started": "gray",
  "not-started": "gray",
  "pending": "yellow",
  "draft": "gray",
  "scheduled": "blue",
  
  // Active/In-progress states
  "active": "green",
  "live": "green",
  "in progress": "blue",
  "in-progress": "blue",
  "running": "blue",
  
  // Completed states
  "completed": "green",
  "done": "green",
  "success": "green",
  "approved": "green",
  "published": "green",
  
  // Warning states
  "warning": "yellow",
  "on hold": "yellow",
  "on-hold": "yellow",
  "paused": "yellow",
  
  // Error/Failed states
  "error": "red",
  "failed": "red",
  "rejected": "red",
  "cancelled": "red",
  "canceled": "red",
  "stopped": "red",
  
  // Info states
  "info": "blue",
  "review": "purple",
  "archived": "gray",
};

// Helper to check if a value is a valid ChipColor
function isValidChipColor(value: string): value is ChipColor {
  return AVAILABLE_COLORS.includes(value as ChipColor);
}

export function getStatusColor(status: string): ChipColor {
  // Normalize the status string (lowercase, trim)
  const normalizedStatus = status.toLowerCase().trim();
  
  // Check semantic mapping first
  const mappedColor = SEMANTIC_STATUS_MAP[normalizedStatus];
  if (mappedColor) {
    return mappedColor;
  }
  
  // Fallback to default color
  return "blue";
}

export function createStatusColorMap(statuses: string[]): Record<string, ChipColor> {
  const map: Record<string, ChipColor> = {};

  statuses.forEach((status) => {
    map[status] = getStatusColor(status);
  });

  return map;
}