// src/routes/studentRoutes.js

import CourseContentPage from "@/pages/course/CourseContentPage";
import CourseDetailPage from "@/pages/course/CourseDetailPage";
import CoursesPage from "@/pages/course/courses";
import MyCoursesPage from "@/pages/course/myCourses";

export default [
  { path: '/courses', name: 'Cursos', element: <CoursesPage />, roles: ['student','both','teacher'] },
  { path: '/my-courses', name: 'Meus Cursos', element: <MyCoursesPage />, roles: ['student','both'] },
  { path: '/courses/:id', element: <CourseDetailPage />, roles: ['student','both'] },
  { path: '/courses/:id/content', element: <CourseContentPage />, roles: ['student','both'] },
];
