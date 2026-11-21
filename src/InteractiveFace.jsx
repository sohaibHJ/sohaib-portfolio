
import "./InteractiveFace.css";

export default function InteractiveFace({
  rotateX = 0,
  rotateY = 0,
  gazeX = 0,
  gazeY = 0,
}) {
  return (
    <div
      className="interactive-face"
      style={{
        transform: `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `,
        "--gaze-x": `${gazeX}px`,
        "--gaze-y": `${gazeY}px`,
      }}
    >
      <img
        id="portrait-face"
        src="/head.png"
        alt="Portrait de Sohaib"
        draggable="false"
      />
    </div>
  );
}
