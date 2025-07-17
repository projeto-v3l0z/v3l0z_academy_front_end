import { useState } from "react";
import { Typography } from "@material-tailwind/react";

function CourseDescription({ text }) {
  const [expanded, setExpanded] = useState(false);
  const limit = 250;

  const shouldTruncate = text.length > limit;
  const preview = shouldTruncate ? text.slice(0, limit) + "..." : text;

  return (
    <>
      <Typography className="text-gray-300 text-base leading-relaxed">
        {expanded || !shouldTruncate ? text : preview}
      </Typography>

      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-indigo-300 hover:text-indigo-100 text-sm transition"
        >
          {expanded ? "Ver menos ▲" : "Ver mais ▼"}
        </button>
      )}
    </>
  );
}

export default CourseDescription;