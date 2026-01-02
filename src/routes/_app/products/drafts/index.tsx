import DraftsList from '@/features/products/drafts/pages/drafts-list/DraftsList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/products/drafts/')({
  component: RouteComponent,
  staticData:{
    breadcrumb: {
      label: "Drafts",
    },
    title: "Draft Products"
  }
})

function RouteComponent() {
  return (
            <DraftsList />
  )
}