"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Chip,
  Button,
  Spinner,
  Alert,
  Progress,
} from "@material-tailwind/react";
import CourseService from "@/services/coursesService";
import { useNavigate } from "react-router-dom";


function MyCourseCard({ course }) {
  const navigate = useNavigate();
  const placeHolderImage = "https://placehold.co/600x400?text=Course+Image";

  const handleAccessCourse = () => {
    navigate(`/courses/${course.course.id}/content`);
  };

  return (
    <Card className="bg-gray-800 shadow-2xl rounded-2xl overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
      <CardHeader floated={false} className="relative h-48">
        <img
          src={course.course.image || placeHolderImage}
          alt={course.course.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <Chip
            value={course.course.is_free ? "Free" : "Pago"}
            color={course.course.is_free ? "green" : "red"}
            size="sm"
            className="font-bold"
          />
        </div>
      </CardHeader>
      <CardBody className="p-6">
        <Typography variant="h5" className="mb-1 font-bold text-white">
          {course.course.title}
        </Typography>
        <Typography variant="small" className="text-gray-400 mb-2">
          Carga horária: {course.course.workload}h
        </Typography>
        <Typography variant="small" className="text-gray-400 mb-2">
          Progresso:
        </Typography>
        <Progress value={course.progress_percentage} color="green" className="h-3" />
        <Typography variant="small" className="text-gray-400 mt-1 text-end">
          {course.progress_percentage}%
        </Typography>
      </CardBody>
      <CardFooter className="flex items-center justify-end p-6">
        <Button size="sm" color="red" ripple onClick={handleAccessCourse}>
          Acessar Curso
        </Button>
      </CardFooter>
    </Card>
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
      } catch (err) {
        console.error("Erro ao buscar meus cursos:", err);
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
        <Spinner color="red" className="h-12 w-12" />
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
    <div className="bg-black min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Typography
          variant="h3"
          className="mb-8 text-center font-bold text-white"
        >
          Meus Cursos
        </Typography>

        {myCourses.length === 0 ? (
          <div className="flex justify-center items-center mt-20">
            <Typography variant="h5" className="text-gray-400">
              Você ainda não está inscrito em nenhum curso.
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {myCourses.map((course) => (
              <MyCourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
