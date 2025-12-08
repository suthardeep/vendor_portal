import { IssueDetailsRow } from "@/components/base/IssueDetailRow";
import { Table } from "@/components/table/Table";
import { ColumnDef } from "@/components/table/table.types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard/")({
  component: RouteComponent,
});


function RouteComponent() {
  // Interface for your ProductItem
  interface ProductItem {
    id: string;
    sku: string;
    product: {
      name: string;
      category: string;
      image: string;
    };
    listingPrice: number;
    settlementPrice: number;
    qty: number;
    aavakCoin: number;
    rating: number;
    ratingCount: number;
      issueDetails?: string;
  attachmentUrl?: string;
  returnReason?: string;
  specialNotes?: string;
  }

  const productList: ProductItem[] = [
    {
      id: "p1",
      sku: "238474",
      product: {
        name: "OnePlus 7Pro",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1510552776732-03e61cf4b144?q=80&auto=format&fit=crop",
      },
      listingPrice: 49.9,
      settlementPrice: 50.0,
      qty: 26,
      aavakCoin: 5,
      rating: 5.0,
      ratingCount: 32,
      issueDetails: "Product arrived damaged. Left leg is broken",
    specialNotes: "Customer requested replacement" ,
    attachmentUrl: "https://example.com/images/damaged_product.jpg",
    },
    {
      id: "p2",
      sku: "659854",
      product: {
        name: "Magic Mouse",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1587202372775-e229f172b7f1?q=80&auto=format&fit=crop",
      },
      listingPrice: 49.9,
      settlementPrice: 50.0,
      qty: 53,
      aavakCoin: 4,
      rating: 4.2,
      ratingCount: 87,
    },
    {
      id: "p3",
      sku: "854763",
      product: {
        name: "Wooden Chair",
        category: "Home Decor",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&auto=format&fit=crop",
      },
      listingPrice: 49.9,
      settlementPrice: 50.0,
      qty: 100,
      aavakCoin: 5,
      rating: 5.0,
      ratingCount: 32,
    },
    {
      id: "p4",
      sku: "652354",
      product: {
        name: "Air Jordan",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&auto=format&fit=crop",
      },
      listingPrice: 49.9,
      settlementPrice: 50.0,
      qty: 0,
      aavakCoin: 4,
      rating: 4.2,
      ratingCount: 87,
    },
    {
      id: "p5",
      sku: "152456",
      product: {
        name: "Nintendo Switch",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886b09?q=80&auto=format&fit=crop",
      },
      listingPrice: 49.9,
      settlementPrice: 50.0,
      qty: 75,
      aavakCoin: 5,
      rating: 5.0,
      ratingCount: 32,
    },
    {
      id: "p6",
      sku: "152207",
      product: {
        name: "Apple Watch",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1543165796-5426273eaab3?q=80&auto=format&fit=crop",
      },
      listingPrice: 49.9,
      settlementPrice: 50.0,
      qty: 10,
      aavakCoin: 4,
      rating: 4.2,
      ratingCount: 87,
    },
    {
      id: "p7",
      sku: "63528",
      product: {
        name: "Note 10",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&auto=format&fit=crop",
      },
      listingPrice: 49.9,
      settlementPrice: 50.0,
      qty: 1,
      aavakCoin: 5,
      rating: 5.0,
      ratingCount: 32,
    },
    {
      id: "p8",
      sku: "32280",
      product: {
        name: "Sunglasses",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&auto=format&fit=crop",
      },
      listingPrice: 49.9,
      settlementPrice: 50.0,
      qty: 250,
      aavakCoin: 4,
      rating: 4.2,
      ratingCount: 87,
    },
    {
      id: "p9",
      sku: "478392",
      product: {
        name: "Gaming Laptop",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1588872657840-218e412ee62e?q=80&auto=format&fit=crop",
      },
      listingPrice: 49.9,
      settlementPrice: 50.0,
      qty: 5,
      aavakCoin: 5,
      rating: 5.0,
      ratingCount: 32,
    },
  ];

  const columns: ColumnDef<ProductItem>[] = [
    {
      key: "sku",
      header: "SKU",
      sortable: true,
      cellClassName: "text-primary"
    },
    {
      key: "product",
      header: "PRODUCT",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.product.image} className="w-10 h-10 rounded-md" alt={row.product.name} />
          <div>
            <div className="font-light">{row.product.name}</div>
            <div className="text-xs text-body-content">{row.product.category}</div>
          </div>
        </div>
      ),
    },
    {
      key: "pricing",
      header: "PRICING INFO",
      subColumns: [
        {
          key: "listingPrice",
          header: "LISTING PRICE",
          sortable: true,
          align: "center" 
        },
        {
          key: "settlementPrice",
          header: "SETTLEMENT PRICE",
          sortable: true,
          align: "center"
        },
      ],
    },


    {
      key: "qty",
      header: "QTY",
      sortable: true,
    },
    {
      key: "aavakCoin",
      header: "AAVAK COIN",
      sortable: true,
      cellType:"input"
    },
    {
      key: "rating",
      header: "RATING",
      sortable: false,
      cellType: "rating",
      ratingConfig: {
        icon: "star",
        showCount: true,
        countKey: "ratingCount",
      },
    },
  ];

  return (
    <div>
      <Table
        data={productList}
        columns={columns}
        selectable={true}
        title="Promoted Products"
        
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
        actions={[
          { label: "Add Product", icon: "Plus", onClick: () => {}, variant: "primary" },
        ]}
        rowActions={[
          { label: "View", icon: "Eye", onClick: () => {} },
          { label: "Duplicate", icon: "Copy", onClick: () => {} },
          { label: "Archive", icon: "Archive", onClick: () => {} },
        ]}
        pagination={{ pageSize: 8 }}

        expandedRowConfig={{
  shouldExpand: (row) => !!(row.issueDetails || row.specialNotes),
  render: (row) => (
  <IssueDetailsRow 
        issueDetails={row.issueDetails!}
        attachmentUrl={row.attachmentUrl}
      />
  )
}}


// breadcrumb={{
//     heading: "Categories",  
//     items: ['Clothing', 'Electronics', 'Home Appliances'],
//     showSeparator: false,
//     onItemClick: (item, index) => console.log(item)
//   }}

        
      />
    </div>
  );
}

export default RouteComponent;
