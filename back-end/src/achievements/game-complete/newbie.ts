import { IUserAchievement } from './../../models/User.model';
import { User } from '../../models/User.model';
import { IUser } from '../../models/User.model';
import { getOrCreateAchievement } from '../get-or-create-achievement';

export async function achievementNewbie(allGameUsers: IUser[]) {
  const achievement1 = await getOrCreateAchievement(
    'Newbie',
    'Complete your first match',
    'yellow child',
  );
  const achievement2 = await getOrCreateAchievement(
    'Prodigy',
    'Win your first ever match',
    'pink child',
  );

  await Promise.all(
    allGameUsers
      .filter(u => u.gamesPlayed === 1)
      .map(async user => {
        const achievement = user.wins === 0 ? achievement1 : achievement2;
        if (
          !user.achievements.some(
            a => a.achievementId.toString() === achievement._id.toString(),
          )
        ) {
          const newAchievement: IUserAchievement = {
            achievementId: achievement._id,
            progress: 1,
          };
          await User.updateOne(
            { _id: user._id },
            { $addToSet: { achievements: newAchievement } },
          );
        }
      }),
  );
}
