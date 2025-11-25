import RegistrationForm from '@/features/auth/register'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/register/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RegistrationForm/>
}
