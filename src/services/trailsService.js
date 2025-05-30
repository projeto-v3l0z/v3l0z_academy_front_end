// src/services/trailsService.js
import apiClient from './apiClient';

const TrailsService = {
  list: () =>
    apiClient
      .get('/api/trails/')
      .then(res => res.data),

  get: id =>
    apiClient.get(`/api/trails/${id}/`).then(res => res.data),

  start: id =>
    apiClient.post('/api/my-trails/', { trail: id }).then(res => res.data),

  progress: trailId =>
    apiClient
      .get('/api/my-trails/', { params: { trail: trailId } })
      .then(res => res.data[0] || null),
};

export default TrailsService;
