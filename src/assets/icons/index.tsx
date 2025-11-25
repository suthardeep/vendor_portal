/**
 * Auto-generated file. Do not edit manually
 */

import React from "react";

export interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
}


export const CreditCard: React.FC<CustomIconProps> = ({
  size = 18,
  color,
  fill,
  strokeWidth = 1.5,
  className,
  style,
  ...props
}) => (
  <svg
      width={size}
      height={size}
      className={className}
      style={{...style }}
      strokeWidth={strokeWidth}
      {...props}
    stroke={color || "currentColor"}
    fill={fill || "none"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M3 10H21M7 15H7.01M11 15H13M6 19H18C19.6569 19 21 17.6569 21 16V8C21 6.34315 19.6569 5 18 5H6C4.34315 5 3 6.34315 3 8V16C3 17.6569 4.34315 19 6 19Z"/>
</svg>

);


export const FileInfo: React.FC<CustomIconProps> = ({
  size = 18,
  color,
  fill,
  strokeWidth = 1.5,
  className,
  style,
  ...props
}) => (
  <svg
      width={size}
      height={size}
      className={className}
      style={{...style }}
      strokeWidth={strokeWidth}
      {...props}
    stroke={color || "currentColor"}
    fill={fill || "none"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M14 3V7C14 7.55228 14.4477 8 15 8H19"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H14L19 8V19C19 20.1046 18.1046 21 17 21Z"/>
<path d="M11 14H12V18H13"/>
<path d="M11.9999 11H12.0099"/>
</svg>

);


export const Gem: React.FC<CustomIconProps> = ({
  size = 18,
  color,
  fill,
  strokeWidth = 1.5,
  className,
  style,
  ...props
}) => (
  <svg
      width={size}
      height={size}
      className={className}
      style={{...style }}
      strokeWidth={strokeWidth}
      {...props}
    stroke={color || "currentColor"}
    fill={fill || "none"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.26195 10.878L11.262 19.667C11.662 20.107 12.353 20.107 12.753 19.667L20.753 10.877C21.066 10.533 21.102 10.018 20.84 9.634L17.303 4.44C17.1172 4.16799 16.8094 4.00491 16.48 4.004H7.55396C7.22456 4.00491 6.91674 4.16799 6.73095 4.44L3.19095 9.632C2.92795 10.017 2.96395 10.533 3.27795 10.878H3.26195Z"/>
</svg>

);


export const TriangleDash: React.FC<CustomIconProps> = ({
  size = 18,
  color,
  fill,
  strokeWidth = 1.5,
  className,
  style,
  ...props
}) => (
  <svg
      width={size}
      height={size}
      className={className}
      style={{...style }}
      strokeWidth={strokeWidth}
      {...props}
    stroke={color || "currentColor"}
    fill={fill || "none"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M5.0002 19H19.0002C19.6627 18.9954 20.28 18.6629 20.6484 18.1123C21.0168 17.5616 21.0887 16.8642 20.8402 16.25L13.7402 4.00002C13.388 3.36338 12.7178 2.96826 11.9902 2.96826C11.2626 2.96826 10.5924 3.36338 10.2402 4.00002L3.1402 16.25C2.89659 16.8498 2.95832 17.5303 3.30585 18.0764C3.65338 18.6225 4.24373 18.9667 4.8902 19"/>
<path d="M12 3V19"/>
</svg>

);


// Registry for dynamic lookup
export const customIconRegistry = {
  CreditCard,
  FileInfo,
  Gem,
  TriangleDash,
} as const;

export type CustomIconName = keyof typeof customIconRegistry;
