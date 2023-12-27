import * as express from 'express';
import passport from 'passport';

const authenticateJWT = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authorizationHeader = req.header('Authorization');
  if (authorizationHeader) {
    passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
        if (err) {
            next(err);
        }

        if (!user) {
            res.status(401).json({ error: 'Invalid Token' });
        } else {
            req.user = user;
            next();
        }
    })(req, res, next);
  } else {
    next();
    //res.status(401).json({ error: 'Invalid Token' });
  }
} 

export { authenticateJWT };
