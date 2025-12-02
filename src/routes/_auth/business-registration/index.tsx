import BusinessRegistrationForm from "@/features/auth/business-registration";
import { createFileRoute } from "@tanstack/react-router";

// const allowedTabs = ["business-details", "brand-details", "bank-details", "declaration"] as const; // Use 'as const' to make it a tuple of literal strings

const allowedTabs = ["with-gst", "without-gst"] as const;

// export type AllowedTab = (typeof allowedTabs)[number];
export type AllowedSubTab = (typeof allowedTabs)[number];

interface SearchParams {
  step: number;
  tab?: AllowedSubTab;
}

export const Route = createFileRoute("/_auth/business-registration/")({
  component: RouteComponent,
  validateSearch: (search: SearchParams) : SearchParams => {
    const finalParams: SearchParams = {
      step: search.step<=4 ? search.step : 1,
    };

    if (search.step === 1) {
      finalParams.tab =
        search.tab && allowedTabs.includes(search.tab) ? search.tab : "with-gst";
    }

    return finalParams;
  },
});

function RouteComponent() {
  return <BusinessRegistrationForm />;
}
