
import { useEffect, useState } from "react";

export default function EyeMovement() {
  const [gaze, setGaze] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    function handleMouseMove(event) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const movementX = (event.clientX - centerX) / centerX;
      const movementY = (event.clientY - centerY) / centerY;

      setGaze({
        x: Math.max(-1, Math.min(1, movementX)),
        y: Math.max(-1, Math.min(1, movementY)),
      });
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: "20px",
        bottom: "100px",
        padding: "12px",
        background: "#111",
        color: "#00ffff",
        border: "1px solid #333",
        borderRadius: "10px",
        fontFamily: "monospace",
        fontSize: "12px",
        zIndex: 99999,
      }}
    >
      <div>GAZE DIRECTION</div>
      <div>X : {gaze.x.toFixed(2)}</div>
      <div>Y : {gaze.y.toFixed(2)}</div>
    </div>
  );
}
