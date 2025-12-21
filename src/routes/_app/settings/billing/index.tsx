import ComingSoon from '@/components/empty-states/ComingSoon'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/settings/billing/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ComingSoon 
      title="Billing Settings"
      description="Billing and payment settings are coming soon. You'll be able to manage your subscription and payment methods here."
    />
  )
}