// components/course/CourseLearning.jsx
import { Typography } from "@material-tailwind/react";

export default function CourseLearning({ items, audience }) {
  return (
    <section className="grid md:grid-cols-2 gap-10 bg-[#12121c] text-white p-10 rounded-3xl border border-white/10">
      <div>
        <Typography variant="h4" className="text-red-400 mb-6 font-bold tracking-wide">
          O que você aprenderá
        </Typography>
        <ul className="list-disc pl-6 space-y-3 text-gray-300">
          {items.map((text, i) => (
            <li key={i}>{text}</li>
          ))}
        </ul>
      </div>

      <div>
        <Typography variant="h4" className="text-red-400 mb-6 font-bold tracking-wide">
          Público alvo
        </Typography>
        <Typography className="text-gray-300 whitespace-pre-line">{audience}</Typography>
      </div>
    </section>
  );
}
