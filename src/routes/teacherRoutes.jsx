// src/routes/teacherRoutes.js

import TeacherCoursesPage from "@/pages/teacher/TeacherCoursesPage";
import TeacherCourseStepsPage from "@/pages/teacher/TeacherCourseStepsPage";

export default [
  { path: '/teacher', name: 'Área do Professor', element: <TeacherCoursesPage />, roles: ['teacher','both'] },
  { path: '/teacher/courses/:id/steps', element: <TeacherCourseStepsPage />, roles: ['teacher','both'] },
];
