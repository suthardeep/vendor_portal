import DraftsList from '@/features/products/drafts/pages/drafts-list/DraftsList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/products/drafts/')({
  component: RouteComponent,
  staticData:{
    breadcrumb: {
      label: "Drafts",
    }
  }
})

function RouteComponent() {
  return (
    <div className='h-full'>
      <DraftsList />
    </div>
  )
}