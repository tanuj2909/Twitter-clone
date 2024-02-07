import { User } from "@prisma/client";
import { db } from "../lib/db";
import * as jwt from 'jsonwebtoken';
class JWT {
    public static async generateTokenForUser(user: User) {

        const payload = {
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
}
export default JWT;