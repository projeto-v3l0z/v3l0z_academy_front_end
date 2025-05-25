// src/pages/course/CoursesPage.jsx
import React, { useEffect, useState } from "react";
import {
  Typography,
  Chip,
  Spinner,
  Alert,
} from "@material-tailwind/react";
import {
  GlobeAltIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import CourseService from "@/services/coursesService";
import PlanetIcon from "@/components/ui/PlanetIcon";

// -----------------------------------------------------------------------------
// Cada curso como um planeta clicável
// -----------------------------------------------------------------------------
function CourseCard({ course }) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const my = await CourseService.getMyCourses();
        const enrolled = my.some(uc => uc.course.id === course.id);
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
    <div className="flex flex-col items-center space-y-4">
      <Link to={`/courses/${course.id}`}> 
        <div className="relative w-48 h-48 rounded-full overflow-hidden ring-4 ring-red-500/40 hover:scale-105 transition-transform cursor-pointer">
          <img
            src={course.image || placeholder}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </Link>

      <div className="flex items-center space-x-1">
        <PlanetIcon className="h-6 w-6 text-indigo-400" />
        <Typography variant="h6" className="text-white font-bold text-center">
          {course.title}
        </Typography>
      </div>

      <div className="flex items-center space-x-2">
        <GlobeAltIcon className="h-5 w-5 text-red-400 animate-spin-slow" />
        <Chip
          value={course.is_free ? "Gratuito" : `R$ ${parseFloat(course.price).toFixed(2)}`}
          color={course.is_free ? "gray" : "red"}
          size="sm"
          className="font-bold"
        />
      </div>

      {status && (
        <Chip
          value={status}
          variant="ghost"
          color={status === "Explorado" ? "blue" : "yellow"}
          className={`flex items-center space-x-4 ${status === "Explorando" ? "animate-pulse" : ""}`}
          icon={
            status === "Explorado" ? (
              <CheckIcon className="h-5 w-5 text-blue-400" />
            ) : (
              <PlanetIcon className="h-5 w-5 text-yellow-400" />
            )
          }
        />
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// CoursesPage
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
        setError("Não foi possível carregar cursos.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Spinner className="h-12 w-12 text-red-500 animate-pulse" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Alert color="red" className="text-center">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Vídeo de fundo em loop */}
      <video
        src="/space-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay para escurecer um pouco */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Conteúdo */}
      <div className="relative z-1 py-12 container mx-auto px-4">
        <Typography
          variant="h3"
          className="mb-8 text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-red-500 to-orange-500"
        >
          Aventure-se em novos planetas
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}