import JWTService from "./jwt";
import axios from "axios";
import { db } from "../lib/db";

interface GoogleTokenResponse {
    iss?: string;
    nbf?: string;
    aud?: string;
    sub?: string;
    email: string;
    email_verified: string;
    azp?: string;
    name?: string;
    picture?: string;
    given_name: string;
    family_name?: string;
    iat?: string;
    exp?: string;
    jti?: string;
    alg?: string;
    kid?: string;
    typ?: string;
}

class UserService {
    public static async verifyGoogleAuthToken(token: string) {
        const googleToken = token;
        const googleOauthURL = new URL('https://oauth2.googleapis.com/tokeninfo')
        googleOauthURL.searchParams.set('id_token', googleToken);

        const {data} = await axios.get<GoogleTokenResponse>(googleOauthURL.toString(), {
            responseType: 'json'
        })

        const existingUser = await db.user.findUnique({
            where: {
                email: data.email
            }
        })

        if(!existingUser) {
            await db.user.create({
                data: {
                    firstName: data.given_name,
                    email: data.email,
                    lastName: data.family_name,
                    profileImageUrl: data.picture,
                }
            })
        }

        const user = await db.user.findUnique({
            where: {
                email: data.email
            }
        })

        if(!user) throw new Error('User not found');
        

        const userToken = await JWTService.generateTokenForUser(user);

        return userToken;
    }

    public static async getUserById (id: string) {
        return db.user.findUnique({
            where: {
                id
            }
        })
    }

    public static async followUser(from: string, to: string) {
        const existingUser =  await db.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: from,
                    followingId: to
                }
            }
        })

        if(existingUser) return { "data": { "followUser": true }}
        return db.follows.create({
            data: {
                follower: { 
                    connect: {
                        id: from
                    }
                },
                following: {
                    connect: {
                        id: to
                    }
                }
            }
        })
    }

    public static async unfollowUser(from: string, to: string) {
        const existingUser =  await db.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: from,
                    followingId: to
                }
            }
        })

        if(!existingUser)  return { "data": { "unfollowUser": true }}

        return db.follows.delete({
            where: {
                followerId_followingId: {
                    followerId: from,
                    followingId: to
                }
            }
        })
    }
}

export default UserService;