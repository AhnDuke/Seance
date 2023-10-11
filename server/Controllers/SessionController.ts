import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import sessionInfo from '../Models/database.js'

const saltRounds = 5;

const SessionController = {
  startSession: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const algorithm = { name: "AES-CBC", length: 64 };
      const exportable = true;
      const usage: KeyUsage[] = ["encrypt"];
      const rawKey = await window.crypto.subtle.generateKey(algorithm, exportable, usage)
      console.log(rawKey)
      const hashKey = bcrypt.hash(rawKey, saltRounds, async function(err, hash) {
        const sesh = new sessionInfo();
        sesh.userId = hash;
        await sesh.save();
      })
      res.locals.sessionId = hashKey;
      next();
    } catch (error) {
      next({errMsg: error});
    }

  }
}

export default SessionController;
