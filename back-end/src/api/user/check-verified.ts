import { Request, Response } from 'express';
import { JoinGameRequest } from '../../models/JoinGameRequest.model';

export async function checkVerified(req: Request, res: Response) {
  const { requestId } = req.body;

  const verifyRequest = await JoinGameRequest.findById(requestId);

  if (!verifyRequest) {
    return res.status(404).end();
  }

  if (verifyRequest.verified) {
    return res.json({ verified: true });
  }

  return res.json({ verified: false });
}
