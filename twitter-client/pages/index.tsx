import { useCurrentUser } from "@/hooks/user";
import { useGetAllTweets } from "@/hooks/tweets";
import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import TweetCard from "@/components/TweetCard";
import FeedCard from "@/components/FeedCard";
import { Tweet } from "@/gql/graphql";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/clients/api";
import { getAllTweetsQuery } from "@/graphql/query/tweet";

interface HomeProps {
  tweets?: Tweet[]
} 

export default function Home(props: HomeProps) {

  const {user} = useCurrentUser();


  return (
    <div>
      <TwitterLayout>
        {user && <TweetCard />}
        {
          props.tweets?.map(tweet => tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet}/> : null)
        }
      </TwitterLayout>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async(context) => {
  const tweets = await graphqlClient.request(getAllTweetsQuery);

  return {
    props: {
      tweets: tweets.getAllTweets as Tweet[]
    }
  }
}
