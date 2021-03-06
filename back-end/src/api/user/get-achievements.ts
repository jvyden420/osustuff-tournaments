import { User } from '../../models/User.model';
import { Request, Response } from 'express';
import { getAchievement } from '../../achievements/get-achievement';
import { cache } from '../../services/cache';
import { addOnlineUser } from '../../helpers/add-online-user';

export async function getUnreadAchievements(req: Request, res: Response) {
  const { username }: any = (<any> req).claim || {};

  if (!username) {
    return res.status(401).end();
  }

  const user = await User.findOne({ username }).select({ achievements: 1 });

  if (!user) {
    return res.status(404).end();
  }

  // Store that user is active (this is pinged regularly by logged-in users)
  addOnlineUser(user);
  cache.put(`user-active-${user._id}`, true, 60000);

  const firstUnread = user.achievements.find(a => a.progress >= 1 && !a.read);
  const achievement = firstUnread ? await getAchievement(firstUnread.achievementId) : null;

  if (firstUnread) {
    firstUnread.read = true;
    await user.save();
  }

  res.json(achievement);
}
