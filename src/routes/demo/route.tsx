import DemoProductPage from '@/components/media-picker/components/Demo'
import ProductAttributesForm from '@/features/demo/FieldTreeDemo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo')({
  component: RouteComponent,
})

function RouteComponent() {
  return (<div>
    {/* <DemoProductPage/> */}
    <ProductAttributesForm/>
    </div>)
}
