"use client";

import React from "react";
import {
  Typography,
  Card,
  CardBody,
  Radio,
  RadioGroup,
  Alert as MTAlert,
} from "@material-tailwind/react";

export default function RenderStepContent({ content }) {
  // normalize blocks
  const blocks = content?.blocks ?? content?.content?.blocks ?? [];
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <div className="space-y-8 px-4">
      {blocks.map((block, idx) => {
        const key = `block-${idx}-${block.id || ""}`;
        const { type, data } = block;

        switch (type) {
          case "heading": {
            const level = Math.min(Math.max(data.level || 2, 1), 6);
            return (
              <Typography
                key={key}
                variant={`h${level}`}
                className="text-white"
              >
                {data.text}
              </Typography>
            );
          }

          case "text":
            return (
              <Typography key={key} className="text-white">
                {data.text}
              </Typography>
            );

          case "video": {
            const src = data.url ??
              (data.provider === "youtube"
                ? `https://www.youtube.com/embed/${data.videoId}`
                : "");
            return (
              <div key={key} className="flex justify-center">
                <iframe
                  className="rounded-lg"
                  width="640"
                  height="360"
                  src={src}
                  title={`Vídeo ${idx + 1}`}
                  allowFullScreen
                />
              </div>
            );
          }

          case "image":
            return (
              <div key={key} className="flex justify-center">
                <img
                  className="max-w-full rounded-lg"
                  src={data.src ?? data.url}
                  alt={data.alt ?? ""}
                />
              </div>
            );

          case "code":
            return (
              <pre
                key={key}
                className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto"
              >
                <code>{data.code}</code>
              </pre>
            );

          case "checklist":
            return (
              <ul key={key} className="list-disc list-inside text-white">
                {data.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      readOnly
                      className="accent-red-600"
                    />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            );

          case "alert": {
            const colors = {
              info: "bg-blue-600",
              success: "bg-green-600",
              warning: "bg-yellow-600",
              danger: "bg-red-600",
            };
            return (
              <div
                key={key}
                className={`${colors[data.style] || colors.info} p-4 rounded`}
              >
                <Typography className="text-white">
                  {data.text}
                </Typography>
              </div>
            );
          }

          case "embed":
            return (
              <div key={key} className="flex justify-center">
                <iframe
                  src={data.src}
                  width="100%"
                  height={data.height || 400}
                  className="rounded-lg"
                />
              </div>
            );

          case "audio":
            return (
              <audio key={key} controls src={data.src} className="w-full mt-4" />
            );

          case "table":
            return (
              <div key={key} className="overflow-x-auto">
                <table className="table-auto w-full text-white">
                  <thead>
                    <tr>
                      {data.headers.map((h, i) => (
                        <th
                          key={i}
                          className="px-4 py-2 border"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td
                            key={c}
                            className="px-4 py-2 border"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "accordion":
            return (
              <div key={key} className="space-y-2">
                {data.items.map((item, i) => (
                  <details
                    key={i}
                    className="bg-gray-700 p-3 rounded"
                  >
                    <summary className="font-semibold text-white cursor-pointer">
                      {item.title}
                    </summary>
                    <Typography className="mt-2 text-gray-300">
                      {item.content}
                    </Typography>
                  </details>
                ))}
              </div>
            );

          case "timeline":
            return (
              <ul
                key={key}
                className="border-l-2 border-gray-600 pl-4 text-white"
              >
                {data.events.map((e, i) => (
                  <li key={i} className="mb-4">
                    <Typography className="font-semibold">
                      {e.date}
                    </Typography>
                    <Typography>{e.text}</Typography>
                  </li>
                ))}
              </ul>
            );

          case "quiz":
            return (
              <Card key={key} className="bg-gray-800">
                <CardBody>
                  {Array.isArray(data.questions) &&
                    data.questions.map((q, qIdx) => (
                      <div
                        key={`q-${q.id ?? qIdx}`}
                        className="mb-6"
                      >
                        <Typography
                          variant="h6"
                          className="text-white mb-2"
                        >
                          {qIdx + 1}. {q.question}
                        </Typography>
                        <RadioGroup
                          name={`quiz-${idx}-${qIdx}`}
                          className="flex flex-col gap-2"
                        >
                          {q.options.map((opt, oIdx) => (
                            <Radio
                              key={`opt-${oIdx}`}
                              label={opt}
                              color="red"
                              className="text-white"
                            />
                          ))}
                        </RadioGroup>
                      </div>
                    ))}
                </CardBody>
              </Card>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
