import { useState, useEffect, useRef } from "react";
import { Camera, ArrowLeft, Trash2 } from "lucide-react";
import { createWorker, PSM } from "tesseract.js";

interface ScannedPage {
  id: string;
  image: string;
  text: string;
  ocrResults: any;
}

function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedPages, setScannedPages] = useState<ScannedPage[]>([]);
  const imgRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Camera access denied:", err);
        setHasPermission(false);
      }
    };
    if (!photoData) {
      startCamera();
    }
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [photoData]);

  function filterOcrResults(blocks, minConfidence) {
    return blocks.filter((block) => block.confidence > minConfidence);
  }

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const photo = canvas.toDataURL("image/jpeg");
      setPhotoData(photo);
      processImage(photo);
    }
  };

  const processImage = async (
    imageData: string,
    options = { filterLowConfidence: 5 }
  ) => {
    setIsProcessing(true);
    try {
      const worker = await createWorker("eng");
      await worker.setParameters({
        tessedit_pageseg_mode: options.filterLowConfidence
          ? PSM.SPARSE_TEXT
          : PSM.SINGLE_BLOCK,
        preserve_interword_spaces: "1",
        tessedit_char_whitelist:
          "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ :",
      });

      let result = await worker.recognize(
        imageData,
        {},
        {
          text: true,
          blocks: true,
          layoutBlocks: true,
        }
      );

      if (options.filterLowConfidence && options.filterLowConfidence > 0) {
        result.data.blocks = filterOcrResults(result.data.blocks, 5);
      }

      const newPage: ScannedPage = {
        id: Date.now().toString(),
        image: imageData,
        text: result.data.text,
        ocrResults: result,
      };

      setScannedPages((prev) => [...prev, newPage]);
      await worker.terminate();
    } catch (error) {
      console.error("Full error:", error);
    } finally {
      setIsProcessing(false);
      setPhotoData(null); // Reset to camera view after processing
    }
  };

  const deletePage = (pageId: string) => {
    setScannedPages((prev) => prev.filter((page) => page.id !== pageId));
  };

  const handleSavePages = async () => {
    const allText = scannedPages
      .map((page) => page.text)
      .join("\n\n--- Page Break ---\n\n");
    // You can implement your preferred save method here
    // For example, downloading as a text file:
    const blob = new Blob([allText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scanned_pages.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      <div className="flex-1 relative">
        {hasPermission ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover scale-x-[-1]"
            />
            <button
              onClick={takePhoto}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full p-4 shadow-lg"
              disabled={isProcessing}
            >
              <Camera size={32} />
            </button>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            Please allow camera access
          </div>
        )}
      </div>

      {/* Photo Library */}
      <div className="h-48 bg-gray-50 border-t border-gray-200 overflow-x-auto">
        <div className="p-4">
          <div className="flex gap-4">
            {scannedPages.map((page) => (
              <div key={page.id} className="relative group">
                <img
                  src={page.image}
                  alt={`Scan ${page.id}`}
                  className="h-32 w-auto object-contain rounded-lg border border-gray-300"
                />
                <button
                  onClick={() => deletePage(page.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save All Button */}
      {scannedPages.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleSavePages}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={isProcessing}
          >
            Save {scannedPages.length} page
            {scannedPages.length === 1 ? "" : "s"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ScanPage;
