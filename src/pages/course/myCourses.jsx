"use client";

import React, { useEffect, useState } from "react";
import { Typography, Chip, Spinner, Alert } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { CheckIcon } from "@heroicons/react/24/solid";
import CourseService from "@/services/coursesService";
import PlanetIcon from "@/components/ui/PlanetIcon";

function MyCourseCard({ course }) {
  const navigate = useNavigate();
  const placeholder = "https://placehold.co/400x400?text=Planeta";

  const progress = Math.min(course.progress_percentage, 100);
  const isCompleted = progress >= 100;

  const status = isCompleted ? "Explorado" : "Explorando";

  return (
    <div className="flex flex-col items-center bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-md border border-white/10 hover:scale-[1.03] transition-transform duration-300">
      {/* Imagem circular com anel */}
      <Link to={`/courses/${course.course.id}/content`} className="relative mb-4">
        <div className="w-36 h-36 rounded-full overflow-hidden shadow-lg ring-2 ring-red-500 animate-spin-slow relative z-10">
          <img
            src={course.course.image || placeholder}
            alt={course.course.title}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="absolute top-0 left-0 w-36 h-36 rounded-full border border-red-500 opacity-20 animate-pulse-slow" />
      </Link>

      {/* Título */}
      <Typography variant="h6" className="text-white font-bold text-center mb-1">
        {course.course.title}
      </Typography>

      {/* Chips */}
      <div className="flex flex-wrap justify-center gap-2 text-sm mb-3">
        <Chip
          value={course.course.is_free ? "Gratuito" : `R$ ${parseFloat(course.course.price).toFixed(2)}`}
          color={course.course.is_free ? "gray" : "red"}
          size="sm"
          className="text-xs"
        />
        <Chip
          value={status}
          variant="ghost"
          color={isCompleted ? "blue" : "yellow"}
          className={`${!isCompleted ? "animate-pulse" : ""}`}
          icon={
            isCompleted ? (
              <CheckIcon className="h-4 w-4 text-blue-400" />
            ) : (
              <PlanetIcon className="h-4 w-4 text-yellow-400" />
            )
          }
        />
      </div>

      {/* Progresso */}
      <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-red-500 via-pink-500 to-yellow-400 animate-pulse"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Typography variant="small" className="text-gray-400 text-xs mb-4">
        {progress}% Concluído
      </Typography>

      <Link to={`/courses/${course.course.id}/content`} className="w-full">
        <button className="w-full py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-500 transition">
          Continuar Jornada
        </button>
      </Link>
    </div>
  );
}

export default function MyCoursesPage() {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMyCourses() {
      try {
        const response = await CourseService.getMyCourses();
        setMyCourses(response);
      } catch {
        setError("Erro ao carregar seus cursos.");
      } finally {
        setLoading(false);
      }
    }
    fetchMyCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Spinner className="h-12 w-12 text-red-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Alert color="red" className="text-center">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-white z-0">
      {/* Fundo de estrelas */}
      <video
        src="/space-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-14 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-yellow-400 drop-shadow-md">
          Meus Planetas Explorados
        </h1>

        {myCourses.length === 0 ? (
          <div className="flex justify-center items-center mt-24">
            <Typography variant="h5" className="text-gray-400">
              Você ainda não embarcou em nenhuma missão.
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {myCourses.map((course) => (
              <MyCourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
