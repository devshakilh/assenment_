"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Product } from "@/types";
import { ProductModal } from "@/views/products/productModal/productModal";
import { BackToHome } from "@/components/backToHome/backToHome";
import { ProductList } from "@/views/products/productList/productList";
import { PaginationControls } from "@/views/products/paginationControls/paginationControls";
import { usePagination } from "@/hooks/usePagination";
import { PRODUCTS_DATA } from "@/data/productsData";

export const Products: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { currentPage, totalPages, paginatedItems: paginatedProducts, handlePageChange } = usePagination({
    items: PRODUCTS_DATA,
    itemsPerPage: 5,
  });

  // Open the modal and update the URL with the product ID
  const handleOpenModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    router.push(`${pathname}?productId=${product.id}`);
  }, [router, pathname]);

  // Close the modal and revert the URL
  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
    router.push(pathname);
  }, [router, pathname]);

  // Check URL for product ID when the component mounts or the URL changes
  useEffect(() => {
    const productId = searchParams.get("productId");
    if (productId) {
      const product = PRODUCTS_DATA.find((p) => p.id === productId);
      if (product) setSelectedProduct(product);
    } else {
      setSelectedProduct(null); // Close modal if no productId in the URL
    }
  }, [searchParams]);

  return (
    <div>
      <BackToHome />
      <ProductList products={paginatedProducts} onOpenModal={handleOpenModal} />
      <div className="h-4" />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
};
