import { useState } from 'react';

export const useListPagination = <T>(items: T[], perPage = 10) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * perPage;
  const pageCount = Math.ceil(items.length / perPage);
  const pagedItems = items.slice(offset, offset + perPage);

  return {
    currentPage,
    setCurrentPage,
    pageCount,
    pagedItems,
    handlePageClick,
  };
};
