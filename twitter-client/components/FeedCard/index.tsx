import Image from "next/image";
import { BiMessageRounded } from "react-icons/bi";
import { FaRetweet, FaRegHeart, FaRegBookmark } from "react-icons/fa6";
import { LuUpload } from "react-icons/lu";
const FeedCard = () => {
    return (
        <div className="border-t border-gray-800 p-5 hover:bg-neutral-950 transition-all">
            <div className="grid grid-cols-12">
                <div className="col-span-1">
                    <Image 
                        src={'https://avatars.githubusercontent.com/u/107452346?s=400&u=35ac6724a673a8965e095872ee96423f53ca57be&v=4'} 
                        alt='user-image'
                        width={50}
                        height={50}
                        className="rounded-full"
                    />
                </div>
                <div className="col-span-11">
                    <h5>Tanuj</h5>
                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum, praesentium adipisci voluptatibus libero minima numquam laboriosam dolor tempore, veritatis deleniti, sint illum aspernatur quam ipsa maiores! Similique iste obcaecati adipisci.
                    </p>
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