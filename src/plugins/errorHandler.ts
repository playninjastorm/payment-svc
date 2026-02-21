import Elysia from "elysia";

import { ServiceError } from "@/commons/utils/errors.utils";

function isEnumSchema(schema: any): boolean {
  if (!schema) return false;

  // Caso 1: enum clásico
  if (Array.isArray(schema.enum)) return true;

  // Caso 2: union de literales
  const variants = schema.anyOf ?? schema.oneOf;
  return (
    Array.isArray(variants) &&
    variants.length > 0 &&
    variants.every((v) => typeof v?.const !== "undefined")
  );
}

function getEnumValues(schema: any): string[] {
  if (Array.isArray(schema.enum)) return schema.enum;

  const variants = schema.anyOf ?? schema.oneOf ?? [];
  return variants.map((v: any) => v.const).filter(Boolean);
}

export const errorHandler = () => {
  return new Elysia({ name: "error-handler" })
    .error({
      ServiceError,
    })
    .onError({ as: "global" }, ({ code, error, set }) => {
      if (code === "ServiceError") {
        set.status = error.statusCode || 400;
        return {
          code: set.status,
          message: error.message,
        };
      }

      if (code === "VALIDATION") {
        let code = 400;
        let message = "Internal error";

        if (
          error.type == "query" ||
          error.type == "params" ||
          error.type == "body"
        ) {
          code = 422;
          message = "Validation Error";
        }

        if (error.type == "response") {
          code = 400;
          message = "Response Validation Error";
        }

        set.status = code;

        const errors = error.all.map((err: any) => {
          const field = err.path.slice(1).replaceAll("/", ".");
          let errorMsg = err.summary;

          if (isEnumSchema(err.schema)) {
            const enumValues = getEnumValues(err.schema);
            errorMsg = `Expected one of: ${enumValues.join(", ")}`;
          }

          return {
            field,
            error: errorMsg,
          };
        });

        return {
          code,
          message,
          errors,
        };
      }

      if (code === "NOT_FOUND") {
        set.status = 404;
        return {
          code: set.status,
          message: "The requested resource was not found",
        };
      }

      set.status = 500;
      return {
        code: set.status,
        message: "Internal Server Error",
      };
    });
};
