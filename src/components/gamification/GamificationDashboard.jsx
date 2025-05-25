// src/components/GamificationDashboard.jsx
import React from 'react';
import useGamification from '../../hooks/useGamification';
import { Card, Typography, Avatar, Chip, Tooltip } from '@material-tailwind/react';
import { StarIcon, CurrencyDollarIcon, FireIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import CircularProgress from '@/components/ui/CircularProgress';

export default function GamificationDashboard() {
  const { data, loading, error } = useGamification();

  if (loading) return <Typography>Carregando gamificação…</Typography>;
  if (error)  return <Typography color="red">Erro ao carregar dados</Typography>;

  const {
    xp = 0,
    nextLevelXp = 0,
    level,
    streak = 0,
    coins = 0,
    stamps = [],
    badges = [],
  } = data;

  // evita NaN: só calcula se nextLevelXp > 0
  const progressPercent = nextLevelXp > 0
    ? Math.min(100, Math.round((xp / nextLevelXp) * 100))
    : 0;

  return (
    <Card className="backdrop-blur-md bg-white/10 border border-indigo-500 rounded-2xl shadow-lg p-6 space-y-6">
      {/* XP Circular */}
      <div className="flex flex-col items-center">
        <CircularProgress
          progress={progressPercent}
          size={120}
          stroke={10}
          color="#6366F1"
        />
        <Typography variant="h6" className="text-indigo-200">
          Nível {level?.number ?? 1}
        </Typography>
        <Typography className="text-sm text-indigo-100">
          {xp} / {nextLevelXp} XP
        </Typography>
      </div>

      {/* Streak */}
      <div className="flex items-center space-x-2">
        <FireIcon className="h-6 w-6 text-orange-400" />
        <Typography>{streak} dias de sequência</Typography>
      </div>

      {/* Coins */}
      <div className="flex items-center space-x-2">
        <CurrencyDollarIcon className="h-6 w-6 text-yellow-400" />
        <Typography>{coins} Coins</Typography>
      </div>

      {/* Passaporte Galáctico */}
      <div>
        <Typography variant="h6" className="mb-2 flex items-center space-x-2">
          <GlobeAltIcon className="h-6 w-6 text-blue-400" />
          Passaporte Galáctico
        </Typography>
        <div className="flex flex-wrap gap-2">
          {stamps.map(stamp => (
            <Tooltip key={stamp.course} content={stamp.planet_name}>
              <Avatar
                variant="circular"
                size="lg"
                alt={stamp.planet_name}
                src={`/planets/${stamp.planet_name.toLowerCase()}.svg`}
                className="ring-2 ring-indigo-400"
              />
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div>
        <Typography variant="h6" className="mb-2 flex items-center space-x-2">
          <StarIcon className="h-6 w-6 text-purple-400" />
          Conquistas
        </Typography>
        <div className="flex flex-wrap gap-2">
          {badges.map(badge => (
            <Chip
              key={badge.code}
              value={badge.name}
              variant="outlined"
              className="text-indigo-100 border-indigo-400"
              icon={
                <img
                  src={badge.icon}
                  alt={badge.name}
                  className="h-5 w-5 rounded-full"
                />
              }
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
