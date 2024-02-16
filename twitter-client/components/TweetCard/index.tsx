import { User } from "@/gql/graphql";
import { useCreateTweet } from "@/hooks/tweets";
import Image from "next/image"
import { useCallback, useState } from "react";
import { CiImageOn } from "react-icons/ci"


const TweetCard = ({ user }: { user: User}) => {

    const [content, setContent] = useState('');

    const { mutate } = useCreateTweet();

    const handleCreateTweet = useCallback(() => {
        mutate({
            content,
        })
        
    }, [content, mutate])

    

    const handleSelectImage = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
    }, [])


    return(
        <div>
            <div className="border-t border-neutral-800 p-5 hover:bg-neutral-950 transition-all">
                <div className="grid grid-cols-12">
                <div className="col-span-1">
                    {user && user.profileImageUrl && <Image 
                    src={user?.profileImageUrl} 
                    alt='user-image'
                    width={50}
                    height={50}
                    className="rounded-full"
                    />}
                </div>
                <div className="col-span-11">
                    <textarea 
                        className="w-full border-b bg-transparent text-xl p-4 border-b-neutral-700 focus:outline-none" 
                        rows={2} 
                        placeholder="What is happening?!"
                        value={content}
                        onChange={e => setContent(e.target.value )} 
                    />
                    <div className="flex justify-between">
                        <div className="text-2xl p-2 text-[#1d9bf0] hover:bg-[#1d9bf0]/10  w-fit rounded-full mt-2">
                        <CiImageOn  onClick={handleSelectImage}/>
                        </div>
                        <div>
                            <button 
                                className="bg-[#1d9bf0] rounded-full mt-2 px-4 py-2 text-xl"
                                onClick={handleCreateTweet} 
                            >Post</button>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default TweetCard;