import { useState, useEffect, useRef } from "react";
import { Camera, ArrowLeft } from "lucide-react";
import Tesseract from "tesseract.js";

function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string>("");
  const [processedImage, setProcessedImage] = useState<string | null>(null);

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
      detectRegions(photo);
      processImage(photo);
    }
  };

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    try {
      console.log("Creating worker...");
      const worker = await Tesseract.createWorker();
      console.log("Setting params...");
      await worker.setParameters({
        tessdata_dir: "../../data",
        preserve_interword_spaces: "1",
      });
      console.log("Initializing jpn...");
      await worker.reinitialize("jpn");
      console.log("Starting recognition...");
      const result = await worker.recognize(imageData);
      console.log("Result:", result);
      setExtractedText(result.data.text);
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
    try {
      // Save text file
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const textFilename = `user_data/${timestamp}.txt`;
      await window.fs.writeFile(textFilename, extractedText);

      // Update library.json
      const libraryPath = "user_data/library.json";
      let library;
      try {
        const libraryContent = await window.fs.readFile(libraryPath, {
          encoding: "utf8",
        });
        library = JSON.parse(libraryContent);
      } catch {
        library = { books: [] };
      }

      library.books.push({
        id: timestamp,
        title: `Book ${library.books.length + 1}`,
      });

      await window.fs.writeFile(libraryPath, JSON.stringify(library, null, 2));
      console.log(`Saved text and updated library`);
    } catch (error) {
      console.error("Error saving files:", error);
      throw error;
    }
  };

  if (photoData) {
    return (
      <div className="fixed inset-0 bg-white overflow-auto">
        <div className="p-4">
          <button onClick={resetPhoto} className="flex items-center gap-2 mb-4">
            <ArrowLeft size={24} />
            Back to camera
          </button>
          <div className="h-[50vh] flex items-center justify-center bg-gray-100 rounded-lg mb-4">
            <img
              src={processedImage!}
              className="h-full w-full object-contain"
            />
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

  const detectRegions = async (imageData: string) => {
    // TODO
    setProcessedImage(imageData);
  };

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
