import { IAchievement, Achievement } from '../models/Achievement.model';
import { getDataOrCache } from '../services/cache';
import winston = require('winston');

export async function getOrCreateAchievement(
  title: string,
  description: string,
  icon: string,
): Promise<IAchievement> {
  const achievement = await getDataOrCache(
    `achievement-${title}`,
    60000,
    async () => {
      try {
        const existing = await Achievement.findOne({ title });
        if (existing) {
          return existing;
        }
        return await Achievement.create({ title, description, icon });
      } catch (e) {
        winston.error('Failed to create/get achievement', e);
        return null;
      }
    },
  );

  if (!achievement) {
    throw new Error('Failed to get achievement');
  }

  if (achievement.description !== description) {
    achievement.description = description;
    await achievement.save();
  }

  if (achievement.icon !== icon) {
    await achievement.save();
  }

  return achievement;
}