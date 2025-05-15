// src/pages/course/CourseDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CourseService from '@/services/coursesService';
import {
  Typography,
  Spinner,
  Alert,
  Button,
} from '@material-tailwind/react';
import {
  ChevronLeftIcon,
  GiftIcon,
  CurrencyDollarIcon,
  CheckIcon,
  RocketLaunchIcon,
  BoltIcon,
} from '@heroicons/react/24/solid';

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [steps, setSteps] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loadingEnroll, setLoadingEnroll] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [data, stepsData, completedData, myCourses] = await Promise.all([
          CourseService.find(id),
          CourseService.getCourseSteps(id),
          CourseService.getCompletedSteps(id),
          CourseService.getMyCourses(),
        ]);
        setCourse(data);
        setSteps(stepsData);
        setCompleted(completedData);
        setIsEnrolled(myCourses.some(uc => uc.course.id === data.id));
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar detalhes do curso.');
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
      alert('Não foi possível matricular-se. Tente novamente.');
    } finally {
      setLoadingEnroll(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <Spinner color="red" className="h-12 w-12" />
    </div>
  );
  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <Alert color="red">{error}</Alert>
    </div>
  );

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero */}
      <div
        className="relative h-96 bg-[url('/stars-bg.jpg')] bg-cover bg-center"
        style={{ backgroundBlendMode: 'multiply' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90" />
        <div className="relative z-10 container mx-auto h-full flex flex-col justify-center px-4">
          <button
            onClick={() => window.history.back()}
            className="mb-4 inline-flex items-center gap-2 text-red-400 hover:text-white transition"
          >
            <ChevronLeftIcon className="h-6 w-6" />
            <span>Voltar</span>
          </button>
          {/* Paid / Free badge */}
          <div className="inline-flex items-center gap-1 bg-black/50 px-3 py-1 rounded-full mb-3">
            {course.is_free
              ? <GiftIcon className="h-5 w-5 text-green-400 animate-pulse" />
              : <CurrencyDollarIcon className="h-5 w-5 text-red-400 animate-pulse" />
            }
            <Typography
              variant="small"
              className={`font-bold ${course.is_free ? 'text-green-400' : 'text-red-400'}`}
            >
              {course.is_free ? 'GRATUITO' : 'PAGO'}
            </Typography>
          </div>
          <Typography
            variant="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400"
          >
            {course.title}
          </Typography>
          <Typography variant="h5" className="mt-2 text-gray-300 flex items-center gap-1">
            <BoltIcon className="h-5 w-5 text-yellow-300 animate-ping" />
            {course.workload}h{' '}
            {!course.is_free && `• R$ ${parseFloat(course.price).toFixed(2)}`}
          </Typography>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6 space-y-16">
        <div className="lg:grid lg:grid-cols-3 lg:gap-10">
          {/* About */}
          <div className="lg:col-span-2 space-y-8">
            <Typography variant="h4" className="font-semibold text-red-400">
              Sobre este curso
            </Typography>
            <Typography className="text-gray-300 leading-relaxed">
              {course.description}
            </Typography>
          </div>
          {/* Actions */}
          <div className="space-y-6 flex flex-col items-stretch mt-10 lg:mt-0">
            {isEnrolled
              ? <Button size="lg" color="green" className="w-full hover:scale-105 transition">Já Matriculado</Button>
              : <Button
                  size="lg"
                  color="red"
                  className="w-full hover:scale-105 transition"
                  onClick={handleEnroll}
                  disabled={loadingEnroll}
                >
                  {loadingEnroll ? 'Processando...' : course.is_free ? 'Matricular‐se' : 'Comprar'}
                </Button>
            }
            {isEnrolled && (
              <Link to={`/courses/${course.id}/content`}>
                <Button size="lg" color="white" className="w-full mt-2 hover:scale-105 transition">
                  Iniciar Curso
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Gamified learning path */}
        <div>
          <Typography variant="h4" className="font-semibold text-red-400 mb-6">
            O que você vai aprender
          </Typography>
          <div className="overflow-x-auto py-4">
            <ul className="flex items-center space-x-8 px-2">
              {steps.map((step, idx) => {
                const done = completed.includes(step.id);
                return (
                  <React.Fragment key={step.id}>
                    <li className="flex flex-col items-center text-center group">
                      <div
                        title={step.title}
                        className={`
                          relative w-16 h-16 flex items-center justify-center rounded-full text-2xl font-extrabold
                          transition-transform duration-300
                          ${done
                            ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.7)] hover:scale-110'
                            : isEnrolled
                              ? 'bg-gray-800 text-gray-300 hover:bg-red-700 hover:shadow-[0_0_15px_rgba(220,38,38,0.6)] hover:scale-110'
                              : 'bg-gray-700 text-gray-500'
                          }
                        `}
                      >
                        {done
                          ? <CheckIcon className="h-8 w-8" />
                          : idx + 1
                        }
                        {done && (
                          <RocketLaunchIcon className="absolute -top-2 -right-2 h-6 w-6 text-yellow-300 animate-bounce" />
                        )}
                      </div>
                      <Typography
                        variant="small"
                        className="mt-2 max-w-[100px] text-sm leading-snug break-words"
                        title={step.title}
                      >
                        {step.title}
                      </Typography>
                    </li>
                    {idx < steps.length - 1 && (
                      <div
                        className={`
                          flex-auto h-1 rounded-full transition-all duration-300
                          ${completed[idx] ? 'bg-green-500' : 'bg-gray-700 group-hover:bg-red-600'}
                        `}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
