import React, { useState } from "react";
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
} from "@material-tailwind/react";

// Mock de dados de cursos
const mockCourses = [
  {
    id: 1,
    title: "React Avançado",
    image: "https://placehold.co/600x400?text=React+Avançado",
    duration: "20h",
    price: 0,
    isFree: true,
    professor: "Maria Souza",
    description:
      "Neste curso, você vai dominar conceitos avançados do React, incluindo hooks personalizados, contexto, suspense e otimizações de performance.",
  },
  {
    id: 2,
    title: "Node.js Completo",
    image: "https://placehold.co/600x400?text=Node.js+Completo",
    duration: "15h",
    price: 199.9,
    isFree: false,
    professor: "Carlos Pereira",
    description:
      "Aprenda a construir APIs RESTful, autenticação, manipulação de arquivos e deploy de aplicações backend com Node.js e Express.",
  },
  {
    id: 3,
    title: "TypeScript Essencial",
    image: "https://placehold.co/600x400?text=TypeScript+Essencial",
    duration: "10h",
    price: 0,
    isFree: true,
    professor: "Ana Lima",
    description:
      "Introdução ao TypeScript: tipos básicos, funções genéricas, interfaces, classes e integração com frameworks modernos.",
  },
];

// Card personalizado com estilo dark, hover e modal de detalhes
function CourseCard({ course }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  return (
    <>
      <Card className="bg-gray-800 shadow-2xl rounded-2xl overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
        <CardHeader floated={false} className="relative h-48">
          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <Chip
              value={course.isFree ? "Free" : "Pago"}
              color={course.isFree ? "green" : "red"}
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
            Carga horária: {course.duration}
          </Typography>
          <Typography variant="h6" className="mt-2 font-semibold text-white">
            {course.isFree ? "Gratuito" : `R$ ${course.price.toFixed(2)}`}
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
            src={course.image}
            alt={course.title}
            className="mb-4 w-full h-48 object-cover rounded-xl"
          />
          <Typography variant="small" className="text-gray-400 mb-2">
            Professor: {course.professor}
          </Typography>
          <Typography variant="small" className="text-gray-400 mb-4">
            Carga horária: {course.duration}
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
          <Button size="sm" color="red" ripple>
            {course.isFree ? "Matricular-se" : "Comprar"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

// Página de listagem de cursos com fundo escuro
export default function CoursesPage() {
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
          {mockCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
