import DemoAll from "@/components/DemoAll";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "demaze-ui-lib/components";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="text-primary">
        Dashboard page

        <br />  

        <Button 
          onClick={() => alert("This button comes from demaze-ui-lib!")}
        >
          Button from demaze-ui-lib (npm package)
        </Button>

        {/* <DemoAll/> */}
    </div>
  );
}
