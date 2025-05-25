// src/services/gamificationService.js
import api from './apiClient';

export function fetchXpTransactions() {
  return api.get('/game/xp-transactions/');
}
export function fetchLevels() {
  return api.get('/game/levels/');
}
export function fetchStreak() {
  return api.get('/game/streak/');
}
export function fetchCoins() {
  return api.get('/game/coins/');
}
export function fetchStamps() {
  return api.get('/game/stamps/');
}
export function fetchBadges() {
  return api.get('/game/user-badges/');
}
