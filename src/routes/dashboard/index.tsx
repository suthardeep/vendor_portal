import { Button } from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import { FileUploadDemo } from "@/components/base/FileUploadDemo";
import ImageDemo from "@/components/base/ImageDemo";
import Separator from "@/components/base/Separator";
import Switch from "@/components/base/Switch";
import Textarea from "@/components/base/Textarea";
import Breadcrumbs from "@/components/compound/Breadcrumbs";
import { CustomColorPickerDemo } from "@/components/compound/ColorPickerDialog";
import PillPath from "@/components/compound/PillPath";
import Tabs2Demo from "@/components/compound/Tabs2";
import TabsDemo from "@/components/compound/TabsDemo";
import Logo from "@/components/shared/Logo";
import { useImageZoomStore } from "@/store/useImageZoomStore";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

const pathData = [
  "Electronics", // primary
  "Video Games", // error
  "Consoles & PC", // accent
  "Graphics Cards", // success
  "NVIDIA RTX 4090", // warning
  "Founders Edition", // primary (cycle repeats)
  "Used", // error
  "International", // accent
  "Listing 123456", // success
];

function RouteComponent() {
  // const { setZoomedImageSrc } = useImageZoomStore();
  const [someBoolean, setSomeBoolean] = useState(false);
  return (
    <div className="text-primary">
      Hello dashboard!
      <Divider className="py-3" />
      <Button size="md" isLoading={false} startIcon="Monitor">
        Submit
      </Button>
      {/* <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4" onClick={() => setZoomedImageSrc("https://images.unsplash.com/photo-1506905925346-21bda4d32df4")} /> */}
      {/* <ImageDemo/> */}
      {/* <FileUploadDemo/> */}
      {/* <Textarea placeholder="Enter some text..." className="mt-4" containerClassName="px-10"/> */}
      {/* <Logo className="" height={70}/> */}
      {/* <Separator className="w-full text-body-content px-6" thickness="xs" legend={"Mann Jasmatia"} legendPosition="center" /> */}
      {/* <input type="color" /> */}
      {/* <CustomColorPickerDemo/> */}
      {/* 
<div className="bg-black">
      <Breadcrumbs breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Dashboard", to: "/dashboard" },
        { label: "Settings", to: "/dashboard/settings" },
      ]} /> 
</div> */}
      {/* <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-start">
            <PillPath items={pathData} />
        </div> */}
        {/* <div className="m-4">
      <Switch
        checked={someBoolean}
        onCheckedChange={(val: boolean) => setSomeBoolean(val)}
        className=""
        label="Mann"
        labelPosition="right"
        size="md"
      />
        </div> */}

        <div className="relative m-5 h-5 w-5 overflow-hidden rounded-full shadow-sm">
  <input
    type="color"
    disabled
    // Scale 150% and center it to ensure browser borders are cropped out
    className="absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 appearance-none border-none bg-transparent p-0"
  />
</div>


<TabsDemo/>
<Tabs2Demo/>
    </div>
  );
}
