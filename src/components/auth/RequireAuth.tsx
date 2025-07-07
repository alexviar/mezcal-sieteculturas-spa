import { RootState } from "@/models/redux/store";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router"
import { PropsWithChildren, useEffect } from "react";
import { useSelector } from "react-redux";

export const RequireAuth = ({children}: PropsWithChildren)=>{
  const router = useRouter()
  const currentPath = usePathname()
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(()=>{
    if(!user){
      router.replace({
        pathname: '/login',
        query: {
          return: currentPath
        }
      }, '/login')
    }
  }, [user])

  return user ? children : null
}