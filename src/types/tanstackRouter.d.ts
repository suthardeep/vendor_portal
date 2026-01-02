import "@tanstack/react-router";
import { BreadcrumbMeta } from "./breadcrumb";

declare module "@tanstack/react-router" {
  interface StaticData {
    breadcrumb: BreadcrumbMeta;
    title?: string;
  }
  interface StaticDataRouteOption {
    breadcrumb?: BreadcrumbMeta;
    title?: string; 
  }
}
