import DemoProductPage from '@/components/media-picker/Demo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo')({
  component: RouteComponent,
})

function RouteComponent() {
  return (<div>
    <DemoProductPage/>
    </div>)
}
