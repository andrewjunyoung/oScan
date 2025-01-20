import { useState, useEffect, useRef } from "react";
import { Camera, ArrowLeft } from "lucide-react";

function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [photoData, setPhotoData] = useState<string | null>(null);

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
    }
  };

  const resetPhoto = () => {
    setPhotoData(null);
  };

  const handleScanPages = () => {
    // NotImplemented: Will handle saving pages to external location
    throw new Error("Not implemented");
  };

  if (photoData) {
    return (
      <div className="fixed inset-0 bg-white">
        <div className="p-4">
          <button onClick={resetPhoto} className="flex items-center gap-2 mb-4">
            <ArrowLeft size={24} />
            Back to camera
          </button>
          <div className="h-[50vh] flex items-center justify-center bg-gray-100 rounded-lg mb-4">
            <img
              src={photoData}
              alt="Captured photo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={resetPhoto}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Retake
            </button>
            <button
              onClick={handleScanPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Scan pages
            </button>
          </div>
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
            className="h-full w-full object-cover"
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
