import apiClient from './apiClient';

const TeacherCourseService = {
  getMyCourses: async () => {
    const { data } = await apiClient.get('/teacher/courses/');
    return data;
  },
  getSteps: async (courseId) => {
    // busca etapas existentes do curso
    const { data } = await apiClient.get(
      `/courses/${courseId}/steps/`
    );
    return data;
  },
  createCourse: async (formData) => {
    const { data } = await apiClient.post(
      '/teacher/courses/',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  },
  createStep: async (courseId, stepData) => {
    const { data } = await apiClient.post(
      `/teacher/courses/${courseId}/steps/`,
      stepData
    );
    return data;
  },
  updateStep: async (stepId, stepData) => {
    const { data } = await apiClient.put(
      `/teacher/steps/${stepId}/`,
      stepData
    );
    return data;
  },
};

export default TeacherCourseService;
