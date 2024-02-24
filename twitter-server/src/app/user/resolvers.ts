import { db } from "../../lib/db";
import { GraphqlContext } from "../../interfaces";
import { User } from "@prisma/client";
import UserService from "../../services/user";



const queries = {
    verifyGoogleToken: async (parent: any, { token }: { token: string}) => {
        const resultToken = await UserService.verifyGoogleAuthToken(token);
        return resultToken;
    },

    getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
        const id = ctx.user?.id;
        if (!id) return null;

        const user = await UserService.getUserById(id);

        return user;
    },

    getUserById: async (parent: any, { id }: { id: string }, ctx: GraphqlContext) => UserService.getUserById(id)
}

const mutations = {
    followUser: async(parent: any, {to}: {to: string}, ctx: GraphqlContext) => {
        if(!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");

        await UserService.followUser(ctx.user.id, to);

        return true;
    },

    unfollowUser: async(parent: any, {to}: {to: string}, ctx: GraphqlContext) => {
        if(!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");

        await UserService.unfollowUser(ctx.user.id, to);
        
        return true;
    }
}

const extraResolvers = {
    User: {
        tweets: (parent: User) => db.tweet.findMany({
            where: {
                author: {
                    id: parent.id
                }
            }
        }),
        followers: async(parent: User) => {
            const result = await db.follows.findMany({
                where: {
                    following: {
                        id: parent.id
                    }
                },
                include: {
                    follower: true
                }
            })

            return result.map((e) => e.follower)
        },
        following: async(parent:User) => {
            const result = await db.follows.findMany({
                where: {
                    follower: {
                        id: parent.id 
                    }
                },
                include: {
                    following: true
                }
            })

            return result.map((e) => e.following)
        },
        recommendedUsers: async(parent: User, _: any, ctx: GraphqlContext) => {
            if(!ctx.user) return [];

            const myFollowing = await db.follows.findMany({
                where: {
                    follower: {
                        id: ctx.user.id
                    }
                },
                include: {
                    following: {
                        include: {
                            followers: {
                                include: {
                                    following: true
                                }
                            }
                        }
                    }
                }
            })

            const users: User[] = [];

            for(const followings of myFollowing) {
                for(const followingOfFollowedUser of followings.following.followers) {
                    users.push(followingOfFollowedUser.following)
                }
            }

            return users;
        }
    }
}

export const resolvers = { queries, extraResolvers, mutations };