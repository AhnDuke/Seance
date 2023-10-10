import join from 'socket.io'
import io from '../server.ts'
import express, { Express, Request, Response, NextFunction, RequestHandler } from 'express';

const socketController: object = {
  createRoom: (req: Request, res: Response, next: NextFunction) =>{
    try {
      const userId = req.body
      const roomName = userId['userId'].slice(16,20)
      next()
    } catch (error) {
      next();
    }
  },
}

export default socketController;