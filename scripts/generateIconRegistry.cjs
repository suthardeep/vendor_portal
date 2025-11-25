// ============================================================================
// FILE: scripts/generateIconRegistry.cjs
// ============================================================================
const fs = require("fs");
const path = require("path");

const ICONS_DIR = path.join(__dirname, "../src/assets/icons");
const INDEX_FILE = path.join(ICONS_DIR, "index.tsx");

// Convert file name to PascalCase
function toPascalCase(name) {
  return name
    .replace(/\.svg$/i, "")
    .split(/[-_]/g)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

const files = fs.readdirSync(ICONS_DIR).filter((f) => f.endsWith(".svg"));
const usedNames = new Set();
const entries = [];

for (let file of files) {
  const oldPath = path.join(ICONS_DIR, file);
  const pascalName = toPascalCase(file);

  let finalName = pascalName;
  let counter = 1;
  while (usedNames.has(finalName)) {
    finalName = `${pascalName}${counter++}`;
  }
  usedNames.add(finalName);

  const newFile = finalName + ".svg";
  if (file !== newFile) {
    fs.renameSync(oldPath, path.join(ICONS_DIR, newFile));
    console.log(`Renamed: ${file} -> ${newFile}`);
  }

  // Read SVG content
  let svgContent = fs.readFileSync(path.join(ICONS_DIR, newFile), "utf8");

  // Replace stroke/fill with dynamic props
  // Remove width, height, fill, stroke, stroke-width, stroke-linecap, stroke-linejoin from original SVG
  svgContent = svgContent
    .replace(/\s(width|height|fill|stroke|stroke-width|stroke-linecap|stroke-linejoin)=["'][^"']*["']/gi, "")
    // Add dynamic stroke/fill props
    .replace(
      /<svg/gi,
      `<svg
    stroke={color || "currentColor"}
    fill={fill || "none"}`
    );

  entries.push({ name: finalName, content: svgContent });
}

// --------------------
// Generate index.tsx content
// --------------------
const indexContent = `/**
 * Auto-generated file. Do not edit manually
 */

import React from "react";

export interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
}

${entries
  .map(
    ({ name, content }) => `
export const ${name}: React.FC<CustomIconProps> = ({
  size = 18,
  color,
  fill,
  strokeWidth = 1.5,
  className,
  style,
  ...props
}) => (
  ${content.replace(
    /<svg/,
    `<svg
      width={size}
      height={size}
      className={className}
      style={{...style }}
      strokeWidth={strokeWidth}
      {...props}`
  )}
);
`
  )
  .join("\n")}

// Registry for dynamic lookup
export const customIconRegistry = {
${entries.map(({ name }) => `  ${name},`).join("\n")}
} as const;

export type CustomIconName = keyof typeof customIconRegistry;
`;

fs.writeFileSync(INDEX_FILE, indexContent, "utf8");
console.log(`✅ index.tsx generated with ${entries.length} icons.`);
