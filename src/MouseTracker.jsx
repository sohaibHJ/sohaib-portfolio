
import { useEffect, useState } from "react";

export default function MouseTracker() {
  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    function handleMouseMove(event) {
      setMouse({
        x: event.clientX,
        y: event.clientY,
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
        bottom: "20px",
        left: "20px",
        background: "#111",
        color: "#00ff88",
        padding: "12px 18px",
        borderRadius: "10px",
        fontFamily: "monospace",
        fontSize: "13px",
        zIndex: 99999,
        border: "1px solid #333",
      }}
    >
      <div>MOUSE TRACKING</div>
      <div>X : {mouse.x}</div>
      <div>Y : {mouse.y}</div>
    </div>
  );
}
