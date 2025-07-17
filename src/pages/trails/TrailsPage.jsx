// src/pages/trails/TrailsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Spinner,
  Alert,
  Card,
  CardBody,
  CardFooter,
  Button,
} from '@material-tailwind/react';
import { Link } from 'react-router-dom';
import PlanetIcon from '@/components/ui/PlanetIcon';
import TrailsService from '@/services/trailsService';

export default function TrailsPage() {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    TrailsService.list()
      .then(data => {
        setTrails(Array.isArray(data) ? data : data.results || []);
      })
      .catch(() => setError('Não foi possível carregar as trilhas.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Spinner className="h-12 w-12 text-yellow-400 animate-pulse" />
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

  return (
    <div
      className="relative bg-black min-h-screen py-12 bg-[url('/stars-bg.jpg')] bg-repeat z-0"
    >
      <div className="absolute inset-0 bg-black/75 z-0" />
      <div className="relative z-10 container mx-auto px-4">
        <Typography
          variant="h3"
          className="
            mb-8 text-center font-extrabold
            text-transparent bg-clip-text
            bg-gradient-to-r from-yellow-500 via-red-500 to-orange-500
          "
        >
          Rotas de Exploração
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trails.map(trail => (
            <Card
              key={trail.id}
              className="
                bg-gradient-to-br from-red-900 via-black to-red-800
                rounded-2xl shadow-xl overflow-hidden
              "
            >
              <CardBody className="p-6">
                <div className="flex items-center space-x-4">
                  <PlanetIcon
                    className="h-12 w-12 text-indigo-400 animate-spin-slow"
                  />
                  <Typography variant="h5" className="text-white font-bold">
                    {trail.name}
                  </Typography>
                </div>
                <Typography className="mt-4 text-gray-300">
                  {trail.description}
                </Typography>
                <Typography className="mt-2 flex items-center text-gray-400 space-x-2">
                  <PlanetIcon
                    className="h-5 w-5 text-yellow-400 animate-pulse"
                  />
                  <span>{trail.trail_courses.length} passos</span>
                </Typography>
              </CardBody>

              <CardFooter className="p-6">
                <Link to={`/trails/${trail.id}`}>
                  <Button fullWidth color="red">
                    Iniciar Missão
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
