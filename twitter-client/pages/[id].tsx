import FeedCard from "@/components/FeedCard";
import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import { Tweet } from "@/gql/graphql";
import { useCurrentUser } from "@/hooks/user";
import type { NextPage } from "next";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";


const UserProfilePage: NextPage = () => {

    const {user} = useCurrentUser()
    
    return(
        <div>
            <TwitterLayout>
                <div>
                    <nav className="flex gap-2 mt-2">
                        <div className="p-2 w-fit m-2 rounded-full hover:bg-neutral-800 text-2xl">
                        <FaArrowLeft />
                        </div>
                        <div>
                            <div className="text-xl font-bold ">Tanuj</div> 
                            <div className="mt-1 text-neutral-600 text-sm">100 Tweets</div>
                        </div>
                    </nav>
                    <div className=" m-4">
                        {user?.profileImageUrl && <Image 
                            src={user?.profileImageUrl}
                            alt="user-image"
                            className="rounded-full "
                            width={150}
                            height={150}
                        />}
                        <div className="text-xl border-t border-neutral-700 font-bold my-5 p-3">Tanuj</div>
                    </div>
                    <div>
                        {user?.tweets?.map(tweet => <FeedCard data={tweet as Tweet} key={tweet?.id}/>)}
                    </div>
                </div>
            </TwitterLayout>
        </div>
    )
}

export default UserProfilePage;