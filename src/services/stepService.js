import apiClient from './apiClient';

const StepService = {
  // Marca um step como concluído
  completeStep: async (stepId) => {
    const { data } = await apiClient.post(`/steps/${stepId}/complete/`);
    return data;
  },

  // Envia respostas de um quiz do step
  submitStepAnswer: async (stepId, answers) => {
    const { data } = await apiClient.post(`/steps/${stepId}/answer/`, { answers });
    return data;
  },
};

export default StepService;
