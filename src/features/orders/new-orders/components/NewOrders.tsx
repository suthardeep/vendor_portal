import React from 'react'



import { Table  } from '@/components/table/Table';


import newOrderData from '../utils/dummyData'
import { ColumnDef } from '@/components/table/table.types';


const columns: ColumnDef<NewOrdersData>[] = [
  {
    key: "sku",
    header: "SKU",
    sortable: true,
    cellType: "text",
    cellClassName:'text-primary'
    
  },
  {
    key: "customerName",
    header: "Customer Name",
    sortable: true,
    cellType: "text",
  },
  {
    key: "noOfProducts",
    header: "No. of Products",
    sortable: true,
    cellType: "text",
  },
  {
    key: "receivedData",
    header: "Received Date",
    sortable: true,
    cellType: "text",
  },
  {
    key: "location",
    header: "Location",
    cellType: "text",
  },
];








const Inventory = () => {





    




  return (
      <Table 
      columns={columns} 
      data={newOrderData}
        title="New Orders"
        searchable
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Not Started", value: "Not Started" },
              { label: "Completed", value: "Completed" },
              { label: "Live", value: "Live" },
            ],
          },
          {
            key: "category",
            label: "Category",
            options: [
              { label: "Electronics", value: "Electronics" },
              { label: "Home Decor", value: "Home Decor" },
              { label: "Accessories", value: "Accessories" },
            ],
          },

         
        ]}
     
        rowActions={[
          { label: "View", icon: "Eye", onClick: () => {} },
          
        ]}
        
        pagination={{ pageSize: 8 }}
      ></Table>

  )
}

export default Inventory
