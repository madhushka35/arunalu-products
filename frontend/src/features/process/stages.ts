/**
 * Production journey stages — copy from the Figma "Our Process – Desktop"
 * frame (STAGES). Figma marks the workflow as provisional until Arunalu
 * Products confirms it; the "[Details to be confirmed.]" notes are not shown.
 */
import type { IllustrativeKey } from "@/features/home/content"

export type ProcessStage = { title: string; text: string; image: IllustrativeKey }

export const processStages: ProcessStage[] = [
  { title: "Raw Material Receiving", text: "Fresh raw material is received and logged.", image: "receiving" },
  { title: "Inspection", text: "Raw material is checked before it enters processing.", image: "qa" },
  { title: "Preparation", text: "Cleaning and preparation for drying.", image: "preparation" },
  { title: "Processing", text: "Processing steps specific to each product.", image: "processing" },
  { title: "Machine Drying", text: "Machine-assisted drying for consistent results.", image: "drying" },
  { title: "Quality Inspection", text: "Dried product is checked before grading.", image: "qa" },
  { title: "Grading", text: "Sorting by size and quality.", image: "grading" },
  { title: "Packaging", text: "Packing into bulk, retail or custom formats.", image: "packaging" },
  { title: "Storage", text: "Packed product is stored before dispatch.", image: "storage" },
  { title: "Distribution", text: "Dispatch to local wholesale and export buyers.", image: "distribution" },
]
