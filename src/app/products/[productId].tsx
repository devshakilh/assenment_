"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const { currentPage, totalPages, paginatedItems: paginatedProducts, handlePageChange } = usePagination({
    items: PRODUCTS_DATA,
    itemsPerPage: 5,
  });

  const handleOpenModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    router.push(`${pathname}/${product.id}`);
  }, [router, pathname]);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
    router.push("/products");
  }, [router]);

  useEffect(() => {
    const productId = pathname.split("/").pop();
    if (productId && productId !== "products") {
      const product = PRODUCTS_DATA.find((p) => p.id === productId);
      if (product) setSelectedProduct(product);
    }
  }, [pathname]);

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
