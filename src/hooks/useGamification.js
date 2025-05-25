// src/hooks/useGamification.js
import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient';

export default function useGamification() {
  const [data, setData] = useState({
    xp: 0,
    nextLevelXp: 0,
    level: null,
    streak: 0,
    coins: 0,
    stamps: [],
    badges: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGamification() {
      try {
        setLoading(true);
        // 1) XP
        const xpRes = await apiClient.get('/api/xp-transactions/');
        const xpList = Array.isArray(xpRes.data)
          ? xpRes.data
          : xpRes.data.results || [];
        const totalXp = xpList.reduce((sum, tx) => sum + (tx.points || 0), 0);

        // 2) Níveis
        const levelsRes = await apiClient.get('/api/levels/');
        const levels = levelsRes.data.results || levelsRes.data;
        const currentLevel =
          levels.slice().reverse().find(l => totalXp >= l.xp_threshold) ||
          levels[0] || { number: 1, xp_threshold: 0 };
        const nextLevel = levels.find(l => l.number === currentLevel.number + 1);
        const nextLevelXp = nextLevel
          ? nextLevel.xp_threshold
          : currentLevel.xp_threshold;

        // 3) Streak
        const streakRes = await apiClient.get('/api/streak/');
        const streakData = streakRes.data.results || streakRes.data;
        const streak = streakData[0]?.current_streak || 0;

        // 4) Coins
        const coinsRes = await apiClient.get('/api/coins/');
        const coinsList = Array.isArray(coinsRes.data)
          ? coinsRes.data
          : coinsRes.data.results || [];
        const totalCoins = coinsList.reduce((sum, tx) => sum + (tx.amount || 0), 0);

        // 5) Stamps
        const stampsRes = await apiClient.get('/api/stamps/');
        const stamps = stampsRes.data.results || stampsRes.data;

        // 6) Badges
        const badgesRes = await apiClient.get('/api/user-badges/');
        const userBadges = badgesRes.data.results || badgesRes.data;
        const badges = userBadges.map(ub => ub.badge);

        setData({
          xp: totalXp,
          nextLevelXp,
          level: currentLevel,
          streak,
          coins: totalCoins,
          stamps,
          badges,
        });
      } catch (err) {
        console.error('Erro em useGamification:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchGamification();
  }, []);

  return { data, loading, error };
}
