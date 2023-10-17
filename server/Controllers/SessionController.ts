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
      return next();
    } catch (error) {
      return next({errMsg: error});
    }
  },
  //check mongoDB for room creation availability for session
  verifyRoomAvail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.cookies.sessionId;
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
      console.log(req.body.stuff)
      console.log('ROOM CHECK')
      console.log('==================')
      console.log(res.locals.check)
      console.log('==================')
      return next();
    } catch (error) {
      return next({errMsg: error});
    }
  },
  //check if they have a socket already
  verifySocketAvail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.cookies.sessionId;
      const returnedTest = await sessionInfo.find({userId: sessionId})
      if(returnedTest.length>0){
        if(returnedTest[0].socketStatus === false){
          await sessionInfo.findOneAndUpdate({userId: sessionId}, {socketStatus: true})
          res.locals.check.socketStatus = true;
        }
        else{
          res.locals.check.socketStatus = false;
        }
      }
      console.log('SOCKET CHECK')
      console.log('==================')
      console.log(res.locals.check)
      console.log('==================')

      return next();
    } catch (error) {
      const sessionId = req.body.stuff.slice(10);
      await sessionInfo.findOneAndUpdate({userId: sessionId}, {roomStatus: false})
      return next({errMsg: error});
    }
  },
  //close session by deleting from mongodb
  closeSession: async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get sessionId from request body
      const sessionId = req.cookies.sessionId;
      if(sessionId === ''){
        return next();
      }
      console.log('Closing session: ' + sessionId);
      await sessionInfo.findOneAndDelete(sessionId)
      return next();
    } catch (error) {
      return next({errMsg: error})
    }
  },
  resetSocket: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.cookies.sessionId;
      await sessionInfo.findOneAndUpdate({userId: sessionId}, {socketStatus: false, roomStatus: false});
      return next()
    } catch (error) {
      return next({errMsg: error})
    }
  }
}

export default SessionController;
