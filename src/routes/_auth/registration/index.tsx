import Registration from '@/features/auth/registration'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/registration/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Registration/>
}
