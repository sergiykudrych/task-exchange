import React from 'react';
import _ from 'lodash';

const PaginationRange = ({ page, limit, totalPage, sibling }) => {
  let totalPageNoInArray = 7 + sibling;
  if (totalPageNoInArray >= totalPage) {
    return _.range(1, totalPage + 1);
  }
  let leftSiblingsIndex = Math.max(page - sibling, 1);
  let rightSiblingsIndex = Math.min(page + sibling, totalPage);

  let showLeftDots = leftSiblingsIndex > 2;
  let showRightDots = rightSiblingsIndex < totalPage - 2;

  if (!showLeftDots && showRightDots) {
    let leftItemsCount = 3 + 2 * sibling;
    let leftRange = _.range(1, leftItemsCount + 1);
    return [...leftRange, ' ...', totalPage];
  } else if (showLeftDots && !showRightDots) {
    let rightItemsCount = 3 + 2 * sibling;
    let rightRange = _.range(totalPage - rightItemsCount + 1, totalPage + 1);
    return [1, '... ', ...rightRange];
  } else {
    let middleRange = _.range(leftSiblingsIndex, rightSiblingsIndex + 1);
    return [1, ' ...', ...middleRange, '... ', totalPage];
  }
};

export default PaginationRange;
