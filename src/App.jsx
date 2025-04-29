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
  const user = useSelector((state) => state.user.info);
  const dispatch = useDispatch();
  
  const navRoutes = routes.filter((r) => {
    if (!r.name) return false; // 🔥 1. Só rotas que têm name
  
    if (user) {
      return r.path !== "/sign-in" && r.path !== "/sign-up"; // 🔥 2. Se logado, oculta login/signup
    } else {
      return r.path !== "/profile"; // 🔥 3. Se não logado, oculta perfil
    }
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
        {routes.map(
          ({ path, element }, key) =>
            element && <Route key={key} path={path} element={element} />
        )}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default App;
