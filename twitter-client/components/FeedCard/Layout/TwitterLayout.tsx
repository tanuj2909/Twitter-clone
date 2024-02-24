import { GoHomeFill, GoBell, GoPerson } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { SlEnvolope } from "react-icons/sl";
import { FaRegBookmark, FaPlus } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import toast from "react-hot-toast";
import { useCurrentUser } from "@/hooks/user";
import Link from "next/link";

interface TwitterLayoutProps {
    children: React.ReactNode
}

interface TwitterSidebarButton {
    title: string;
    icon: React.ReactNode;
    link: string;
}


const TwitterLayout:React.FC<TwitterLayoutProps> = ( props ) => {

    const queryClient = useQueryClient();

    const {user} = useCurrentUser();

    const SidebarMenuItems: TwitterSidebarButton[] = useMemo(() => [
        {
          title: 'Home',
          icon: <GoHomeFill />,
          link: "/"
        },
        {
          title: 'Search',
          icon: <IoSearch />,
          link: "/"
        },
        {
          title: 'Notification',
          icon: <GoBell />,
          link: "/"
        },
        {
          title: 'Message',
          icon: <SlEnvolope />,
          link: "/"
        },
        {
          title: 'Bookmarks',
          icon: <FaRegBookmark />,
          link: "/"
        },
        {
          title: 'Profile',
          icon: <GoPerson />,
          link: `/${user?.id}`
        }
    ], [user?.id])
    

   

    const handelLoginWithGoogle = useCallback(async (cred: CredentialResponse) => {
        const googleToken = cred.credential
  
        if(!googleToken) return toast.error('Google token not found!');
        const {verifyGoogleToken} = await graphqlClient.request(verifyUserGoogleTokenQuery, { token: googleToken})
  
        toast.success('Verified Successfully!');
        
        if(verifyGoogleToken) window.localStorage.setItem('twt_token', verifyGoogleToken)
  
        await queryClient.invalidateQueries({ queryKey: ['current-user'] })
    },[queryClient])

    return(
    <div>
        <div className="grid grid-cols-12 h-screen w-screen sm:px-26">
            <div className="col-span-3 pt-8 flex justify-end relative">
                    <div>
                        <div className="h-fit w-fit hover:bg-neutral-800 rounded-full p-2 flex justify-center items-center cursor-pointer transition-all">
                            <FaXTwitter className="h-10 w-10"/>
                        </div>
                        <div className="mt-4 text-2xl">
                            <ul>
                                {SidebarMenuItems.map(item => (
                                    <li 
                                        key={item.title}
                                    >   
                                        <Link 
                                            href={item.link}
                                            className="flex justify-start items-center gap-6 hover:bg-neutral-800 rounded-full p-4 w-fit cursor-pointer"
                                        >
                                            <span className="text-4xl">{item.icon}</span>
                                            <span className="hidden 2xl:block">{item.title}</span>
                                        </Link>
                                    </li>
                                    
                                ))}
                            </ul>
                            <button className="bg-[#1d9bf0] rounded-full mt-8 mr-4 py-4">
                            <span className=" px-24 hidden 2xl:inline">Post</span>
                            <span className="text-4xl rounded-full px-6 2xl:hidden">+</span>
                            </button>
                        </div>
                    </div>
                    {user && user.profileImageUrl && <div className=" flex
                    absolute bottom-14 gap-2 items-center bg-neutral-800 hover:bg-neutral-700 p-2 rounded-full mr-4  ">
                        <Image 
                        src={user.profileImageUrl} 
                        alt='user-image' 
                        width={50} 
                        height={50}
                        className="rounded-full "
                        />
                        <div className="text-xl 2xl:inline hidden pr-10">
                            {user.firstName} {user?.lastName}
                        </div>
                    </div>}
                    
            </div>
            <div className="col-span-9 md:col-span-5 border-x-2 border-neutral-800 h-screen overflow-auto scrollbar-style">
                {props.children}
            </div>
            <div className="hidden sm:inline col-span-3">
            {!user && <div className="m-5 p-5 bg-neutral-800 rounded-lg">
                <div className="text-center m-2 text-lg text-neutral-200">Login / Register</div>
                <div className=" flex justify-center">
                <GoogleLogin onSuccess={handelLoginWithGoogle}/>
                </div>
            </div>}
            {user && user.recommendedUsers  && <div className="m-5 p-5 bg-neutral-800 rounded-lg">
                <div className=" text-neutral-300 font-semibold text-2xl mb-2">People you might know</div>
                {user.recommendedUsers.map((el) => (
                    <div key={el?.id} className="flex gap-4 text-lg p-4 font-semibold">
                        {el?.profileImageUrl && <Image
                            src={el.profileImageUrl}
                            alt="recommended-user-image"
                            className="rounded-full aspect-square"
                            height={55}
                            width={55}
                        />}
                        <div>
                            <div>
                                {el?.firstName} {el?.lastName}
                            </div>
                            <Link
                                className=" bg-neutral-300 py-1 px-3 rounded-full text-neutral-800 font-semibold"
                                href={`/${el?.id}`}
                            >View</Link>
                        </div>
                    </div>
                ))}
            </div>}
            </div>
        </div>
    </div>)
}

export default TwitterLayout;