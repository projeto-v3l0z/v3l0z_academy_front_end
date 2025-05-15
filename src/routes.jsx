// src/routes.js
import { Home, Profile, SignIn, SignUp } from "@/pages";
import CoursesPage from "./pages/course/courses";
import MyCoursesPage from "./pages/course/myCourses";
import TeacherCoursesPage from "./pages/teacher/TeacherCoursesPage";
import TeacherCourseStepsPage from "./pages/teacher/TeacherCourseStepsPage";
import CourseDetailPage from "./pages/course/CourseDetailPage";
import CourseContentPage from "./pages/course/CourseContentPage";

export const routes = [
  { name: "Início",           path: "/home",     element: <Home /> },
  { name: "Meu Perfil",       path: "/profile",  element: <Profile />,      roles: ["student", "both", "teacher"] },
  { name: "Entrar",           path: "/sign-in",  element: <SignIn />,       roles: ["guest"] },
  { name: "Cadastrar-se",     path: "/sign-up",  element: <SignUp />,       roles: ["guest"] },
  { name: "Cursos",           path: "/courses",  element: <CoursesPage />,  roles: ["student", "both", "teacher"] },
  { name: "Meus Cursos",      path: "/myCourses",element: <MyCoursesPage />,roles: ["student", "both"] },
  { name: 'Área do Professor', path: '/teacher', element: <TeacherCoursesPage />, roles: ['teacher', 'both'] },
  { path: '/teacher/courses/:id/steps', element: <TeacherCourseStepsPage /> },
  { path: "/courses/:id/content", element: <CourseContentPage />, roles: ["student", "both"] },
  { path: "/courses/:id",      element: <CourseDetailPage /> },
  
];

export default routes;
