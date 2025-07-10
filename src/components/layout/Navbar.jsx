// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, Typography, Tooltip } from '@material-tailwind/react';
import {
  StarIcon,
  FireIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import useGamification from '@/hooks/useGamification';
import PlanetIcon from '../ui/PlanetIcon';

export default function Navbar({ routes, user, onLogout }) {
  const { data } = useGamification();
  const { xp = 0, level = {}, streak = 0 } = data;
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top bar com botão de toggle */}
      <nav className="bg-black/80 backdrop-blur-md fixed inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-3">
        <Link to="/home" className="flex items-center space-x-2">
          <img
            src="/img/logo-v3loz.svg"
            alt="Logo"
            className="h-8 w-auto"
          />
          <Typography variant="h5" className="text-white font-extrabold tracking-wider">
            V3I0z Academy
          </Typography>
        </Link>
        {/* Toggle mobile */}
        <button
          className="md:hidden text-gray-200 hover:text-indigo-300"
          onClick={() => setOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        {/* Horizontal menu desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {routes.map(r => (
            <NavLink
              key={r.path}
              to={r.path}
              className={({ isActive }) =>
                `relative px-1 py-1 text-gray-200 hover:text-indigo-300 transition ${
                  isActive
                    ? 'text-indigo-300 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-pink-500 after:via-purple-500 after:to-indigo-400 after:rounded-full'
                    : ''
                }`
              }
            >
              {r.name}
            </NavLink>
          ))}
          {user ? (
            <>
              {/* Level */}
              <Tooltip content={`Você já completou ${level?.number ?? 1} órbitas`}>
                <div className="flex items-center bg-black/50 px-2 py-1 rounded-full space-x-1">
                  <PlanetIcon className="h-6 w-6 text-indigo-400 animate-spin-slow" />
                  <Typography variant="small" className="text-indigo-200">
                    {level?.number ?? 1}
                  </Typography>
                </div>
              </Tooltip>
              {/* XP */}
              <Tooltip content={`Coletou ${xp} cristais de energia estelar`}>
                <div className="flex items-center bg-black/50 px-2 py-1 rounded-full space-x-1">
                  <StarIcon className="h-5 w-5 text-yellow-400 animate-pulse" />
                  <Typography variant="small" className="text-indigo-200">
                    {xp}
                  </Typography>
                </div>
              </Tooltip>
              {/* Streak */}
              {streak > 0 && (
                <Tooltip content={`Missão ativa por ${streak} ciclos solares`}>
                  <div className="flex items-center bg-black/50 px-2 py-1 rounded-full space-x-1 animate-pulse">
                    <FireIcon className="h-5 w-5 text-red-400 animate-bounce" />
                    <Typography variant="small" className="text-red-300">
                      {streak}
                    </Typography>
                  </div>
                </Tooltip>
              )}
              {/* User & Logout */}
              <div className="flex items-center space-x-2">
                <Typography variant="small" className="text-gray-300">
                  {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
                </Typography>
                <Button size="sm" color="red" onClick={onLogout}>
                  Sair
                </Button>
              </div>
            </>
          )
            : (
              <Link to="/sign-in">
                <Button size="sm" color="blue">
                  Entrar
                </Button>
              </Link>
            )}
        </div>
      </nav>

      {/* Sidebar (mobile) */}
      <div
        className={`
          fixed inset-y-0 left-0 w-64 bg-black/90 backdrop-blur-md
          transform transition-transform duration-300 z-40
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Typography variant="h6" className="text-white font-bold">
            Menu
          </Typography>
          <button
            className="text-gray-200 hover:text-indigo-300"
            onClick={() => setOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-4 flex flex-col space-y-2 px-4">
          {routes.map(r => (
            <NavLink
              key={r.path}
              to={r.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-2 py-2 rounded-lg text-gray-200 hover:bg-indigo-800 hover:text-white transition ${
                  isActive ? 'bg-indigo-800 text-white' : ''
                }`
              }
            >
              {r.name}
            </NavLink>
          ))}
          <div className="border-t border-gray-700 my-2" />
        </nav>
      </div>

      {/* Overlay para fechar sidebar clicando fora */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
