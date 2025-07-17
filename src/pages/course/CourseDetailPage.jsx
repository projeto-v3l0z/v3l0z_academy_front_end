import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CourseService from "@/services/coursesService";
import {
  Spinner,
  Alert,
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  ChevronLeftIcon,
} from "@heroicons/react/24/solid";

// Componentes
import CourseHeader from "@/components/course/CourseHeader";
import CourseMetrics from "@/components/course/CourseMetrics";
import CourseProgress from "@/components/course/CourseProgress";
import CourseLearning from "@/components/course/CourseLearning";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loadingEnroll, setLoadingEnroll] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [data, completedSteps, myCourses] = await Promise.all([
          CourseService.find(id),
          CourseService.getCompletedSteps(id),
          CourseService.getMyCourses(),
        ]);
        setCourse(data);
        setCompleted(completedSteps);
        setIsEnrolled(myCourses.some((c) => c.course.id === data.id));
      } catch {
        setError("Erro ao carregar detalhes do curso.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleEnroll = async () => {
    setLoadingEnroll(true);
    try {
      await CourseService.enrollInCourse(course.id);
      setIsEnrolled(true);
    } catch {
      alert("Erro ao se matricular no curso.");
    } finally {
      setLoadingEnroll(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Spinner className="h-12 w-12 text-red-500" />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Alert color="red">{error}</Alert>
      </div>
    );

  const total = course?.steps?.length || 0;
  const done = completed?.length || 0;
  const percent = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="relative bg-black min-h-screen text-white overflow-hidden">
      <Background />

      <div className="relative z-0 max-w-7xl mx-auto px-4 py-20 space-y-20">
        <CourseHeader course={course} />
        <CourseMetrics course={course} />

        {isEnrolled && <CourseProgress percent={percent} />}

        <div className="flex justify-center mt-8">
          {!isEnrolled && (
            <Button
              onClick={handleEnroll}
              disabled={loadingEnroll}
              color="red"
              size="lg"
              className="shadow-lg"
            >
              {loadingEnroll ? "Processando..." : "Quero Estudar Agora"}
            </Button>
          )}
          {isEnrolled && (
            <Link to="content">
              <Button color="yellow" size="lg" className="ml-4 shadow-md">
                Acessar Conteúdo
              </Button>
            </Link>
          )}
        </div>

        <CourseLearning
          items={course.learning_goals || []}
          audience={course.target_audience || "Informações não disponíveis."}
        />
      </div>
    </div>
  );
}

function Background() {
  return (
    <>
      <video
        src="/space-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0" />
    </>
  );
}
