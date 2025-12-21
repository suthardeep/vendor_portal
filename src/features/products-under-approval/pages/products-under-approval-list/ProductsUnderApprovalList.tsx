import React, { useState, useMemo } from 'react';
import { Table } from "@/components/table/Table";
import { ColumnDef, PaginationConfig, FilterConfig, FilterChip } from "@/components/table/table.types";
import { useGetApprovalProductsQuery, useDeleteApprovalProductMutation } from '../../api/queryHooks';
import { ApprovalProduct } from '../../types/approvalProduct';
import { PaginationMeta } from "@/types/baseApi";
import Dialog from "@/components/compound/Dialog";
import { useCategoriesQuery } from '@/features/products/add-product/api/queryHooks';
import { Category } from '@/features/products/add-product/types/addProduct.types';
import { BadgeCell } from '@/components/table/cells/BadgeCell';

const ProductsUnderApprovalList: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ApprovalProduct | null>(null);

  const [params, setParams] = useState({ 
    page: 1, 
    pageSize: 10,
    search: '',
    status: 'under_review',
    categoryId: '',
  });

  // Filter chip states
  const [activeChips, setActiveChips] = useState<Set<string>>(new Set(['under_review']));

  const { 
    data: approvalProductsData, 
    isLoading, 
    isFetching, 
    isError 
  } = useGetApprovalProductsQuery(params);

  // Fetch categories for filter dropdown
  const { data: categoriesData } = useCategoriesQuery("MAIN", undefined, true);

  const deleteProductMutation = useDeleteApprovalProductMutation();
  
  const approvalProducts: ApprovalProduct[] = approvalProductsData?.data || [];
  const meta: PaginationMeta | undefined = approvalProductsData?.meta;

  const columns: ColumnDef<ApprovalProduct>[] = useMemo(() => [
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
      header: "PRODUCT",
      cellType: "text",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.thumbnailUrl || "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2lyZWxlc3MlMjBoZWFkcGhvbmVzfGVufDB8fDB8fHww"} 
            alt={row.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <p className="text-sm font-normal text-body-content">{row.name}</p>
            <p className="text-xs text-base-content/60">{row.categoryName || 'N/A'}</p>
          </div>
        </div>
      )
    },
    {
      key: "basePrice", 
      header: "BASE PRICE",
      cellType: "text",
      render: (row) => (
        <span className="text-sm font-normal text-body-content">
          {row.basePrice ? `₹${row.basePrice.toLocaleString()}` : 'N/A'}
        </span>
      )
    },
    {
      key: "updatedAt", 
      header: "LAST UPDATED",
      cellType: "text",
      sortable: true,
      render: (row) => (
        <span className="font-light text-sm text-base-content">
          {new Date(row.updatedAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
        </span>
      )
    },
    {
      key: "status", 
      header: "STATUS",
      cellType: "badge",
      render: (row) => (
        <BadgeCell 
          value={row.status}
          variant="soft"
          colorMap={{
            'under_review': 'yellow',
            'approved': 'green',
            'rejected': 'red',
            'pending': 'blue'
          }}
        />
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

  const handleChipChange = (chipKey: string, _isActive: boolean) => {
    // For radio button behavior: always activate the clicked chip
    const newActiveChips = new Set<string>([chipKey]);
    
    setActiveChips(newActiveChips);
    
    // Update params based on the selected chip
    setParams(prev => ({ 
      ...prev, 
      status: chipKey,
      page: 1 
    }));
  };

  const handleDeleteClick = (product: ApprovalProduct) => {
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
          console.error('Failed to delete approval product:', error);
        }
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  if (isError) {
    return <div className="p-4 text-error">Failed to load products under approval data.</div>;
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

  // Create filter chips
  const filterChips: FilterChip[] = useMemo(() => [
    {
      key: 'under_review',
      label: 'Under Review',
      defaultActive: true,
      activeColor: 'yellow',
      onChange: (isActive) => handleChipChange('under_review', isActive)
    },
    {
      key: 'approved',
      label: 'Approved',
      defaultActive: false,
      activeColor: 'green',
      onChange: (isActive) => handleChipChange('approved', isActive)
    },
    {
      key: 'rejected',
      label: 'Rejected',
      defaultActive: false,
      activeColor: 'red',
      onChange: (isActive) => handleChipChange('rejected', isActive)
    }
  ], [activeChips]);

  return (
    <>
      <Table<ApprovalProduct>
        title="Products Under Approval"
        data={approvalProducts} 
        columns={columns}
        searchable
        searchPlaceholder="Search products under approval..."
        onSearch={handleSearch} 
        filters={filters}
        filterChips={filterChips}
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
            icon: "Edit",
            onClick: (row) => {
              // TODO: Navigate to edit page
              console.log('Edit product:', row.id);
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
        emptyMessage="No products under approval found"
        emptyIcon="Package"
      />

      <Dialog
        isOpen={deleteDialogOpen}
        close={handleDeleteCancel}
        title="Delete Product"
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
            This will permanently delete the product and all associated data.
          </p>
        </div>
      </Dialog>
    </>
  );
};

export default ProductsUnderApprovalList;