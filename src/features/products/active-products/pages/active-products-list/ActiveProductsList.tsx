import React, { useState, useMemo } from "react";
import { Table } from "@/components/table/Table";
import { ColumnDef, PaginationConfig, FilterConfig } from "@/components/table/table.types";
import { useGetActiveProductsQuery, useDeleteActiveProductMutation } from "../../api/queryHooks";
import { ActiveProduct } from "../../types/activeProduct";
import { PaginationMeta } from "@/types/baseApi";
import Dialog from "@/components/compound/Dialog";
import { useNavigate } from "@tanstack/react-router";
import { Image } from "@/components/base/Image";
import { useCategoriesQuery } from "@/features/category/api/queryHooks";
import { Category } from "@/features/category/types.category";

const ActiveProductsList: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ActiveProduct | null>(null);
  const navigate = useNavigate();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: "",
    status: "active",
    categoryId: "",
  });

  const { data: activeProductsData, isLoading, isFetching, isError } = useGetActiveProductsQuery(params);

  // Fetch categories for filter dropdown
  const { data: categoriesData } = useCategoriesQuery("MAIN", undefined, true);

  console.log("categoriesData", categoriesData  )

  const deleteProductMutation = useDeleteActiveProductMutation();

  const activeProducts: ActiveProduct[] = activeProductsData?.data || [];
  const meta: PaginationMeta | undefined = activeProductsData?.meta;

  const columns: ColumnDef<ActiveProduct>[] = useMemo(
    () => [
      {
        key: "name",
        header: "PRODUCT",
        cellType: "text",
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10">
              <Image
                src={
                  // row.thumbnailUrl ||
                  "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2lyZWxlc3MlMjBoZWFkcGhvbmVzfGVufDB8fDB8fHww"
                }
                alt={row.name}
                expandOnClick
                className="w-10 h-10 rounded-lg object-cover"
              />
            </div>

            <div>
              <p className="text-sm font-normal text-body-content">{row.name}</p>
              <p className="text-xs text-base-content/60">{row.categoryName || "N/A"}</p>
            </div>
          </div>
        ),
      },
      {
        key: "basePrice",
        header: "BASE PRICE",

        cellType: "text",
        render: (row) => (
          <span className="text-sm font-normal text-body-content">
            {row.basePrice ? `₹${row.basePrice.toLocaleString()}` : "N/A"}
          </span>
        ),
      },
      {
        key: "settlementPrice",
        header: "SETTLEMENT PRICE",
        cellType: "text",
        render: (row) => (
          <span className="text-sm font-normal text-body-content">
            {row.settlementPrice ? `₹${row.settlementPrice.toLocaleString()}` : "N/A"}
          </span>
        ),
      },
      {
        key: "quantity",
        header: "QUANTITY",
        cellType: "text",
        render: (row) => <span className="text-sm font-normal text-body-content">{row.quantity || 0}</span>,
      },
      {
        key: "createdAt",
        header: "CREATED ON",
        cellType: "text",
        sortable: true,
        valueFormatter: (value) => {
          return new Date(value).toLocaleDateString("en-US", { dateStyle: "medium" });
        },
      },
    ],
    []
  );

  const handlePageChange = (newPage: number) => {
    const pageNumber = typeof newPage === "string" ? parseInt(newPage, 10) : newPage;
    setParams((prev) => ({ ...prev, page: pageNumber }));
  };

  const handleSearch = (searchTerm: string) => {
    setParams((prev) => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleCategoryFilter = (categoryId: string) => {
    setParams((prev) => ({
      ...prev,
      categoryId: categoryId === "all" ? "" : categoryId,
      page: 1,
    }));
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setProductToDelete(null);
        },
        onError: (error) => {
          console.error("Failed to delete active product:", error);
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const pagination: PaginationConfig | undefined = meta
    ? {
        meta: meta,
        onPageChange: handlePageChange,
        showTotal: true,
      }
    : undefined;

  // Create category filter options
  const categoryOptions = useMemo(() => {
    const categories = categoriesData?.data?.data || [];
    return [
      { label: "All Categories", value: "all" },
      ...categories.map((category: Category) => ({
        label: category.name,
        value: category.id,
      })),
    ];
  }, [categoriesData]);

  // Create filters array
  const filters: FilterConfig[] = useMemo(
    () => [
      {
        key: "category",
        type: "dropdown",
        label: "Category",
        value: params.categoryId || "all",
        options: categoryOptions,
        onChange: handleCategoryFilter,
      },
    ],
    [categoryOptions, params.categoryId]
  );

  // if (isError) {
  //   return <div className="p-4 text-error">Failed to load active products data.</div>;
  // }

  return (
    <>
      <Table<ActiveProduct>
        // title="Active Products"
        data={activeProducts}
        columns={columns}
        searchable
        onSearch={handleSearch}
        filters={filters}
        rowKey="id"
        selectedRows={selectedRows}
        onSelectionChange={(set) => setSelectedRows(new Set(set as Set<string>))}
        maxHeight="calc(100vh - 198px)"
        classNameConfig={{table:{tableContainer: "h-full"}}}
        actions={[
          {
            label: "Add Product",
            icon: "Plus",
            variant: "filled",
            onClick: () => {
              navigate({ to: "/products/add-product" });
            },
          },
        ]}
        hoverable
        loading={isLoading || isFetching}
        // loading={true}
        pagination={pagination}
        // breadcrumbs={{
        //   items: ["Dashboard", "Products", "Add Product"],
        //   label: "Add Product",
        //   showSeparator: true,
        //   // heading: "Create New Product",
        // }}
        // rowActions={[
        //   {
        //     label: "Edit",
        //     icon: "Edit",
        //     onClick: (row) => {
        //       // TODO: Navigate to edit page
        //       console.log('Edit product:', row.id);
        //     },
        //   },
        //   {
        //     label: "Delete",
        //     icon: "Trash2",
        //     onClick: (row) => handleDeleteClick(row),
        //     variant: "danger",
        //   },
        // ]}

        containsAction={false}
        className="flex-1"
        emptyMessage="No active products found"
        emptyIcon="Package"
      />

      <Dialog
        isOpen={deleteDialogOpen}
        close={handleDeleteCancel}
        title="Delete Active Product"
        subTitle={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        size="sm"
        actions={{
          secondary: {
            children: "Cancel",
            onClick: handleDeleteCancel,
            variant: "ghost",
          },
          primary: {
            children: deleteProductMutation.isPending ? "Deleting..." : "Delete",
            onClick: handleDeleteConfirm,
            variant: "filled",
            color: "danger",
            disabled: deleteProductMutation.isPending,
          },
        }}
      >
        <div className="py-4">
          <p className="text-sm text-gray-600">
            This will permanently delete the active product and all associated data.
          </p>
        </div>
      </Dialog>
    </>
  );
};

export default ActiveProductsList;
