export interface Breadcrumb {
  label: string;
  path: string;
}

export const getBreadcrumbs = (): Breadcrumb[] => {
  const pathname = window.location.pathname;

  const baseBreadcrumb: Breadcrumb = {
    label: "Dashboard",
    path: "/dashboard",
  };

  const segments = pathname.split("/").filter(Boolean); // remove empty segments

  const dynamicBreadcrumbs: Breadcrumb[] = segments.map((segment, index) => {
    const path = "/" + segments.slice(0, index + 1).join("/");

    const label = segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

    return { label, path };
  });

  // Avoid duplicating Dashboard if already on /dashboard
  if (pathname === "/dashboard") {
    return [baseBreadcrumb];
  }

  return [baseBreadcrumb, ...dynamicBreadcrumbs];
};
