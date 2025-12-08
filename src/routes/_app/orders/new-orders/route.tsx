import { createFileRoute } from '@tanstack/react-router'

import NewOrders from '@/features/orders/new-orders/index'

export const Route = createFileRoute('/_app/orders/new-orders')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>

    <NewOrders></NewOrders>

    
  </div>
}
