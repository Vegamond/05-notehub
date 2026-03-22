import ReactPaginateImport from 'react-paginate';
import css from './Pagination.module.css';

const ReactPaginate =
  ((ReactPaginateImport as any).default ?? ReactPaginateImport) as any;

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (selectedPage: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }: { selected: number }) =>
        onPageChange(selected + 1)
      }
      forcePage={page - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
    />
  );
}
