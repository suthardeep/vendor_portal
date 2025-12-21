import ComingSoon from '@/components/empty-states/ComingSoon'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/settings/general/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ComingSoon 
      title="General Settings"
      description="General account settings are coming soon. You'll be able to manage your basic account preferences here."
    />
  )
}