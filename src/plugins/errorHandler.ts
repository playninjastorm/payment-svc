import Elysia from "elysia";

export const errorHandler = () => {
  return new Elysia({ name: "error-handler" }).onError(
    { as: "global" },
    ({ code, error, set }) => {
      if (code === "VALIDATION") {
        let code = 400;
        let message = "Internal error";

        if (error.type == "query" || error.type == "params") {
          code = 422;
          message = "Validation Error";
        }

        if (error.type == "response") {
          code = 400;
          message = "Response Validation Error";
        }

        set.status = code;

        const errors = error.all.map((err: any) => ({
          field: err.path.slice(1).replaceAll("/", "."),
          error: err.summary,
        }));

        return {
          code,
          message,
          errors,
        };
      }

      // TODO: Custom messages errors

      set.status = 500;
      return {
        error: "Internal Server Error",
        message: "Internal Server Error",
      };
    },
  );
};
