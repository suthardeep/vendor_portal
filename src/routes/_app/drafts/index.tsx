import DraftsList from '@/features/drafts/pages/drafts-list/DraftsList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/drafts/')({
  component: RouteComponent,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Drafts"
    }
  }),
})

function RouteComponent() {
  return (
    <div className='h-full'>
      <DraftsList />
    </div>
  )
}