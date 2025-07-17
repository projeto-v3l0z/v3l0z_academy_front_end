import apiClient from './apiClient';

const CourseService = {
  // Lista todos os cursos
  listCourses: async () => {
    const { data } = await apiClient.get('/api/courses/');
    return data;
  },

  find: async (courseId) => {
    const { data } = await apiClient.get(`/api/courses/${courseId}/`);
    return data;
  },

  // Pega detalhes e steps de um curso
  getCourseSteps: async (courseId) => {
    const { data } = await apiClient.get(`/api/courses/${courseId}/steps/`);
    return data;
  },

    // novo:
  getCompletedSteps: async (courseId) => {
    const { data } = await apiClient.get(`/api/courses/${courseId}/completed-steps/`);
    return data;
  },

  // Lista cursos que o usuário está inscrito, com % de progresso
  getMyCourses: async () => {
    const { data } = await apiClient.get('/api/courses/my-courses/');
    return data;
  },

  enrollInCourse: async (courseId) => {
    const { data } = await apiClient.post('/api/courses/enroll/', { course_id: courseId });
    return data;
  },

  getCourseProgress: async (courseId) => {
    const { data } = await apiClient.get(`/api/courses/${courseId}/progress/`);
    return data;
  },

};

export default CourseService;
