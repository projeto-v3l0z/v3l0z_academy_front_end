// src/routes/index.js
import { Profile } from '@/pages';
import publicRoutes from './publicRoutes';
import studentRoutes from './studentRoutes';
import teacherRoutes from './teacherRoutes';
import { Navigate } from 'react-router-dom';

export default [
  ...publicRoutes,
  ...studentRoutes,
  ...teacherRoutes,
  { path: '/profile', name: 'Meu Perfil', element: <Profile />, roles: ['student','both','teacher'] },
  { path: '*', element: <Navigate to="/home" replace /> }
];
