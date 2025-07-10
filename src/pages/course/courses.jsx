import React, { useEffect, useState } from "react";
import {
  Typography,
  Chip,
  Spinner,
  Alert,
} from "@material-tailwind/react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import CourseService from "@/services/coursesService";
import PlanetIcon from "@/components/ui/PlanetIcon";

// -----------------------------------------------------------------------------
// Card estilo Planeta
// -----------------------------------------------------------------------------
function CourseCard({ course }) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const my = await CourseService.getMyCourses();
        const enrolled = my.some((uc) => uc.course.id === course.id);
        setIsEnrolled(enrolled);
        if (enrolled) {
          const { progress_percentage } = await CourseService.getCourseProgress(course.id);
          setProgress(progress_percentage);
        }
      } catch {}
    })();
  }, [course.id]);

  const placeholder = "https://placehold.co/400x400?text=Planeta";
  const status = !isEnrolled
    ? null
    : progress >= 100
    ? "Explorado"
    : "Explorando";

  return (
    <div className="flex flex-col items-center bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-md border border-white/10 hover:scale-[1.03] transition-transform duration-300">
      {/* Planeta (imagem circular) com anel */}
      <Link to={`/courses/${course.id}`} className="relative mb-4">
        <div className="w-36 h-36 rounded-full overflow-hidden shadow-lg ring-2 ring-indigo-500 animate-spin-slow relative z-10">
          <img
            src={course.image || placeholder}
            alt={course.title}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        {/* Anel animado */}
        <div className="absolute top-0 left-0 w-36 h-36 rounded-full border border-indigo-500 opacity-20 animate-pulse-slow" />
      </Link>

      {/* Informações do curso */}
      <Typography variant="h6" className="text-white font-bold text-center mb-1">
        {course.title}
      </Typography>

      <div className="flex flex-wrap justify-center gap-2 text-sm mb-3">
        <Chip
          value={course.is_free ? "Gratuito" : `R$ ${parseFloat(course.price).toFixed(2)}`}
          color={course.is_free ? "gray" : "red"}
          size="sm"
          className="text-xs"
        />

        {status && (
          <Chip
            value={status}
            variant="ghost"
            color={status === "Explorado" ? "blue" : "yellow"}
            className={`${status === "Explorando" ? "animate-pulse" : ""}`}
            icon={
              status === "Explorado" ? (
                <CheckIcon className="h-4 w-4 text-blue-400" />
              ) : (
                <PlanetIcon className="h-4 w-4 text-yellow-400" />
              )
            }
          />
        )}
      </div>

      <Link to={`/courses/${course.id}`} className="w-full">
        <button className="w-full py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-500 transition">
          Viajar para o Planeta
        </button>
      </Link>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Página principal
// -----------------------------------------------------------------------------
export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { results } = await CourseService.listCourses();
        setCourses(results);
      } catch {
        setError("Não foi possível carregar os cursos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Spinner className="h-12 w-12 text-indigo-500 animate-spin" />
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
    <div className="relative min-h-screen overflow-hidden text-white">
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
        <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-14 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 drop-shadow-md">
          Conheça os Planetas da V3L0Z Academy
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
