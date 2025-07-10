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
  RocketLaunchIcon,
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
      } catch {
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

  if (loading) return <Loader />;
  if (error) return <ErrorMessage text={error} />;

  const total = steps.length;
  const done = completed.length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="relative min-h-screen bg-black text-white z-0">
      <Background />

      <div className="relative z-1 container mx-auto px-4 pt-24 pb-16 space-y-16">
        <CourseHeader course={course} />

        <div className="lg:grid lg:grid-cols-4 lg:gap-10 z-1">
          <main className="lg:col-span-4 space-y-12 z-1">
            <div className="flex flex-col items-center space-y-4 z-1">
              <Actions
                isEnrolled={isEnrolled}
                loadingEnroll={loadingEnroll}
                percent={percent}
                handleEnroll={handleEnroll}
              />
              {isEnrolled && <ProgressSection percent={percent} />}
            </div>

            <Description text={course.description} />
            <StepsList
              steps={steps}
              completed={completed}
              percent={percent}
              courseTitle={course.title}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

function Background() {
  return (
    <>
      <div className="absolute inset-0 bg-[url('/stars-bg.jpg')] bg-repeat opacity-10 z-0" aria-hidden />
      <div className="absolute inset-0 bg-[url('/nebula-bg.jpg')] bg-cover bg-center mix-blend-screen opacity-20 z-0" aria-hidden />
    </>
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black z-0">
      <Spinner color="purple" className="h-16 w-16 animate-spin" />
    </div>
  );
}

function ErrorMessage({ text }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black z-0">
      <Alert color="red" className="max-w-lg mx-auto text-center text-lg">{text}</Alert>
    </div>
  );
}

function CourseHeader({ course }) {
  return (
    <div className="relative h-96 rounded-3xl overflow-hidden drop-shadow-2xl border border-indigo-500/30 z-1">
      <div className="absolute inset-0 bg-[url('/nebula-bg.jpg')] bg-cover bg-center opacity-30 z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/95 z-0" />
      <div className="relative z-1 flex flex-col justify-center h-full px-8">
        <Link to="/courses" className="flex items-center text-indigo-300 hover:text-white mb-3">
          <ChevronLeftIcon className="h-5 w-5 mr-2" /> Voltar aos Cursos
        </Link>

        <div className="inline-flex items-center mb-4 space-x-3 bg-black/60 px-4 py-1 rounded-full border border-indigo-500/40">
          {course.is_free ? (
            <GiftIcon className="h-5 w-5 text-green-400" />
          ) : (
            <CurrencyDollarIcon className="h-5 w-5 text-red-400" />
          )}
          <Typography variant="small" className={course.is_free ? 'text-green-400' : 'text-red-400'}>
            {course.is_free ? 'GRATUITO' : 'PAGO'}
          </Typography>
        </div>

        <Typography variant="h1" className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
          {course.title}
        </Typography>

        <div className="mt-3 flex items-center gap-6 text-indigo-300 text-lg">
          <div className="flex items-center gap-2">
            <BoltIcon className="h-5 w-5 text-yellow-400 animate-pulse" /> {course.workload}h
          </div>
          {!course.is_free && <span>• R$ {parseFloat(course.price).toFixed(2)}</span>}
        </div>
      </div>
    </div>
  );
}

function ProgressSection({ percent }) {
  const progress = Math.min(percent, 100);

  return (
    <div className="space-y-3 w-full max-w-xl text-center z-1">
      <Typography variant="h5" className="text-pink-400 font-bold tracking-wide uppercase">
        Progresso da Jornada
      </Typography>

      <Typography className="text-gray-300 text-lg font-medium">
        {progress}% Concluído
      </Typography>

      <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-500 via-pink-500 to-yellow-400 animate-pulse"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}


function Description({ text }) {
  const [expanded, setExpanded] = useState(false);
  const preview = text.length > 250 ? text.slice(0, 250) + '...' : text;

  return (
    <section className="bg-gradient-to-b from-[#1f1f2e] to-[#12121c] p-8 rounded-3xl shadow-xl border border-indigo-500/20 z-1">
      <Typography variant="h4" className="text-pink-400 font-bold mb-4 tracking-wider uppercase">
        Sobre este Curso
      </Typography>
      <Typography className="text-gray-300 leading-relaxed">
        {expanded ? text : preview}
      </Typography>
      {text.length > 250 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 inline-block text-indigo-300 hover:text-indigo-100 transition"
        >
          {expanded ? 'Ver menos ▲' : 'Ver mais ▼'}
        </button>
      )}
    </section>
  );
}

function Actions({ isEnrolled, loadingEnroll, percent, handleEnroll }) {
  const progressComplete = percent >= 100;

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-6 z-1">
      {!isEnrolled && (
        <Button onClick={handleEnroll} disabled={loadingEnroll} color="purple" size="lg" className="shadow-lg">
          {loadingEnroll ? 'Processando...' : 'Matricule-se'}
        </Button>
      )}

      {isEnrolled && !progressComplete && (
        <Link to="content">
          <Button color="yellow" size="lg" className="shadow-lg hover:scale-105 transition">
            Continuar Explorando
          </Button>
        </Link>
      )}

      {isEnrolled && progressComplete && (
        <Button color="green" size="lg" disabled className="opacity-80">
          Curso Concluído 🚀
        </Button>
      )}
    </div>
  );
}

function StepsList({ steps, completed, percent, courseTitle }) {
  return (
    <section className="space-y-8 z-1">
      <Typography variant="h4" className="text-pink-400 font-bold uppercase tracking-wider">
        Jornada de Aprendizado
      </Typography>

      <ol className="border-l-2 border-indigo-600 ml-5 pl-4 space-y-6 max-h-[450px] overflow-y-auto pr-3">
        {steps.map(step => {
          const isDone = completed.includes(step.id);
          return (
            <li key={step.id} className="relative group">
              <span
                className={`absolute left-[-13px] top-2 w-4 h-4 rounded-full border-2 ${
                  isDone ? 'bg-green-400 border-green-400' : 'bg-gray-700 border-gray-500'
                }`}
              />
              <Typography variant="h6" className={`${isDone ? 'text-green-300' : 'text-indigo-100'} font-semibold`}>
                {step.title}
              </Typography>
              {step.description && (
                <Typography className="text-gray-400 mt-1 text-sm leading-relaxed">
                  {step.description}
                </Typography>
              )}
            </li>
          );
        })}
      </ol>

      {percent >= 100 && <Passaporte courseTitle={courseTitle} />}
    </section>
  );
}

function Passaporte({ courseTitle }) {
  return (
    <section className="bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1c] p-8 rounded-3xl border border-yellow-500/30 shadow-2xl text-center space-y-4 z-1">
      <Typography variant="h4" className="text-yellow-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
        <RocketLaunchIcon className="h-6 w-6 animate-bounce" /> Passaporte Galáctico
      </Typography>
      <Avatar size="xl" variant="circular" alt={courseTitle} src={`/api/courses/${courseTitle}/avatar`} className="ring-4 ring-yellow-400/50 mx-auto" />
      <Typography className="text-gray-300 text-lg font-medium">
        Planeta <strong>{courseTitle}</strong> conquistado!
      </Typography>
      <Typography className="text-gray-400">Parabéns! +10 XP 🌟</Typography>
    </section>
  );
}
