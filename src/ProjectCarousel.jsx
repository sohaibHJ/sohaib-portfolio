
import { useState } from "react";
import "./ProjectCarousel.css";

export default function ProjectCarousel({ images = [], title }) {
  const [current, setCurrent] = useState(0);

  if (!images.length) return null;

  const previous = () => {
    setCurrent((current - 1 + images.length) % images.length);
  };

  const next = () => {
    setCurrent((current + 1) % images.length);
  };

  return (
    <div
      className="project-carousel"
      onTouchStart={(e) => {
        e.currentTarget.dataset.touchX = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const start = Number(e.currentTarget.dataset.touchX);
        const end = e.changedTouches[0].clientX;

        if (start - end > 50) next();
        if (end - start > 50) previous();
      }}
    >
      <img
        src={images[current]}
        alt={`${title} - image ${current + 1}`}
        className="carousel-image"
      />

      {images.length > 1 && (
        <>
          <button className="carousel-arrow prev" onClick={previous}>
            ‹
          </button>

          <button className="carousel-arrow next" onClick={next}>
            ›
          </button>

          <div className="carousel-dots">
            {images.map((_, index) => (
              <button
                key={index}
                className={current === index ? "active" : ""}
                onClick={() => setCurrent(index)}
                aria-label={`Afficher l'image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
