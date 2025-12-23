import Profile from '@/features/profile'
import { createFileRoute } from '@tanstack/react-router'

export interface ProfileSearchParam {
    step: "view" | "edit" | "password"
}

export const Route = createFileRoute('/_app/profile')({
  component: RouteComponent,
  staticData:{
    breadcrumb: {
      label: "Profile",
    }
  },
  validateSearch:(search : ProfileSearchParam) =>{
    switch (search.step) {
      case "view": 
      case "edit":  
      case "password":  return {step: search.step}
      default: return {step: "view"}
    }
  }
})

function RouteComponent() {
    const {step} = Route.useSearch();
  return <Profile step={step}/>
}
