import ComingSoon from '@/components/empty-states/ComingSoon'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/settings/security/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ComingSoon 
      title="Security Settings"
      description="Security and privacy settings are coming soon. You'll be able to manage your password, 2FA, and other security options here."
    />
  )
}