import { IPaginationOptions } from './types/pagination-options';
import { InfinityPaginationResultType } from './types/infinity-pagination-result.type';

export const infinityPagination = <T>(
  dataArray: [T[], number],
  options: IPaginationOptions,
): InfinityPaginationResultType<T> => {
  return {
    data: dataArray[0],
    hasNextPage: dataArray[0].length === options.limit,
    count: dataArray[1],
  };
};
