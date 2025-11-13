import * as Sentry from "@sentry/react";
import { QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import AuthInitializer from "./AppInitializer.tsx";
import { queryClient } from "./lib/queryClient.ts";
import '../src/styles/index.css'

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement, {
    onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
      console.warn("Uncaught error", error, errorInfo.componentStack);
    }),
    onCaughtError: Sentry.reactErrorHandler(),
    onRecoverableError: Sentry.reactErrorHandler(),
  });

  
  root.render(
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
    </QueryClientProvider>,
  );
}
