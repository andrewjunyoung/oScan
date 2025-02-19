import { useState, useEffect, useRef } from "react";
import cv from "@techstark/opencv-js";
import { Camera, ArrowLeft } from "lucide-react";
import { createWorker, PSM } from "tesseract.js";

function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string>("");
  const [ocrResults, setOcrResults] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null);
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

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    try {
      const worker = await createWorker("eng");
      await worker.setParameters({
        preserve_interword_spaces: "1",
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
        tessedit_char_whitelist:
          "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ :",
      });
      const result = await worker.recognize(
        imageData,
        {},
        {
          text: true,
          blocks: true,
          layoutBlocks: true,
        }
      );
      console.log("Result:", result);
      setExtractedText(result.data.text);
      setOcrResults(result);
      setImage(imageData);
      await worker.terminate();
    } catch (error) {
      console.error("Full error:", error);
      setExtractedText("Error extracting text");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetPhoto = () => {
    setPhotoData(null);
    setExtractedText("");
  };

  const handleSavePages = async () => {
    // NotImplemented: Will handle saving pages to external location
    // Will send both image and extracted text
    throw new Error("Not implemented");
  };

  if (photoData) {
    return (
      <div className="fixed inset-0 bg-white overflow-auto">
        <div className="p-4">
          <button onClick={resetPhoto} className="flex items-center gap-2 mb-4">
            <ArrowLeft size={24} />
            Back to camera
          </button>
          {/* <div className="h-[50vh] flex items-center justify-center bg-gray-100 rounded-lg mb-4"> */}
          <div className="h-[50vh] flex items-center justify-center bg-gray-100 rounded-lg mb-4">
            <div className="relative">
              <img ref={imgRef} src={image} draggable={true} />
              {image && ocrResults && (
                <svg
                  className="absolute top-0 left-0"
                  style={{
                    width: imgRef.current?.width || "100%",
                    height: imgRef.current?.height || "100%",
                  }}
                  viewBox={`0 0 ${ocrResults.data.width} ${ocrResults.data.height}`}
                  preserveAspectRatio="none"
                >
                  {ocrResults.data.blocks.map((block, i) => (
                    <rect
                      key={i}
                      x={block.bbox.x0}
                      y={block.bbox.y0}
                      width={block.bbox.x1 - block.bbox.x0}
                      height={block.bbox.y1 - block.bbox.y0}
                      fill="none"
                      stroke="red"
                      strokeWidth={2}
                    />
                  ))}
                </svg>
              )}
            </div>
          </div>
          {isProcessing ? (
            <div className="text-center py-4">
              <div className="animate-pulse">Processing image...</div>
            </div>
          ) : (
            <div className="mb-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-4 min-h-[100px] whitespace-pre-wrap">
                {extractedText || "No text extracted"}
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetPhoto}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Retake
                </button>
                <button
                  onClick={handleSavePages}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  disabled={isProcessing}
                >
                  Save pages
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 fixed inset-0">
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
  );
}

export default ScanPage;
