import { Request, Response } from 'express';
import { Game } from '../../models/Game.model';
import { JoinGameRequest } from '../../models/JoinGameRequest.model';

export async function leaveGame(req: Request, res: Response) {
  const { requestId } = req.body;

  const verifyRequest = await JoinGameRequest.findById(requestId);

  if (!verifyRequest) {
    return res.status(404).end();
  }

  if (!verifyRequest.verified) {
    return res.status(200).end();
  }

  const game = await Game.findById(req.params.id);

  if (!game) {
    return res.status(404).end();
  }

  if (game.status === 'new') {
    game.players = game.players.filter(p => p.username !== verifyRequest.username);
    await game.save();
  } else {
    const player = game.players.find(p => p.username === verifyRequest.username);

    if (player) {
      player.alive = false;

      await game.save();
    }
  }

  if (verifyRequest.verified) {
    await JoinGameRequest.deleteOne({ _id: verifyRequest.id });
  }

  res.status(200).end();
}
