import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";


const inter = Inter({subsets: ['latin']})


export default function App({ Component, pageProps }: AppProps) {
  return <div className={inter.className}>
      <GoogleOAuthProvider clientId="505254180289-5iqd6oh3s8am9if0qaut3qihm02r9985.apps.googleusercontent.com">
        <Component {...pageProps} />
        <Toaster />
      </GoogleOAuthProvider>
    </div>  
}
