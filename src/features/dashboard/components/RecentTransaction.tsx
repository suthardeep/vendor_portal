import React, { useState, useMemo } from "react";
import { Table } from "@/components/table/Table";
import { ColumnDef, PaginationConfig, FilterConfig } from "@/components/table/table.types";
import { PaginationMeta } from "@/types/baseApi";
import { useNavigate } from "@tanstack/react-router";
import { RecentTransaction } from "../types/dashboard.types";
import { metaMock, recentTransactionsMockData } from "../mock-data/mockData.dashboard";
import { cn } from "@/utils/helpers";

const RecentTransactionTable: React.FC = () => {
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

  const activeProducts: RecentTransaction[] = recentTransactionsMockData || [];
  const meta: PaginationMeta | undefined = metaMock;

  const columns: ColumnDef<RecentTransaction>[] = useMemo(
    () => [
      {
        key: "productName",
        header: "PRODUCT",
        cellType: "text",
      },
      {
        key: "amount",
        header: "AMOUNT",
        cellType: "text",
        sortable: true,
      },
      {
        key: "date",
        header: "CREATED ON",
        cellType: "text",
        sortable: true,
        valueFormatter: (value: any) => {
          return new Date(value).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          });
        },
      },
      {
        key: "status",
        header: "QUANTITY",
        cellType: "text",
        render: (row) => (
          <div
            className={cn(
              "w-full px-1 py-1 text-xs text-center rounded-sm flex items-center justify-center flex-nowrap",
              row.status === "delivered" ? " bg-success/10 text-success" : "bg-neutral/10 text-neutral"
            )}
          >
            {row.status === "delivered" ? "Delivered" : "Delivery Update"}
          </div>
        ),
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
    <Table<RecentTransaction>
      title="Recent Transactions"
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

export default RecentTransactionTable;
