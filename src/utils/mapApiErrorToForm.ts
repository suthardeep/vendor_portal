// import type { ApiErrorShape } from "@/api/apiService";
// import type { UseFormSetError } from "react-hook-form";

// export function mapApiErrorsToForm<T extends Record<string, any>>(
//   err: ApiErrorShape | any,
//   setError: UseFormSetError<T>,
//   fallbackField?: keyof T
// ) {
//   if (!err) return;

//   if (Array.isArray(err?.errors) && err.errors.length) {
//     for (const e of err.errors) {
//       if (e.field) {
//         setError(e.field as keyof T, {
//           type: "server",
//           message: e.message,
//         });
//       }
//     }
//     return;
//   }

//   if (fallbackField) {
//     setError(fallbackField, {
//       type: "server",
//       message: err?.message ?? "Something went wrong",
//     });
//   }
// }
