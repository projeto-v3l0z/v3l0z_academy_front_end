import { Link } from "react-router-dom";
import {
  ChevronLeftIcon,
  BoltIcon,
} from "@heroicons/react/24/solid";
import {
  Typography,
  Button,
  Chip,
} from "@material-tailwind/react";
import CourseDescription from "./CourseDescription";
import getYoutubeVideoId from "@/utils/getYouTubeVideoId";

export default function CourseHeader({
  course,
  isEnrolled,
  loadingEnroll,
  handleEnroll,
  steps = [],
}) {
  return (
    <header className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      {/* Texto e informações */}
      <div className="space-y-5">
        <Link
          to="/courses"
          className="inline-flex items-center text-indigo-300 hover:text-white"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-2" />
          Voltar aos Cursos
        </Link>

        <Chip
          value={course.is_free ? "Gratuito" : "Pago"}
          color={course.is_free ? "green" : "red"}
          className="uppercase font-bold w-fit"
        />

        <Typography
          variant="h2"
          className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 font-bold"
        >
          {course.title}
        </Typography>

        <CourseDescription text={course.description} />

        <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <BoltIcon className="h-5 w-5 text-yellow-400 animate-pulse" />
            {course.workload}h para conclusão
          </div>
          <div>{steps.length} etapas</div>
          <div className="text-green-400">Certificado</div>
        </div>

        {!isEnrolled ? (
          <Button
            onClick={handleEnroll}
            loading={loadingEnroll}
            color="purple"
            className="mt-4"
          >
            {loadingEnroll ? "Processando..." : "Quero começar agora"}
          </Button>
        ) : (
          <Link to="content">
            <Button color="red" className="mt-4">
              Acessar conteúdo
            </Button>
          </Link>
        )}
      </div>

      {/* Vídeo ao lado */}
      <div>
        <div className="aspect-video rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <iframe
            src={`https://www.youtube.com/embed/${getYoutubeVideoId(course.intro_video_url) || "dQw4w9WgXcQ"}`}
            title="Introdução ao Curso"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </header>
  );
}
