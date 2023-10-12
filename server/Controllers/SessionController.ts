import bcrypt from 'bcrypt';
import { Request, Response, NextFunction, response } from 'express';
import sessionInfo from '../Models/database.js'

const saltRounds = 5;

const SessionController = {
  //create a new session and store in mongodb
  startSession: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawKey = await bcrypt.genSalt(saltRounds);
      const hash = bcrypt.hashSync(rawKey, 5);
      const newSession = new sessionInfo();
      newSession.userId = hash;
      newSession.save();
      res.locals.sessionId = hash;
      next();
    } catch (error) {
      next({errMsg: error});
    }
  },
  //check mongoDB for room creation availability for session
  verifyRoomAvail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.body.stuff.slice(10);
      console.log(sessionId);
      const returnedTest = await sessionInfo.find({userId: sessionId})
      if(returnedTest.length>0){
        if(returnedTest[0].roomStatus === false){
          res.locals.checkRoomAvail = true;
        }
        else{
          res.locals.checkRoomAvail = false;
        }
      }
      console.log(returnedTest);
      next();
    } catch (error) {
      next({errMsg: error});
    }
  },
  //close session by deleting from mongodb
  closeSession: async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get sessionId from request body
      const sessionId = req.body.stuff.slice(10);
      console.log('Closing session: ' + sessionId);
      await sessionInfo.findOneAndDelete(sessionId)
      .then((resp) => {
        console.log('deleted')
      });
      next();
    } catch (error) {
      next({errMsg: error})
    }
  }
}

export default SessionController;
