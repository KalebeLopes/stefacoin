import { NextFunction, Request, Response,  } from 'express';

export default function(path: String, method: String) {
  return function(req: Request, res: Response, next: NextFunction) {
    if(path === `${req.path}` && method === `${req.method}` ) 
      return console.log('publica')
    
  }
}