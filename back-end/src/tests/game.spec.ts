import { IGame } from './../models/Game.model';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import { Game } from '../models/Game.model';
import { createGame } from '../game/create-game';
import { nextRound } from '../game/next-round';
import { Round, IRound } from '../models/Round.model';
import { updateRunningGames } from '../game/monitor-running-games';
import sinon from 'sinon';
import { Score } from '../models/Score.model';
import { User } from '../models/User.model';
import { connectToMongo, disconnectFromMongo } from '../helpers/connect-to-mongo';
const recentBeatmaps = require('./sample-beatmaps.json');

const expect = chai.expect;
chai.use(sinonChai);

describe('game', () => {
  const getRecentBeatmaps = async () => recentBeatmaps;
  before(async () => {
    await connectToMongo();
  });
  beforeEach(async () => {
    await Game.deleteMany({});
    await Score.deleteMany({});
    await User.deleteMany({});
    await Round.deleteMany({});
  });
  after(async () => {
    await disconnectFromMongo();
  });
  it('creates a game', async () => {
    const game = await createGame(getRecentBeatmaps);

    const found = <IGame> await Game.findById(game._id);

    expect(found)
      .to.have.property('status')
      .equal('new');
  });
  it('goes to next round', async () => {
    const game = await createGame(getRecentBeatmaps);

    await nextRound(game);

    const gameFromDb = <IGame> await Game.findById(game._id);

    expect(gameFromDb).to.have.property('currentRound');

    const round = <IRound> await Round.findById(gameFromDb.currentRound);

    expect(round)
      .to.have.property('beatmap');

    await nextRound(game);

    const updatedGame = <IGame> await Game.findById(game._id);

    expect(updatedGame).to.have.property('currentRound');

    const round2 = <IRound> await Round.findById(updatedGame.currentRound);

    expect(round2)
      .to.have.property('beatmap');

    expect(updatedGame.roundNumber).to.equal(2);
  });
  it.skip('auto progresses', async () => {
    const clock = sinon.useFakeTimers();
    const game = await createGame(getRecentBeatmaps);
    await nextRound(game);

    const { beatmap }: any = await Round.findOne({ gameId: game._id });
    const timeToWait = parseFloat(beatmap.total_length) + 60;

    clock.tick(timeToWait + 1000);

    await updateRunningGames(getRecentBeatmaps);

    const updated = <IGame> await Game.findById(game._id);

    expect(updated.roundNumber).to.equal(1);
    expect(updated.status).to.equal('round-over');
    expect(updated.nextStageStarts).to.exist; // tslint:disable-line:no-unused-expression

    clock.tick(10001);

    await updateRunningGames(getRecentBeatmaps);

    const updated2 = <IGame> await Game.findById(game._id);

    expect(updated2.status).to.equal('complete');
    expect(updated2.winningUser).to.equal(undefined);

    clock.restore();
  });
});
