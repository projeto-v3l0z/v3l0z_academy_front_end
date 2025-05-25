// src/routes/publicRoutes.js

import { Home, SignIn, SignUp } from "@/pages";


export default [
  { path: '/home', name: 'Início', element: <Home /> },
  { path: '/sign-in', name: 'Entrar', element: <SignIn />, roles: ['guest'] },
  { path: '/sign-up', name: 'Cadastrar-se', element: <SignUp />, roles: ['guest'] },
];
