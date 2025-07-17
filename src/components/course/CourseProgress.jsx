// components/course/CourseProgress.jsx
import { Typography } from "@material-tailwind/react";

export default function CourseProgress({ percent }) {
  const progress = Math.min(percent, 100);

  return (
    <div className="w-full max-w-xl mx-auto mt-10 text-center space-y-3">
      <Typography variant="h5" className="text-pink-400 font-bold uppercase tracking-wider">
        Progresso do Curso
      </Typography>
      <Typography className="text-gray-300 text-lg">
        {progress}% Concluído
      </Typography>
      <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-500 via-pink-500 to-yellow-400 animate-pulse"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
