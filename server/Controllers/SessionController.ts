import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
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
      const returnedTest = await sessionInfo.find({userId: sessionId})
      if(returnedTest.length>0){
        if(returnedTest[0].roomStatus === false){
          await sessionInfo.findOneAndUpdate({userId: sessionId}, {roomStatus: true})
          res.locals.check = {roomAvailable: true}
        }
        else{
          res.locals.check = {roomAvailable: false}
        }
      }
      next();
    } catch (error) {
      next({errMsg: error});
    }
  },
  //check if they have a socket already
  verifySocketAvail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.body.stuff.slice(10);
      const returnedTest = await sessionInfo.find({userId: sessionId})
      console.log(returnedTest)
      if(returnedTest.length>0){
        console.log('this one '+ returnedTest[0].socketStatus)
        if(returnedTest[0].socketStatus === false){
          await sessionInfo.findOneAndUpdate({userId: sessionId}, {socketStatus: true})
          res.locals.check.socketStatus = true;
        }
        else{
          res.locals.check.socketStatus = false;
        }
      }
      next();
    } catch (error) {
      const sessionId = req.body.stuff.slice(10);
      await sessionInfo.findOneAndUpdate({userId: sessionId}, {roomStatus: false})
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
