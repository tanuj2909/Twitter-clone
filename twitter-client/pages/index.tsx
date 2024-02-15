import { useCurrentUser } from "@/hooks/user";
import { useGetAllTweets } from "@/hooks/tweets";
import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import TweetCard from "@/components/TweetCard";
import FeedCard from "@/components/FeedCard";
import { Tweet } from "@/gql/graphql";

export default function Home() {

  const {user} = useCurrentUser();

  const {tweets = []} = useGetAllTweets();

  return (
    <div>
      <TwitterLayout>
        {user && <TweetCard user={user}/>}
        {
          tweets?.map(tweet => tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet}/> : null)
        }
      </TwitterLayout>
    </div>
  )
}
