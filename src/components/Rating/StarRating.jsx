import { useCallback } from "react";
import PropTypes from "prop-types";

export default function StarRating({
  value = 0,
  max = 5,
  size = 20,
  gap = 4,
  activeColor = "#FDB022",
  inactiveColor = "#F5F5F5",
  readOnly = true,
  onChange = () => {},
  ariaLabel = "Rating",
}) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  const handleClick = useCallback(
    (v) => {
      if (!readOnly && typeof onChange === "function") onChange(v);
    },
    [readOnly, onChange],
  );

  const handleKeyDown = useCallback(
    (e, v) => {
      if (readOnly) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onChange(v);
      }
      if (e.key === "ArrowRight" && v < max) {
        onChange(Math.min(max, v + 1));
      }
      if (e.key === "ArrowLeft" && v > 0) {
        onChange(Math.max(0, v - 1));
      }
    },
    [readOnly, onChange, max],
  );

  return (
    <div
      role={readOnly ? "img" : "radiogroup"}
      aria-label={ariaLabel}
      style={{ display: "flex", alignItems: "center", gap: `${gap}px` }}
    >
      {stars.map((star) => {
        const isActive = star <= Math.round(value);
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onKeyDown={(e) => handleKeyDown(e, star)}
            aria-checked={isActive}
            role={readOnly ? undefined : "radio"}
            tabIndex={readOnly ? -1 : 0}
            title={`${star} ${star === 1 ? "star" : "stars"}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              margin: 0,
              width: `${size}px`,
              height: `${size}px`,
              background: "transparent",
              border: "none",
              cursor: readOnly ? "default" : "pointer",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={size}
              height={size}
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M8.538.61a.5.5 0 0 1 .924 0l2.066 4.967a.5.5 0 0 0 .421.307l5.363.43a.5.5 0 0 1 .286.878l-4.086 3.5a.5.5 0 0 0-.161.496l1.248 5.233a.5.5 0 0 1-.747.543L9.26 14.159a.5.5 0 0 0-.522 0l-4.59 2.804a.5.5 0 0 1-.748-.542l1.248-5.233a.5.5 0 0 0-.16-.496l-4.087-3.5a.5.5 0 0 1 .286-.878l5.363-.43a.5.5 0 0 0 .421-.307L8.538.61Z"
                fill={isActive ? activeColor : inactiveColor}
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

StarRating.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  size: PropTypes.number,
  gap: PropTypes.number,
  activeColor: PropTypes.string,
  inactiveColor: PropTypes.string,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
  ariaLabel: PropTypes.string,
};
