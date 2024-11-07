import React from 'react';
import PaginationRange from './PaginationRange';
import Link from 'next/link';

const Pagination = ({ page, limit, totalPage, sibling, onPageChange }) => {
  let array = PaginationRange({ page, limit, totalPage, sibling });

  return (
    <>
      <div className="pagination">
        <ul className="pagination__list">
          <li className="pagination__item">
            {page === 1 ? (
              <button disabled className="pagination__link">
                &lsaquo;
              </button>
            ) : (
              <Link href={`/tasks/pages/${page - 1}`} className="pagination__link" onClick={() => onPageChange('&lsaquo;')}>
                &lsaquo;
              </Link>
            )}
          </li>
          {array.map((item, index) => {
            if (item === page) {
              return (
                <li key={index} className="pagination__item pagination__item-active">
                  <Link href={`/tasks/pages/${item}`} onClick={() => onPageChange(item)} className="pagination__link">
                    {item}
                  </Link>
                </li>
              );
            } else if (item === ' ...') {
              return (
                <li key={index} className="pagination__item">
                  <button disabled className="pagination__link">
                    {item}
                  </button>
                </li>
              );
            } else if (item === '... ') {
              return (
                <li key={index} className="pagination__item">
                  <button disabled className="pagination__link">
                    {item}
                  </button>
                </li>
              );
            } else {
              return (
                <li key={index} className="pagination__item">
                  <Link href={`/tasks/pages/${item}`} onClick={() => onPageChange(item)} className="pagination__link">
                    {item}
                  </Link>
                </li>
              );
            }
          })}

          <li className="pagination__item">
            {page >= totalPage ? (
              <button disabled className="pagination__link">
                &rsaquo;
              </button>
            ) : (
              <Link href={`/tasks/pages/${page + 1}`} className="pagination__link" onClick={() => onPageChange('&rsaquo;')}>
                &rsaquo;
              </Link>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default Pagination;
