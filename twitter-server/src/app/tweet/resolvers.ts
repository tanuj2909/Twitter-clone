import { Tweet } from "@prisma/client";
import { GraphqlContext } from "../../interfaces";
import { db } from "../../lib/db";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


interface CreateTweetPayload {
    content: string
    imageURL?: string
}

const s3Client = new S3Client({ 
    region: "ap-south-1",
    credentials: {
    accessKeyId: process.env.S3_ACCESS as string,
    secretAccessKey: process.env.S3_SECRET as string,
}}); 

const mutations = {
    createTweet: async (parent: any, {payload}:{payload: CreateTweetPayload}, ctx: GraphqlContext ) => {
        if(!ctx.user) throw new Error("You are not authenticated!")
        const tweet = await db.tweet.create({
            data: {
                content: payload.content,
                imageURL: payload.imageURL,
                author: { connect: { id: ctx.user.id } },
            }
        }); 

        return tweet;
    }
}

const queries = {
    getAllTweets: async () => await db.tweet.findMany({ orderBy: { createdAt: 'desc' }}),

    getSignedUrlForTweet: async (parent: any, { imageType, imageName } : {imageType: string, imageName: string}, ctx: GraphqlContext) => {
        if(!ctx.user || !ctx.user.id) throw new Error("Authentication Required!");

        const allowedImageTypes = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

        if(!allowedImageTypes.includes(imageType)) throw new Error("Unsupported Image Type!");

        const putObjectCommand = new PutObjectCommand({
            Bucket: 'tanuj-twitter-dev',
            Key: `uploads/${ctx.user.id}/tweets/${imageName}-${Date.now().toString()}.${imageType}`,
        });

        const signedUrl = await getSignedUrl(s3Client, putObjectCommand);

        return signedUrl;
    }
}

const extraResolvers = {
    Tweet: {
        author: (parent: Tweet) => db.user.findUnique({
            where: {
                id: parent.authorId
            }
        })
    }
}

export const resolvers = { mutations, extraResolvers, queries }