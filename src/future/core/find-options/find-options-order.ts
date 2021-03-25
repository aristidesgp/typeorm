/**
 * Value of order by in find options.
 */
export type FindOptionsOrderByValue =
    | "ASC"
    | "DESC"
    | "asc"
    | "desc"
    | 1
    | -1
    | {
          direction?: "asc" | "desc" | "ASC" | "DESC";
          nulls?: "first" | "last" | "FIRST" | "LAST";
      };

/**
 * Order by find options.
 */
export type FindOptionsOrder<E> = {
    [P in keyof E]?: E[P] extends (infer R)[]
        ? FindOptionsOrder<R>
        : E[P] extends Promise<infer R>
        ? FindOptionsOrder<R>
        : E[P] extends object
        ? FindOptionsOrder<E[P]>
        : FindOptionsOrderByValue;
};
