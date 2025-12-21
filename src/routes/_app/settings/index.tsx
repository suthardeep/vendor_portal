import ComingSoon from '@/components/empty-states/ComingSoon'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ComingSoon 
      title="Settings"
      description="Settings and configuration options are coming soon. You'll be able to customize your account preferences here."
    />
  )
}