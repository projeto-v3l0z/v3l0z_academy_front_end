"use client";

import React from "react";
import { Typography } from "@material-tailwind/react";

export default function RenderStepContent({ content }) {
  if (!content || !content.type) return null;

  if (content.type === "text") {
    return <Typography className="text-white">{content.value}</Typography>;
  }

  if (content.type === "video") {
    return (
      <div className="flex justify-center">
        <iframe
          src={content.url}
          title="Vídeo"
          width="640"
          height="360"
          allowFullScreen
          className="rounded-lg"
        />
      </div>
    );
  }

  if (content.type === "mixed") {
    return (
      <div className="flex flex-col gap-6">
        {content.blocks.map((block, index) => (
          <div key={index}>
            {block.block_type === "text" && (
              <Typography className="text-white">{block.value}</Typography>
            )}
            {block.block_type === "video" && (
              <div className="flex justify-center">
                <iframe
                  src={block.url}
                  title={`Vídeo ${index}`}
                  width="640"
                  height="360"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (content.type === "quiz") {
    return (
      <div className="text-white">
        <Typography variant="h5" className="mb-4">{content.intro_text}</Typography>
        {content.questions.map((q, idx) => (
          <div key={idx} className="mb-6">
            <Typography variant="h6">{q.question_text}</Typography>
            <ul className="list-disc list-inside">
              {q.options.map((opt, optIdx) => (
                <li key={optIdx}>{opt}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
