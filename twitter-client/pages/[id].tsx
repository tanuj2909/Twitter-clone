import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import type { NextPage } from "next";
import { useParams } from "next/navigation";

const UserProfilePage: NextPage = () => {

    
    return(
        <div>
            <TwitterLayout>
                <div>
                    Profile Page
                </div>
            </TwitterLayout>
        </div>
    )
}

export default UserProfilePage;