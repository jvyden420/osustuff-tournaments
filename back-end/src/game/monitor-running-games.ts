import { IGame } from './../models/Game.model';
import { Game } from '../models/Game.model';
import { Round, IRound } from '../models/Round.model';
import { checkRoundScores } from './check-player-scores';
import { roundEnded } from './round-ended';
import winston from 'winston';
import { nextRound } from './next-round';
import { endGame } from './end-game';
import { createGame } from './create-game';
import { getUserRecent, getRecentBeatmaps } from '../services/osu-api';
import config from 'config';
import { addSampleScores } from '../test-helpers/add-sample-scores';
import { addSampleChatMessage } from '../test-helpers/add-chat-message';
import { DURATION_START } from './durations';

const TEST_MODE = config.get('TEST_MODE');
export let isMonitoring = false;

export async function startMonitoring() {
  console.log('starting monitoring');
  if (isMonitoring) {
    throw new Error('Already monitoring');
  }

  isMonitoring = true;

  await updateRunningGames(getRecentBeatmaps);
}

export function stopMonitoring() {
  console.log('stopping monitoring');
  isMonitoring = false;
}

// Update games based on status
export async function updateRunningGames(getRecentMaps: () => Promise<any>) {
  const games = await Game.find({
    status: ['new', 'in-progress', 'round-over'],
  });

  const testSkipCreate =
    TEST_MODE && games.filter(g => g.status !== 'new').length;

  if (games.filter(g => g.status === 'new').length === 0 && !testSkipCreate) {
    console.log('creating a new game as no "new" status ones are running');
    // If no games are active, create a new one
    await createGame(getRecentMaps);
  }

  if (TEST_MODE) {
    await Promise.all(games.map(async g => await addSampleChatMessage(g)));
  }

  await Promise.all(
    games.map(async game => {
      try {
        switch (game.status) {
          case 'new':
            return await startGame(game);
          case 'in-progress':
            return await checkRoundEnded(game);
          case 'round-over':
            return await completeRound(game);
        }
      } catch (e) {
        winston.log('error', 'Failed to update games', e);
      }
    }),
  );

  // Call self again
  setTimeout(async () => {
    if (isMonitoring) {
      await updateRunningGames(getRecentMaps);
    }
  }, 1000);
}

async function startGame(game: IGame) {
  const enoughPlayers = game.players.length > 1;
  if (!enoughPlayers) {
    if (game.nextStageStarts) {
      console.log('canceling countdown');
      // Cancel countdown
      game.nextStageStarts = undefined;
      await game.save();
    }

    return;
  }

  if (!game.nextStageStarts) {
    console.log('Beginning countdown....');
    // Set the countdown to start
    await setNextStageStartsAt(game, DURATION_START);
  } else if (game.nextStageStarts < new Date()) {
    // Start the first round
    await nextRound(game);
  }
}

async function checkRoundEnded(game: IGame) {
  const round = <IRound> await Round.findById(game.currentRound);

  // Check if next round should start
  if (<Date> game.nextStageStarts < new Date()) {
    if (TEST_MODE) {
      await addSampleScores(game);
    }
    await checkRoundScores(game, round, getUserRecent);
    await roundEnded(game, round);
  }
}

async function completeRound(game: IGame) {
  const alivePlayers = game.players.filter(p => p.alive);

  if (<Date> game.nextStageStarts < new Date()) {
    if (alivePlayers.length > 1) {
      console.log('players still alive, starting next round');
      // Start the next round
      await nextRound(game);
    } else {
      // End the game
      await endGame(game);
    }
  }
}

async function setNextStageStartsAt(game: IGame, seconds: number) {
  const date = new Date();
  date.setSeconds(date.getSeconds() + seconds);
  // Update game status and set time to next stage
  game.nextStageStarts = date;
  await game.save();
}
