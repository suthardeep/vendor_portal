import { Button } from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import { FileUploadDemo } from "@/components/base/FileUploadDemo";
import ImageDemo from "@/components/base/ImageDemo";
import { useImageZoomStore } from "@/store/useImageZoomStore";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  // const { setZoomedImageSrc } = useImageZoomStore();
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

      {/* <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4" onClick={() => setZoomedImageSrc("https://images.unsplash.com/photo-1506905925346-21bda4d32df4")} /> */}

      {/* <ImageDemo/> */}
      <FileUploadDemo/>

    </div>
  );
}
