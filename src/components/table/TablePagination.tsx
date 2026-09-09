import ReactPaginate from 'react-paginate';
import NextIcon from '../Icons/NextIcon';
import PreviousIcon from '../Icons/PreviousIcon';

interface TablePaginationProps {
  totalDocs?: number;
  pageNum?: number;
  perPage: number;
  onPageChange?: (selectedItem: { selected: number }) => void;
  currentPage: number;
  label?: boolean;
}

const TablePagination = (props: TablePaginationProps) => {
  const { totalDocs, pageNum, perPage, onPageChange, currentPage, label } =
    props;
  const totalDocsValue = totalDocs ?? 0;
  let pageCount = Math.ceil(totalDocsValue / perPage);
  return (
    <>
      <div className="card-footer d-flex align-items-center py-3">
        <>
          <p className="m-0 text-secondary">
            Showing{' '}
            <span>
              {totalDocsValue > 0 ? (Number(pageNum) - 1) * perPage + 1 : 0}
            </span>{' '}
            to{' '}
            <span>
              {Number(pageNum) * perPage > totalDocsValue
                ? totalDocsValue
                : Number(pageNum) * perPage}
            </span>{' '}
            of <span>{totalDocsValue}</span> entries
          </p>
        </>
        <ReactPaginate
          key={currentPage}
          previousLabel={<PreviousIcon label={label ? 'prev' : ''} />}
          nextLabel={<NextIcon label={label ? 'next' : ''} />}
          pageCount={pageCount}
          marginPagesDisplayed={3}
          pageRangeDisplayed={3}
          onPageChange={onPageChange}
          forcePage={currentPage - 1}
          containerClassName={'pagination m-0 ms-auto'}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          breakClassName={'page-item'}
          breakLinkClassName={'page-link'}
          activeClassName={'active'}
        />
      </div>
    </>
  );
};

export default TablePagination;
