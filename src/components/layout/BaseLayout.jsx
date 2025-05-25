// src/components/layout/BaseLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function BaseLayout({ routes, user, onLogout }) {
  return (
    <div className="relative bg-black text-white overflow-hidden">
      {/* starfield fundo */}
      <div className="absolute inset-0 bg-repeat opacity-20" />

      {/* Navbar */}
      <div className="relative z-10">
        <Navbar routes={routes} user={user} onLogout={onLogout} />
        <div className="pt-20"> {/* offset para Navbar */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
