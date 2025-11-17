
// ============================================================================
// DEMO COMPONENT
// ============================================================================

import { useMediaDialogStore } from "@/store/useMediaDialogStore";
import { Image } from "./Image";
import MagnifyingImage from "../compound/MagnifyingImage";
import MediaDialog from "../compound/MediaDialog";

export default function ImageDemo() {
  const { openDialog } = useMediaDialogStore();

  const demoImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Optimized Image System</h1>
          <p className="text-gray-600">Three components: Base Image, Magnifying Image, and Media Dialog</p>
        </div>

        {/* Base Image Examples */}
        <section className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6">1. Base Image Component</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Basic</h3>
              <Image
                src={demoImages[0]}
                alt="Mountain landscape"
                aspectRatio="16/9"
                rounded="lg"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">With Hover Scale</h3>
              <Image
                src={demoImages[1]}
                alt="Forest"
                aspectRatio="16/9"
                rounded="lg"
                scaleOnHover
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Click to Expand</h3>
              <Image
                src={demoImages[2]}
                alt="Nature"
                aspectRatio="16/9"
                rounded="lg"
                expandOnClick
              />
            </div>
          </div>
        </section>

        {/* Magnifying Image */}
        <section className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6">2. Magnifying Image (Hover to Zoom)</h2>
          <div className="flex justify-start">
            <MagnifyingImage
              src={demoImages[0]}
              alt="Mountain landscape"
              width={600}
              height={600}
              aspectRatio="16/9"
              rounded="lg"
              zoomLevel={3}
            />
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Hover over the image to see the magnified view on the right
          </p>
        </section>

        {/* Media Dialog Examples */}
        <section className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6">3. Media Dialog (Manual Trigger)</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => openDialog([{ src: demoImages[0], type: "image", alt: "Single image" }])}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Open Single Image
            </button>
            <button
              onClick={() => openDialog(demoImages.map((src, i) => ({ src, type: "image", alt: `Image ${i + 1}` })))}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Open Image Gallery (3 images)
            </button>
          </div>
        </section>

        {/* Usage Guide */}
        <section className="bg-blue-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Usage Guide</h2>
          <div className="space-y-4 text-sm">
            <div>
              <strong>Base Image:</strong> Use everywhere. Lightweight, lazy loading by default.
              <pre className="bg-white p-3 rounded mt-2 overflow-x-auto">
                {`<Image src="..." alt="..." aspectRatio="16/9" rounded="lg" />`}
              </pre>
            </div>
            <div>
              <strong>Magnifying Image:</strong> Only for product pages or detailed views.
              <pre className="bg-white p-3 rounded mt-2 overflow-x-auto">
                {`<MagnifyingImage src="..." alt="..." zoomLevel={2.5} />`}
              </pre>
            </div>
            <div>
              <strong>Media Dialog:</strong> Programmatic or click-to-expand.
              <pre className="bg-white p-3 rounded mt-2 overflow-x-auto">
                {`// Add <MediaDialog /> once at app root
// Then use:
const { openDialog } = useMediaDialogStore();
openDialog([{ src: "...", type: "image" }]);`}
              </pre>
            </div>
          </div>
        </section>
      </div>

      {/* Global Media Dialog - Add once in your app root */}
      <MediaDialog />
    </div>
  );
}