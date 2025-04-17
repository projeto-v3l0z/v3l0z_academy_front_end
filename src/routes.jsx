// src/routes.js
import { Home, Profile, SignIn, SignUp } from "@/pages";
import CoursesPage from "./pages/courses";

export const routes = [
  { name: "Início",      path: "/home",     element: <Home />    },
  { name: "Meu Perfil",  path: "/profile",  element: <Profile /> },
  { name: "Entrar",      path: "/sign-in",  element: <SignIn />  },
  { name: "Cadastrar-se",path: "/sign-up",  element: <SignUp />  },
  { name: "Cursos",path:'/courses',element: <CoursesPage />},
];

export default routes;
