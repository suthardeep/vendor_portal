import Login from '@/features/auth/login'
import { createFileRoute } from '@tanstack/react-router'

// interface LoginSearchParams {
//   redirectTo: string;
// }

export const Route = createFileRoute('/_auth/login/')({
  component: RouteComponent,
  // validateSearch: (search: LoginSearchParams) : LoginSearchParams => {
  //   return {
  //     redirectTo: typeof search.redirectTo === "string" ? search.redirectTo : "/dashboard",
  //   };
  // },
})

function RouteComponent() {
  return <Login />;
}
