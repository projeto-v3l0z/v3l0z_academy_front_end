// src/pages/trails/TrailDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Typography,
  Spinner,
  Alert,
  Button,
  Progress,
} from '@material-tailwind/react';
import {
  CheckIcon,
  RocketLaunchIcon,
  FireIcon,
} from '@heroicons/react/24/solid';
import TrailsService from '@/services/trailsService';

export default function TrailDetailPage() {
  const { id } = useParams();
  const [trail, setTrail] = useState(null);
  const [userTrail, setUserTrail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      TrailsService.get(id),
      TrailsService.progress(id),
    ])
      .then(([trailData, progressData]) => {
        setTrail(trailData);
        const ut = Array.isArray(progressData)
          ? progressData[0] || null
          : progressData;
        setUserTrail(ut);
      })
      .catch(() => setError('Não foi possível carregar a missão.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStart = () => {
    TrailsService.start(id)
      .then(data => setUserTrail(data))
      .catch(() => setError('Não foi possível iniciar a missão.'));
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-black pt-20">
      <Spinner className="h-12 w-12 text-yellow-400 animate-pulse" />
    </div>
  );
  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-black pt-20">
      <Alert color="red">{error}</Alert>
    </div>
  );
  if (!trail) return (
    <div className="flex justify-center items-center min-h-screen bg-black pt-20">
      <Alert color="red">Missão não encontrada.</Alert>
    </div>
  );

  const enrolled = Boolean(userTrail);
  const progress = userTrail?.progress_percentage ?? 0;
  const steps = trail.trail_courses || [];
  const total = steps.length;

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Looping starfield video */}
      <div className="absolute inset-0 z-0">
        <video src="/space-video.mp4" autoPlay loop muted className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="relative z-0 container mx-auto px-4 pt-20 pb-12">
        {/* Cockpit Header */}
        <div className="bg-gradient-to-br from-[#11101A] to-[#1E1B2B] border-4 border-yellow-400 rounded-3xl p-6 mb-12 drop-shadow-2xl flex flex-col md:flex-row md:justify-between md:items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-yellow-300 hover:text-white mb-4 md:mb-0"
          >
            <RocketLaunchIcon className="h-6 w-6 mr-2 animate-spin-slow" /> Voltar
          </button>
          <div className="flex-1 md:mx-8">
            <Typography
              variant="h1"
              className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400"
            >
              🚀 {trail.name}
            </Typography>
            <Typography className="mt-2 text-gray-300">
              {trail.description}
            </Typography>
          </div>
          <div className="text-center">
            {!enrolled ? (
              <Button color="red" size="lg" onClick={handleStart}>
                Iniciar Missão
              </Button>
            ) : (
              <div className="space-y-2">
                <Typography variant="h5">Progresso: {progress}%</Typography>
                <Progress
                  value={progress}
                  className="h-4 rounded-full bg-gray-800"
                  barClassName="bg-green-400"
                />
              </div>
            )}
          </div>
        </div>

        {/* Steps Timeline */}
        <div className="bg-gradient-to-br from-[#1E1B2B] to-[#11101A] p-6 rounded-2xl drop-shadow-lg overflow-y-auto max-h-[65vh]">
          <Typography variant="h4" className="text-yellow-400 mb-6 text-center">
            📡 Roteiro da Jornada Estelar
          </Typography>
          <ul className="space-y-8">
            {steps.map((step, idx) => {
              const pct = Math.round(((idx + 1) / total) * 100);
              const done = enrolled && progress >= pct;
              return (
                <li key={step.id} className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <span className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-lg font-bold ${
                      done ? 'bg-green-400 border-green-500 text-black' : 'bg-gray-800 border-gray-600'
                    }`}>
                      {done ? <CheckIcon className="w-6 h-6" /> : idx + 1}
                    </span>
                    {idx < total - 1 && <div className="w-px h-full bg-gradient-to-b from-yellow-400 via-transparent to-transparent mt-2 animate-pulse" />}
                  </div>
                  <div className="flex-1">
                    {/* Mostrar nome do curso antes do título da etapa */}
                    <Typography variant="medium" className="text-indigo-300 mb-1">
                      Curso: {step.course.title}
                    </Typography>
                    <Typography variant="h6" className={done ? 'text-green-300' : 'text-white'}>
                      {step.title}
                    </Typography>
                    {step.description && (
                      <Typography className="text-gray-400 mt-1">
                        {step.description}
                      </Typography>
                    )}
                    {enrolled && !done && (
                      <Link to={`/courses/${step.course.id}/content`}>
                        <Button size="sm" color="yellow" className="mt-2 flex items-center space-x-1">
                          <FireIcon className="h-5 w-5 text-red-400 animate-bounce" />
                          <span>Prosseguir</span>
                        </Button>
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          {enrolled && progress >= 100 && (
            <div className="mt-8 p-4 bg-green-700 rounded-lg text-center animate-pulse">
              <Typography variant="h6" className="text-black">
                🎖️ Missão completada com sucesso!
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
