import { User } from "@prisma/client";
import { db } from "../lib/db";
import * as jwt from 'jsonwebtoken';
import { JWTUser } from "../interfaces";
class JWTService {
    public static generateTokenForUser(user: User) {

        const payload: JWTUser = {
            id: user?.id, 
            email: user?.email
        }

        if (process.env.JWT_SECRET) {
            const token = jwt.sign(payload, process.env.JWT_SECRET);
            return token;
        } else {
            console.error('Error: JWT_SECRET is not defined in the environment variables.');
        }
    }

    public static decodeToken(token: string) {
        try{
            if (process.env.JWT_SECRET) {
                return jwt.verify(token, process.env.JWT_SECRET) as JWTUser;
            } else {
                console.error('Error: JWT_SECRET is not defined in the environment variables.');
            }
        } catch(error) {
            return null;
        }
        
    }
}
export default JWTService;