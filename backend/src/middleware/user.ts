import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';  
import { TodoUser } from "../db";

export const JWT_SECRET="aopijkmkd2k3k4k5k6kaamlklkajksndafaf0k"
export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token required' });
            return;
        }
        const user = jwt.verify(token!, JWT_SECRET);

        if (!user) 
        {
            res.status(401).json({ message: 'Invalid token' });
            return
        }
        const { username } = user as { username: string };
        const userExists = await TodoUser.findOne({ username });
        
        if (!userExists) {
            res.status(403).json({error: "Unauthorized"});
            return
        }
        
        req.body.username = username;
        next();
    }
    catch(err)
    {
        res.status(500).json({ message: 'Error while authenticating' });
    }

}