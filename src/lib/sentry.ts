import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || "",
  // enabled: false,
  enabled: import.meta.env.PROD,
  sendDefaultPii: true,
  integrations: (integrations) =>
    integrations.filter((integration) => integration.name !== "CaptureConsole"),
});
