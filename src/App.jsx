// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from './store/userSlice';
import AuthService from '@/services/authService';
import BaseLayout from './components/layout/BaseLayout';
import routes from '@/routes';
import { Button } from '@material-tailwind/react';

export default function App() {
  const { pathname } = useLocation();
  const user = useSelector(s => s.user.info);
  const dispatch = useDispatch();
  const role = user ? user.user_type : 'guest';

  const navRoutes = routes.filter(r => r.name && (!r.roles || r.roles.includes(role)));
  const handleLogout = () => { dispatch(clearUser()); AuthService.logout(); };

  // em /sign-in e /sign-up, pula o Layout
  const isAuthPage = ['/sign-in','/sign-up'].includes(pathname);

  return (
    <>
      {!isAuthPage && (
        <BaseLayout
          routes={navRoutes}
          user={user}
          onLogout={handleLogout}
        />
      )}
      <Routes>
        {routes.map((r,i) =>
          r.element ? (
            <Route key={i} path={r.path} element={r.element} />
          ) : null
        )}
      </Routes>
    </>
  );
}
