import apiClient from './apiClient';

const StepService = {
  submitStepAnswer: async (stepId, answers) => {
    const { data } = await apiClient.post(`/steps/${stepId}/answer/`, { answers });
    return data;
  },
  completeStep: async (stepId) => {
    const { data } = await apiClient.post('/courses/courses/complete-step/', { step_id: stepId });
    return data;
  },

};

export default StepService;
