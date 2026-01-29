import { Static, t, TSchema } from "elysia";

export namespace CommonDTO {
  export const PaginationQuery = t.Object({
    page: t.Number({
      title: "Page Number",
      minimum: 1,
      default: 1,
    }),
    limit: t.Number({
      title: "Items Per Page",
      minimum: 1,
      maximum: 100,
      default: 10,
    }),
  });
  export type PaginationQuery = typeof PaginationQuery.static;

  export const ResponseData = <TData extends TSchema>(dataSchema: TData) =>
    t.Object({
      code: t.Number({
        title: "Response Code",
        examples: [200, 400, 500],
      }),
      message: t.String({
        title: "Response Message",
        minLength: 2,
        maxLength: 500,
      }),
      data: dataSchema,
    });

  export type ResponseData<TData extends TSchema> = Static<
    ReturnType<typeof ResponseData<TData>>
  >;

  export const ResponseDataList = <TData extends TSchema>(dataSchema: TData) =>
    t.Object({
      code: t.Number({
        title: "Response Code",
        examples: [200, 400, 500],
      }),
      message: t.String({
        title: "Response Message",
        minLength: 2,
        maxLength: 500,
      }),
      data: t.Object({
        items: t.Array(dataSchema, {
          title: "List of Items",
        }),
      }),
    });

  export type ResponseDataList<TData extends TSchema> = Static<
    ReturnType<typeof ResponseDataList<TData>>
  >;

  export const ResponseDataListPagination = <TData extends TSchema>(
    dataSchema: TData,
  ) =>
    t.Object({
      code: t.Number({
        title: "Response Code",
        examples: [200, 400, 500],
      }),
      message: t.String({
        title: "Response Message",
        minLength: 2,
        maxLength: 500,
      }),
      data: t.Object({
        items: t.Array(dataSchema, {
          title: "List of Items",
        }),
        pagination: t.Object({
          page: t.Number({
            title: "Page Number",
            minimum: 1,
            default: 1,
          }),
          limit: t.Number({
            title: "Items Per Page",
            minimum: 1,
            maximum: 100,
            default: 10,
          }),
          totalItems: t.Number({
            title: "Total Number of Items",
            minimum: 0,
            default: 0,
            examples: [123],
          }),
          totalPages: t.Number({
            title: "Total Number of Pages",
            minimum: 1,
            default: 0,
            examples: [12],
          }),
          hasNextPage: t.Optional(
            t.Boolean({
              title: "Has Next Page",
              examples: [true],
            }),
          ),
          hasPreviousPage: t.Optional(
            t.Boolean({
              title: "Has Previous Page",
              examples: [false],
            }),
          ),
        }),
      }),
    });

  export type ResponseDataListPagination<TData extends TSchema> = Static<
    ReturnType<typeof ResponseDataListPagination<TData>>
  >;
}
