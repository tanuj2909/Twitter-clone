import { Payload } from "@prisma/client/runtime/library"
import { db } from "../lib/db"

interface CreateTweetPayload {
    content: string
    imageURL?: string
    userId: string
}

class TweetService {
    public static async createTweet({
        content,
        imageURL,
        userId
    }: CreateTweetPayload) {
        return db.tweet.create({
            data: {
                content,
                imageURL,
                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
    }

    public static getAllTweets() {
        return db.tweet.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
    }
}

export default TweetService;