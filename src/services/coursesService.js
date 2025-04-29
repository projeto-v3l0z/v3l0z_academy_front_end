import apiClient from './apiClient';

const CourseService = {
  // Lista todos os cursos
  listCourses: async () => {
    const { data } = await apiClient.get('/courses/courses/');
    return data;
  },

  // Pega detalhes e steps de um curso
  getCourseSteps: async (courseId) => {
    const { data } = await apiClient.get(`/courses/courses/${courseId}/steps/`);
    return data;
  },

  // Lista cursos que o usuário está inscrito, com % de progresso
  getMyCourses: async () => {
    const { data } = await apiClient.get('/courses/courses/my-courses/');
    return data;
  },
};

export default CourseService;
