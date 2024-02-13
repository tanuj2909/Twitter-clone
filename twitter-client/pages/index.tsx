import { FaXTwitter } from "react-icons/fa6";
import { Inter } from "next/font/google";
import { GoHomeFill, GoBell, GoPerson } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { SlEnvolope } from "react-icons/sl";
import { FaRegBookmark, FaPlus } from "react-icons/fa6";
import FeedCard from "@/components/FeedCard";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { graphqlClient } from "@/clients/api";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import TweetCard from "@/components/TweetCard";

const inter = Inter({ subsets: ["latin"] });

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
}

const SidebarMenuItems: TwitterSidebarButton[] = [
  {
    title: 'Home',
    icon: <GoHomeFill />
  },
  {
    title: 'Search',
    icon: <IoSearch />
  },
  {
    title: 'Notification',
    icon: <GoBell />
  },
  {
    title: 'Message',
    icon: <SlEnvolope />
  },
  {
    title: 'Bookmarks',
    icon: <FaRegBookmark />
  },
  {
    title: 'Profile',
    icon: <GoPerson />
  }
]

export default function Home() {

  const {user} = useCurrentUser();

  const queryClient = useQueryClient();

  const handelLoginWithGoogle = useCallback(async (cred: CredentialResponse) => {
      const googleToken = cred.credential

      if(!googleToken) return toast.error('Google token not found!');
      const {verifyGoogleToken} = await graphqlClient.request(verifyUserGoogleTokenQuery, { token: googleToken})

      toast.success('Verified Successfully!');
      
      if(verifyGoogleToken) window.localStorage.setItem('twt_token', verifyGoogleToken)

      await queryClient.invalidateQueries({ queryKey: ['current-user'] })
  },[])

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-56">
        <div className="col-span-3 pt-8 relative">
          <div className="h-fit w-fit hover:bg-gray-800 rounded-full p-2 flex justify-center items-center cursor-pointer transition-all">
            <FaXTwitter className="h-10 w-10"/>
          </div>
          <div className="mt-4 text-2xl">
            <ul>
              {SidebarMenuItems.map(item => <li key={item.title} className="flex justify-start items-center gap-6 hover:bg-gray-800 rounded-full p-4 w-fit cursor-pointer">
                <span className="text-4xl">{item.icon}</span>
                <span className="hidden 2xl:block">{item.title}</span>
              </li>)}
            </ul>
            <button className="bg-[#1d9bf0] rounded-full mt-8 py-4">
              <span className=" px-24 hidden 2xl:inline">Post</span>
              <span className="text-4xl rounded-full px-6 2xl:hidden">+</span>
            </button>
          </div>
          {user && user.profileImageUrl && <div className=" flex absolute bottom-14 gap-2 items-center bg-neutral-800 hover:bg-neutral-700 py-2 pr-10 pl-2 rounded-full">
            <Image 
              src={user.profileImageUrl} 
              alt='user-image' 
              width={50} 
              height={50}
              className="rounded-full "
            />
            <div className="text-xl">{user.firstName} {user?.lastName}</div>
          </div>}
        </div>
        <div className="col-span-6 border-x-2 border-neutral-800 h-screen overflow-auto scrollbar-style">
          {user && <TweetCard user={user}/>}
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
        <div className="col-span-3">
          {!user && <div className="m-5 p-5 bg-neutral-800 rounded-lg">
            <div className="text-center m-2 text-lg text-neutral-200">Login / Register</div>
            <div className=" flex justify-center">
              <GoogleLogin onSuccess={handelLoginWithGoogle}/>
            </div>
          </div>}
        </div>
      </div>
    </div>
  )
}
