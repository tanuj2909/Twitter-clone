import { graphqlClient } from "@/clients/api";
import { User } from "@/gql/graphql";
import { getSignedUrlForTweetQuery } from "@/graphql/query/tweet";
import { useCreateTweet } from "@/hooks/tweets";
import { useCurrentUser } from "@/hooks/user";
import axios from "axios";
import Image from "next/image"
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { CiImageOn } from "react-icons/ci"


const TweetCard = () => {

    const { user } = useCurrentUser();

    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const { mutate } = useCreateTweet();

    const handleCreateTweet = useCallback(() => {
        if(content == "" && imageUrl == "" ) {
            toast.error("Can not post empty tweet!");
            return;
        }
        mutate({
            content,
            imageURL: imageUrl
        })

        setContent('');
        setImageUrl('');
        
    }, [content, mutate, imageUrl])

    const handleInputChangeFile =  useCallback((input: HTMLInputElement) => {
        return async (event: Event) => {
            event.preventDefault();
            const file: File | null | undefined = input.files?.item(0);
            if(!file) return;


            const {getSignedUrlForTweet} = await graphqlClient.request(getSignedUrlForTweetQuery, {
                imageName: file.name.split('.')[0],
                imageType: file.type.split('/')[1]
            })

            if(getSignedUrlForTweet) {
                toast.loading('Uploading...', { id: 'upload' });
                await axios.put(getSignedUrlForTweet, file, {
                    headers: {
                        'Content-Type': file.type
                    }
                })

                toast.success('Upload complete!', { id: 'upload' });

                const url = new URL(getSignedUrlForTweet);

                setImageUrl(`${url.origin}${url.pathname}`);
            }
        }
    }, [])


    const handleSelectImage = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');


        input.addEventListener('change', handleInputChangeFile(input))

        input.click();

    }, [handleInputChangeFile])


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
                    { imageUrl && <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md"
                    >
                        <Image
                            src={imageUrl}
                            alt="tweet-image"
                            width={300}
                            height={300}
                        />
                    </a>}
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