import FeedCard from "@/components/FeedCard";
import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import { Tweet, User } from "@/gql/graphql";
import { useCurrentUser } from "@/hooks/user";
import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from 'next/router'
import { graphqlClient } from "@/clients/api";
import { getUserByIdQuery } from "@/graphql/query/user";

interface ServerProps {
    user?: User
}


const UserProfilePage: NextPage<ServerProps> = (props) => {

    const router = useRouter();
    const { id } = router.query;

    return(
        <div>
            <TwitterLayout>
                <div>
                    <nav className="flex gap-2 mt-2">
                        <div className="p-2 w-fit m-2 rounded-full hover:bg-neutral-800 text-2xl">
                        <FaArrowLeft />
                        </div>
                        <div>
                            <div className="text-xl font-bold ">{props.user?.firstName} {props.user?.lastName}</div> 
                            <div className="mt-1 text-neutral-600 text-sm">{props.user?.tweets?.length} Tweets</div>
                        </div>
                    </nav>
                    <div className=" m-4">
                        {props.user?.profileImageUrl && <Image 
                            src={props.user?.profileImageUrl}
                            alt="user-image"
                            className="rounded-full "
                            width={150}
                            height={150}
                        />}
                        <div className="text-xl border-t border-neutral-700 font-bold my-5 p-3">{props.user?.firstName}  {props.user?.lastName}</div>
                    </div>
                    <div>
                        {props.user?.tweets?.map(tweet => <FeedCard data={tweet as Tweet} key={tweet?.id}/>)}
                    </div>
                </div>
            </TwitterLayout>
        </div>
    )
}


export const getServerSideProps: GetServerSideProps<ServerProps> = async(context) => {
    const id = context.query.id as string | undefined;

    if(!id) return { notFound: true }

    const userInfo = await graphqlClient.request(getUserByIdQuery, { id })

    if(!userInfo.getUserById) return { notFound: true }
    return {
        notFound: false,
        props: {
            user: userInfo.getUserById as User
        }
    }
}

export default UserProfilePage;