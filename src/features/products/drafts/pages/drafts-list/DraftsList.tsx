import React, { useState, useMemo } from 'react';
import { Table } from "@/components/table/Table";
import { ColumnDef, PaginationConfig, FilterConfig } from "@/components/table/table.types";
import { useGetDraftProductsQuery, useDeleteDraftProductMutation } from '../../api/queryHooks';
import { DraftProduct } from '../../types/draft';
import { PaginationMeta } from "@/types/baseApi";
import Dialog from "@/components/compound/Dialog";
import { useCategoriesQuery } from '@/features/products/add-product/api/queryHooks';
import { Category } from '@/features/products/add-product/types/addProduct.types';
import { useNavigate } from '@tanstack/react-router';

const DraftsList: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<DraftProduct | null>(null);
  const navigate = useNavigate();

  const [params, setParams] = useState({ 
    page: 1, 
    pageSize: 10,
    search: '',
    status: 'draft',
    categoryId: '',
  });

  const { 
    data: draftsData, 
    isLoading, 
    isFetching, 
    isError 
  } = useGetDraftProductsQuery(params);

  // Fetch categories for filter dropdown
  const { data: categoriesData } = useCategoriesQuery("MAIN", undefined, true);

  const deleteProductMutation = useDeleteDraftProductMutation();
  
  const drafts: DraftProduct[] = draftsData?.data || [];
  const meta: PaginationMeta | undefined = draftsData?.meta;

  const columns: ColumnDef<DraftProduct>[] = useMemo(() => [
    {
      key: "externalSku", 
      header: "SKU",
      cellType: "text",
      render: (row) => (
        <span className="text-sm font-normal text-body-content">{row.externalSku}</span>
      )
    },
    {
      key: "name", 
      header: "PRODUCT NAME",
      cellType: "text",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img 
            src={row?.thumbnailUrl || "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2lyZWxlc3MlMjBoZWFkcGhvbmVzfGVufDB8fDB8fHww"} 
            alt={row.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <p className="text-sm font-normal text-body-content">{row.name}</p>
            <p className="text-xs text-base-content/60">{row.categoryPath && row.categoryPath.length > 0 ? row.categoryPath[0] : 'N/A'}</p>
          </div>
        </div>
      )
    },
    {
      key: "brandName", 
      header: "BRAND",
      cellType: "text",
      render: (row) => (
        <span className="text-sm font-normal text-body-content">{row.brandName || 'N/A'}</span>
      )
    },
    {
      key: "createdAt", 
      header: "CREATED ON",
      cellType: "text",
      sortable: true,
      render: (row) => (
        <span className="font-light text-sm text-base-content">
          {new Date(row.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
        </span>
      )
    },
  ], []);

  const handlePageChange = (newPage: number) => {
    const pageNumber = typeof newPage === 'string' ? parseInt(newPage, 10) : newPage;
    setParams(prev => ({ ...prev, page: pageNumber }));
  };

  const handleSearch = (searchTerm: string) => {
    setParams(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleCategoryFilter = (categoryId: string) => {
    setParams(prev => ({ 
      ...prev, 
      categoryId: categoryId === 'all' ? '' : categoryId, 
      page: 1 
    }));
  };

  const handleDeleteClick = (product: DraftProduct) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setProductToDelete(null);
        },
        onError: (error) => {
          console.error('Failed to delete draft product:', error);
        }
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  if (isError) {
    return <div className="p-4 text-error">Failed to load draft products data.</div>;
  }

  const pagination: PaginationConfig | undefined = meta ? {
    meta: meta,
    onPageChange: handlePageChange,
    showTotal: true
  } : undefined;

  // Create category filter options
  const categoryOptions = useMemo(() => {
    const categories = categoriesData?.data?.data || [];
    return [
      { label: 'All Categories', value: 'all' },
      ...categories.map((category: Category) => ({
        label: category.name,
        value: category.id
      }))
    ];
  }, [categoriesData]);

  // Create filters array
  const filters: FilterConfig[] = useMemo(() => [
    {
      key: 'category',
      type: 'dropdown',
      label: 'Category',
      value: params.categoryId || 'all',
      options: categoryOptions,
      onChange: handleCategoryFilter,
    }
  ], [categoryOptions, params.categoryId]);

  return (
    <>
      <Table<DraftProduct>
        title="Draft Products"
        data={drafts} 
        columns={columns}
        searchable
        searchPlaceholder="Search draft products..."
        onSearch={handleSearch} 
        filters={filters}
        rowKey="id"
        selectedRows={selectedRows}
        onSelectionChange={(set) =>
          setSelectedRows(new Set(set as Set<string>))
        }
        maxHeight="calc(100vh - 198px)"
        actions={[]}
        hoverable
        loading={isLoading || isFetching} 
        pagination={pagination}
        rowActions={[
          {
            label: "Edit",
            icon: "Edit2",
            onClick: (row) => {
              navigate({to: `/products/product-form/${row.id}/basic-details`})
            },
          },
          {
            label: "Delete",
            icon: "Trash2",
            onClick: (row) => handleDeleteClick(row),
            variant: "danger",
          },
        ]}
        className='flex-1'
        emptyMessage="No draft products found"
        emptyIcon="Package"
      />

      <Dialog
        isOpen={deleteDialogOpen}
        close={handleDeleteCancel}
        title="Delete Draft Product"
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
            This will permanently delete the draft product and all associated data.
          </p>
        </div>
      </Dialog>
    </>
  );
};

export default DraftsList;