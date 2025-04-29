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
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner,
  Alert,
} from "@material-tailwind/react";
import CourseService from "@/services/coursesService";

function CourseCard({ course }) {
  const [open, setOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const handleOpen = () => setOpen(!open);
  const placeHolderImage = "https://placehold.co/600x400?text=Course+Image";

  useEffect(() => {
    async function checkEnrollment() {
      try {
        const myCourses = await CourseService.getMyCourses();
        const enrolled = myCourses.some(
          (userCourse) => userCourse.course.id === course.id
        );
        setIsEnrolled(enrolled);
      } catch (error) {
        console.error("Erro ao verificar matrícula:", error);
      }
    }
    checkEnrollment();
  }, [course.id]);

  return (
    <>
      <Card className="bg-gray-800 shadow-2xl rounded-2xl overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
        <CardHeader floated={false} className="relative h-48">
          <img
            src={course.image || placeHolderImage}
            alt={course.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <Chip
              value={course.is_free ? "Free" : "Pago"}
              color={course.is_free ? "green" : "red"}
              size="sm"
              className="font-bold"
            />
          </div>
        </CardHeader>
        <CardBody className="p-6">
          <Typography variant="h5" className="mb-1 font-bold text-white">
            {course.title}
          </Typography>
          <Typography variant="small" className="text-gray-400 mb-2">
            Carga horária: {course.workload}h
          </Typography>
          <Typography variant="h6" className="mt-2 font-semibold text-white">
            {course.is_free ? "Gratuito" : `R$ ${parseFloat(course.price).toFixed(2)}`}
          </Typography>
        </CardBody>
        <CardFooter className="flex items-center justify-between p-6">
          <Button
            size="sm"
            color="red"
            ripple={true}
            className="uppercase tracking-wide"
            onClick={handleOpen}
          >
            Saiba mais
          </Button>
        </CardFooter>
      </Card>

      <Dialog
        open={open}
        handler={handleOpen}
        size="lg"
        className="bg-gray-900 text-white"
      >
        <DialogHeader className="text-gray-200">{course.title}</DialogHeader>
        <DialogBody divider>
          <img
            src={course.image || placeHolderImage}
            alt={course.title}
            className="mb-4 w-full h-48 object-cover rounded-xl"
          />
          <Typography variant="small" className="text-gray-400 mb-4">
            Carga horária: {course.workload}h
          </Typography>
          <Typography className="text-gray-200">
            {course.description}
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="white"
            onClick={handleOpen}
            className="mr-2"
          >
            Fechar
          </Button>
          {isEnrolled ? (
            <Button
              size="sm"
              color="green"
              ripple={false}
              disabled
              className="uppercase tracking-wide"
            >
              Já Matriculado
            </Button>
          ) : (
            <Button
              size="sm"
              color="red"
              ripple
              className="uppercase tracking-wide"
            >
              {course.is_free ? "Matricular-se" : "Comprar"}
            </Button>
          )}
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await CourseService.listCourses();
        setCourses(response.results);
      } catch (err) {
        console.error("Erro ao buscar cursos:", err);
        setError("Erro ao carregar cursos.");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
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
          Nossos Cursos
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {Array.isArray(courses) && courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
