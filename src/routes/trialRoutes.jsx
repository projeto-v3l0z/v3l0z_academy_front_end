// src/routes/studentRoutes.js (ou onde você gerencia)
import TrailsPage from '@/pages/trails/TrailsPage';
import TrailDetailPage from '@/pages/trails/TrailDetailPage';

export default [
  { path: '/trails', name: 'Trilhas', element: <TrailsPage />, roles: ['student','both'] },
  { path: '/trails/:id', element: <TrailDetailPage />, roles: ['student','both'] },
];
