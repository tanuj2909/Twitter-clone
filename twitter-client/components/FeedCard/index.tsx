import { Tweet } from "@/gql/graphql";
import Image from "next/image";
import Link from "next/link";
import { BiMessageRounded } from "react-icons/bi";
import { FaRetweet, FaRegHeart, FaRegBookmark } from "react-icons/fa6";
import { LuUpload } from "react-icons/lu";

interface FeedCardProps {
    data: Tweet
}

const FeedCard: React.FC<FeedCardProps> = (props) => {

    const {data} = props;

    return (
        <div className="border-t border-neutral-800 p-5 hover:bg-neutral-950 transition-all">
            <div className="grid grid-cols-12">
                <div className="col-span-1">
                    {data.author && data.author.profileImageUrl &&<Image 
                        src={data.author?.profileImageUrl} 
                        alt='user-image'
                        width={50}
                        height={50}
                        className="rounded-full"
                    />}
                </div>
                <div className="col-span-11 ml-2">
                    <Link href={`/${data.author?.id}`}>
                        <h5 className="font-semibold hover:underline">{data.author?.firstName} {data.author?.lastName}</h5>
                    </Link>
                    <p className=" text-neutral-400">{data.content}</p>
                    <div>
                        { data.imageURL && <a
                            href={data.imageURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative rounded-md mt-2 overflow-hidden flex items-center bg-secondary h-64 w-64"
                        >
                            <Image 
                                src={data.imageURL}
                                alt="image"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-sm"
                            /> 
                        </a>}
                        
                    </div>
                    
                    <div className="flex justify-evenly mt-5 text-xl text-neutral-700">
                        <div className="hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10 p-2 rounded-full">
                            <BiMessageRounded />
                        </div>
                        <div className="hover:text-[#2c8d5c] hover:bg-[#2c8d5c]/10 p-2 rounded-full">
                            <FaRetweet />
                        </div>
                        <div className="hover:text-[#b42dae] hover:bg-[#b42dae]/10 p-2 rounded-full">
                            <FaRegHeart />
                        </div>
                        <div className="hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10 p-2 rounded-full">
                            <FaRegBookmark />
                        </div>
                        <div className="hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10 p-2 rounded-full">
                            <LuUpload />
                        </div>
                    </div>
                </div>
                <div className="col-span-8"></div>
            </div>
        </div>
    )
}
 
export default FeedCard;