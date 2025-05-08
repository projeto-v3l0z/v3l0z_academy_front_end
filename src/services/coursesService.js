import apiClient from './apiClient';

const CourseService = {
  // Lista todos os cursos
  listCourses: async () => {
    const { data } = await apiClient.get('/courses/');
    return data;
  },

  // Pega detalhes e steps de um curso
  getCourseSteps: async (courseId) => {
    const { data } = await apiClient.get(`/courses/${courseId}/steps/`);
    return data;
  },

    // novo:
  getCompletedSteps: async (courseId) => {
    const { data } = await apiClient.get(`/courses/${courseId}/completed-steps/`);
    return data;
  },

  // Lista cursos que o usuário está inscrito, com % de progresso
  getMyCourses: async () => {
    const { data } = await apiClient.get('/courses/my-courses/');
    return data;
  },

  enrollInCourse: async (courseId) => {
    const { data } = await apiClient.post('/courses/enroll/', { course_id: courseId });
    return data;
  },

};

export default CourseService;
