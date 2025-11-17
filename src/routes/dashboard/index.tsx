import { Button } from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="text-primary">
      Hello dashboard!
      <Divider className="py-3" />
      <Button
        size="md"
        isLoading={false}
        startIcon="Monitor"
      >
        Submit
      </Button>
    </div>
  );
}
