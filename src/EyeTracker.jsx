
import { useEffect, useRef } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

export default function EyeTracker({ imageSrc = "/head.png" }) {
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let faceLandmarker;
    let cancelled = false;

    async function initialize() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );

        faceLandmarker = await FaceLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            },
            runningMode: "IMAGE",
            numFaces: 1,
          }
        );

        if (cancelled) return;

        const image = imageRef.current;
        const canvas = canvasRef.current;

        if (!image || !canvas) return;

        const result = faceLandmarker.detect(image);
        const landmarks = result.faceLandmarks?.[0];

        if (!landmarks) {
          console.log("Aucun visage détecté.");
          return;
        }

        console.log("Visage détecté :", landmarks.length);

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const ctx = canvas.getContext("2d");

        const rightEye = [
          33, 7, 163, 144, 145, 153, 154, 155,
          133, 173, 157, 158, 159, 160, 161, 246,
        ];

        const leftEye = [
          362, 382, 381, 380, 374, 373, 390, 249,
          263, 466, 388, 387, 386, 385, 384, 398,
        ];

        const irises = [
          468, 469, 470, 471, 472,
          473, 474, 475, 476, 477,
        ];

        function drawPoints(indices, color, radius) {
          indices.forEach((index) => {
            const point = landmarks[index];

            if (!point) return;

            ctx.beginPath();
            ctx.arc(
              point.x * canvas.width,
              point.y * canvas.height,
              radius,
              0,
              Math.PI * 2
            );

            ctx.fillStyle = color;
            ctx.fill();
          });
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPoints(rightEye, "#00ff88", 5);
        drawPoints(leftEye, "#00ff88", 5);
        drawPoints(irises, "#ff3333", 7);

        console.log("Points des yeux affichés !");
      } catch (error) {
        console.error("Erreur MediaPipe :", error);
      }
    }

    const image = imageRef.current;

    if (image?.complete && image.naturalWidth > 0) {
      initialize();
    } else if (image) {
      image.onload = initialize;
    }

    return () => {
      cancelled = true;
      if (image) image.onload = null;
      faceLandmarker?.close();
    };
  }, [imageSrc]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "240px",
        zIndex: 9999,
        background: "#111",
        padding: "10px",
        borderRadius: "12px",
        border: "1px solid #444",
      }}
    >
      <p
        style={{
          color: "#00ff88",
          fontSize: "12px",
          textAlign: "center",
          marginBottom: "8px",
        }}
      >
        FACE TRACKING DEBUG
      </p>

      <div style={{ position: "relative", width: "100%" }}>
        <img
          ref={imageRef}
          src={imageSrc}
          alt="Face tracking"
          style={{
            width: "100%",
            display: "block",
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}
