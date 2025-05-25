// src/pages/course/CourseDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CourseService from '@/services/coursesService';
import {
  Typography,
  Spinner,
  Alert,
  Button,
  Progress,
  Avatar,
} from '@material-tailwind/react';
import {
  ChevronLeftIcon,
  GiftIcon,
  CurrencyDollarIcon,
  BoltIcon,
  CheckIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/solid';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';

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
        <Alert color="red">{error}</Alert>
      </div>
    );
  }

  // Calcular progresso
  const total = steps.length;
  const done = completed.length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Starfield */}
      <div
        className="absolute inset-0 bg-[url('/stars-bg.jpg')] bg-repeat opacity-20"
        aria-hidden="true"
      />

      {/* Conteúdo principal (abaixo da Navbar) */}
      <div className="relative z-1 container mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <div className="relative h-80 bg-[url('/nebula-bg.jpg')] bg-cover bg-center rounded-2xl overflow-hidden drop-shadow-lg mb-8">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-indigo-900/80" />
          <div className="relative z-1 h-full flex flex-col justify-center px-6">
            <button
              onClick={() => window.history.back()}
              className="flex items-center mb-3 text-indigo-200 hover:text-white"
            >
              <ChevronLeftIcon className="h-6 w-6 mr-2" /> Voltar
            </button>
            <div className="inline-flex items-center gap-2 mb-4 bg-black/50 px-3 py-1 rounded-full animate-pulse">
              {course.is_free ? (
                <GiftIcon className="h-5 w-5 text-green-300" />
              ) : (
                <CurrencyDollarIcon className="h-5 w-5 text-red-300" />
              )}
              <Typography
                variant="small"
                className={course.is_free ? 'text-green-300' : 'text-red-300'}
              >
                {course.is_free ? 'GRATUITO' : 'PAGO'}
              </Typography>
            </div>
            <Typography
              variant="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400"
            >
              {course.title}
            </Typography>
            <div className="mt-2 flex items-center space-x-4 text-indigo-200">
              <BoltIcon className="h-5 w-5 text-yellow-400 animate-ping" />
              <span>{course.workload}h</span>
              {!course.is_free && (
                <span>• R$ {parseFloat(course.price).toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Conteúdo do Curso */}
          <div className="lg:col-span-3 space-y-8">
            {/* Ações */}
            <div className="flex flex-wrap gap-4">
              {!isEnrolled && (
                <Button
                  onClick={handleEnroll}
                  disabled={loadingEnroll}
                  color="red"
                  size="lg"
                >
                  {loadingEnroll ? 'Processando...' : 'Matricular-se'}
                </Button>
              )}
              {isEnrolled && percent < 100 && (
                <Link to={`/courses/${id}/content`}>
                  <Button color="yellow" size="lg">
                    Continuar Explorando
                  </Button>
                </Link>
              )}
              {isEnrolled && percent >= 100 && (
                <Button color="blue" size="lg" disabled>
                  Explorado
                </Button>
              )}
            </div>

            {/* Progresso */}
            {isEnrolled && (
              <div>
                <Typography variant="h5" className="mb-2">
                  Progresso do curso: {percent}%
                </Typography>
                <Progress
                  value={percent}
                  className="h-3 rounded-full bg-gray-700"
                  barClassName="bg-green-400"
                />
              </div>
            )}

            {/* Sobre */}
            <section className="bg-[#1f1f2e] p-6 rounded-2xl drop-shadow-md">
              <Typography variant="h4" className="text-red-400 mb-4">
                Sobre este curso
              </Typography>
              <Typography className="text-gray-300 leading-relaxed">
                {course.description}
              </Typography>
            </section>

            {/* Etapas - scrollable */}
            <section className="max-h-[400px] overflow-y-auto">
              <Typography variant="h4" className="text-red-400 mb-4">
                Etapas do aprendizado
              </Typography>
              <ol className="border-l-2 border-indigo-600 ml-4">
                {steps.map((step, idx) => {
                  const doneStep = completed.includes(step.id);
                  return (
                    <li
                      key={step.id}
                      className="mb-8 ml-4 relative"
                    >
                      <span
                        className={
                          `absolute -left-6 top-0 p-1 rounded-full border-2 ` +
                          (doneStep
                            ? 'bg-green-400 border-green-500'
                            : 'bg-gray-800 border-gray-600')
                        }
                      >
                        {doneStep ? (
                          <CheckIcon className="h-4 w-4 text-black" />
                        ) : (
                          <span className="text-gray-500 font-bold">
                            {idx + 1}
                          </span>
                        )}
                      </span>
                      <div className="pl-2">
                        <Typography
                          variant="h6"
                          className={doneStep ? 'text-green-300' : 'text-indigo-200'}
                        >
                          {step.title}
                        </Typography>
                        {step.description && (
                          <Typography className="text-gray-400 mt-1">
                            {step.description}
                          </Typography>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
              {/* Mensagem de conclusão */}
              {isEnrolled && percent >= 100 && (
                <div className="mt-4 p-4 bg-green-800 rounded-lg text-center">
                  <Typography variant="h6" className="text-white">
                    Parabéns! Você completou todas as etapas!
                  </Typography>
                </div>
              )}

              {/* Passaporte Galáctico */}
              {isEnrolled && percent >= 100 && (
                <section className="mt-6 bg-[#1a1a2e] p-6 rounded-2xl drop-shadow-md relative">
                  <Typography
                    variant="h4"
                    className="text-yellow-400 mb-4 flex items-center justify-center space-x-2"
                  >
                    <RocketLaunchIcon className="h-6 w-6 text-yellow-300 animate-pulse" />
                    Passaporte Galáctico
                  </Typography>
                  <div className="flex items-center justify-center mb-4">
                    <Avatar
                      size="xl"
                      variant="circular"
                      alt={course.title}
                      src={course.image}
                      className="ring-4 ring-yellow-400/50"
                    />
                  </div>
                  <Typography className="text-gray-300 text-center mb-2">
                    Parabéns, comandante! Seu passaporte foi carimbado com o planeta{' '}
                    <strong>{course.title}</strong>.
                  </Typography>
                  <Typography className="text-gray-300 text-center">
                    Você ganhou <strong>10 XP</strong> por completar esta jornada.
                  </Typography>
                </section>
              )}
            </section>
          </div>

          {/* Sidebar gamificada */}
          <aside className="hidden lg:block lg:col-span-1">
            <GamificationDashboard />
          </aside>
        </div>
      </div>
    </div>
  );
}
