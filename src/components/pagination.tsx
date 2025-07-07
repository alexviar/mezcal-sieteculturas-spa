import { Left, Right } from "@/assets/icons";
import { PaginationProps } from "@/constants";

export const PaginationComponent = ({
  pagination,
  onPageChange,
}: PaginationProps) => {
  if (!pagination || pagination.total_pages <= 1) return null;

  const generatePageButtons = () => {
    const totalPages = pagination.total_pages;
    const currentPage = pagination.current_page;
    const pageButtons = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={i === currentPage ? "current-page-button" : ""}
          >
            {i}
          </button>
        );
      }
    } else {
      pageButtons.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={currentPage === 1 ? "current-page-button" : ""}
        >
          1
        </button>
      );

      if (currentPage > 3) {
        pageButtons.push(<span key="start-dots">...</span>);
      }

      let startPage = currentPage - 1;
      let endPage = currentPage + 1;

      if (currentPage <= 3) {
        startPage = 2;
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
        endPage = totalPages - 1;
      }

      startPage = Math.max(startPage, 2);
      endPage = Math.min(endPage, totalPages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={i === currentPage ? "current-page-button" : ""}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        pageButtons.push(<span key="end-dots">...</span>);
      }

      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={currentPage === totalPages ? "current-page-button" : ""}
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <div className="pagination-container">
      <ul>
        <li>
          <button
            onClick={() => onPageChange(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
          >
            <Left />
          </button>

          {generatePageButtons()}

          <button
            onClick={() => onPageChange(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.total_pages}
          >
            <Right />
          </button>
        </li>
      </ul>
    </div>
  );
};
