import { useEffect, useRef, useState } from "react";
import "./Camera.css";

type CameraStatus = "idle" | "on" | "error";

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<CameraStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function startCamera() {
    setErrorMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      streamRef.current = stream;

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play();
      }

      setStatus("on");
    } catch (e: unknown) {
      setStatus("error");
      if (e instanceof Error) setErrorMsg(e.message);
      else setErrorMsg("Camera permission/device error.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    const video = videoRef.current;
    if (video) video.srcObject = null;

    setStatus("idle");
  }

  useEffect(() => {
    // Auto-start for convenience
    void startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="cameraPanel">
      <div className="cameraFrame">
        <video ref={videoRef} className="cameraVideo" playsInline muted autoPlay />
        <div className="cameraOverlay">
          <div className="cameraBadge">AI Coach</div>
          <div className="cameraHint">Keep the cutting board in frame</div>
        </div>
      </div>

      <div className="cameraControls">
        {status !== "on" ? (
          <button className="btn" onClick={() => void startCamera()}>
            Start camera
          </button>
        ) : (
          <button className="btn" onClick={stopCamera}>
            Stop camera
          </button>
        )}

        {status === "error" && <div className="error">{errorMsg}</div>}
      </div>
    </div>
  );
}
