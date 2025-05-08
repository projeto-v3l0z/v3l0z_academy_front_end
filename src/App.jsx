// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-tailwind/react";
import AuthService from "@/services/authService";
import { clearUser } from "@/store/userSlice";
import { Navbar } from "@/widgets/layout";
import routes from "@/routes";

function App() {
  const { pathname } = useLocation();
  const user = useSelector((state) => state.user.info); // assume user.user_type existe
  const dispatch = useDispatch();

  console.log('user:', user)

  // Determina o role atual
  const role = user
    ? user.user_type // 'student' | 'teacher' | 'both'
    : "guest";

  const navRoutes = routes.filter((r) => {
    // só rotas com name
    if (!r.name) return false;

    // se `roles` não estiver declarado, considere visível a todos
    if (r.roles && !r.roles.includes(role)) return false;

    return true;
  });

  const handleLogout = () => {
    dispatch(clearUser());
    AuthService.logout();
  };

  const navAction = user ? (
    <div className="flex items-center gap-4">
      <span className="text-white">Olá, {user.name}</span>
      <Button variant="text" size="sm" onClick={handleLogout}>
        Sair
      </Button>
    </div>
  ) : (
    <Link to="/sign-in">
      <Button variant="gradient" size="sm">
        Entrar
      </Button>
    </Link>
  );

  return (
    <>
      {!["/sign-in", "/sign-up"].includes(pathname) && (
        <div className="container absolute left-2/4 z-10 mx-auto -translate-x-2/4 p-4">
          <Navbar routes={navRoutes} action={navAction} />
        </div>
      )}

      <Routes>
        {routes.map(({ path, element }, idx) =>
          element ? <Route key={idx} path={path} element={element} /> : null
        )}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default App;
