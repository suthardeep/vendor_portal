import React, { useState, useMemo } from "react";
import { Table } from "@/components/table/Table";
import { ColumnDef, PaginationConfig, FilterConfig } from "@/components/table/table.types";
import { PaginationMeta } from "@/types/baseApi";
import { RecentTransaction, TopProductsSold } from "../types/dashboard.types";
import {
  metaMock,
  recentTransactionsMockData,
  topProductsSoldMockData,
} from "../mock-data/mockData.dashboard";
import { cn } from "@/utils/helpers";
import { Image } from "@/components/base/Image";

const TopProductsSoldTable: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: "",
    status: "active",
    categoryId: "",
  });

  //   const { data: activeProductsData, isLoading, isFetching, isError } = useGetActiveProductsQuery(params);

  // Fetch categories for filter dropdown
  // const { data: categoriesData } = useCategoriesQuery("MAIN", undefined, true);

  //   const deleteProductMutation = useDeleteActiveProductMutation();

  const activeProducts: TopProductsSold[] = topProductsSoldMockData || [];
  const meta: PaginationMeta | undefined = metaMock;

  const columns: ColumnDef<TopProductsSold>[] = useMemo(
    () => [
      {
        key: "productName",
        header: "PRODUCT",
        cellType: "text",
        render: (row) => (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10">
              <Image src={row?.productImage} alt={row.productName} className="rounded-lg" expandOnClick />
            </div>
            <span className="text-body-content text-sm ">{row.productName}</span>
          </div>
        ),
      },
      {
        key: "unitsSold",
        header: "UNITS SOLD",
        cellType: "text",
        sortable: true,
      },
      {
        key: "price",
        header: "PRICE",
        cellType: "text",
        sortable: true,
      },
    ],
    []
  );

  const handlePageChange = (newPage: number) => {
    const pageNumber = typeof newPage === "string" ? parseInt(newPage, 10) : newPage;
    setParams((prev) => ({ ...prev, page: pageNumber }));
  };

  //   if (isError) {
  //     return <div className="p-4 text-error">Failed to load active products data.</div>;
  //   }

  const pagination: PaginationConfig | undefined = meta
    ? {
        meta: meta,
        onPageChange: handlePageChange,
        showTotal: true,
      }
    : undefined;

  return (
    <Table<TopProductsSold>
      title="Top Products By Units Sold"
      data={activeProducts}
      columns={columns}
      rowKey="productName"
      hoverable
      pagination={pagination}
      containsAction={false}
      emptyMessage="No Transaction Details found"
      emptyIcon="Package"
      classNameConfig={{
        tableHeader: { container: "py-5" },
        // tableRow: { cell: "py-1.5", cellText: "text-sm inline-flex" },
      }}
    />
  );
};

export default TopProductsSoldTable;
