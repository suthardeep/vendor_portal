import { createFileRoute , Outlet , redirect } from '@tanstack/react-router'
import {ROUTES} from  '@/constants/routes'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
  validateSearch :(search:Record<string , unknown>)=>{
     return {
      redirectTo:
        typeof search.redirectTo === "string"
          ? search.redirectTo
          : "/dashboard",
    };
},

beforeLoad : async({context , search}) =>{
    const {isLoggedIn} = context
    const {redirectTo} = search

    if(isLoggedIn){
        throw redirect({
        to: redirectTo || ROUTES.DASHBOARD,
      })

    }



}


})

function RouteComponent() {
  return <Outlet />;
}
