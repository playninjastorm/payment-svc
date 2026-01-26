import { Static, t, TSchema } from "elysia";

export namespace CommonDTO {
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
}
