"use client";

export default function HalfCircleText({ text = "Bending Text Along a Half Circle!" }) {
  return (
    <div className=""> 
    <svg width="100" height="100" viewBox="0 0 300 160">
      {/* Half Circle Path */}
      <path
        id="halfCirclePath"
        d="M 20 140 A 130 130 0 0 1 280 140"
        fill="transparent"
        // stroke="lightgray"
      />

      {/* Text on the Path */}
      <text fontSize="40" fill="white">
        
        <textPath href="#halfCirclePath" startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
    </div>
  );
}