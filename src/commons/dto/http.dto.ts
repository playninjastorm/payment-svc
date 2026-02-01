import { Static, t, TSchema } from "elysia";

export namespace HttpDTO {
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

  export const ResponseNotFound = t.Object({
    code: t.Number({
      title: "Response Code",
      examples: [422],
      default: 422,
    }),
    message: t.String({
      title: "Response Message",
      examples: [
        "The requested resource was not found",
        "Product not found",
        "Promotion not found",
      ],
    }),
  });

  export type ResponseNotFound = typeof ResponseNotFound.static;

  export const ResponseInternalError = t.Object({
    code: t.Number({
      title: "Response Code",
      examples: [500],
      default: 500,
    }),
    message: t.String({
      title: "Response Message",
      examples: ["Internal Server Error"],
    }),
  });

  export type ResponseInternalError = typeof ResponseInternalError.static;

  export const ResponseValidationError = t.Object({
    code: t.Number({
      title: "Response Code",
      examples: [422],
      default: 422,
    }),
    message: t.String({
      title: "Response Message",
      examples: ["Validation Error"],
    }),
    errors: t.Array(
      t.Object({
        field: t.String({
          title: "Field Name",
          examples: ["name", "email", "page"],
        }),
        error: t.String({
          title: "Error Message",
          examples: ["Property 'page' should be one of: 'numeric', 'number'"],
        }),
      }),
    ),
  });

  export type ResponseValidationError = typeof ResponseValidationError.static;
}
