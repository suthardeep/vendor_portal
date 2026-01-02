import { genderOptions } from "@/constants/genderOptions";
import z from "zod";
const genderEnum = genderOptions.map((option) => option.value);

export const genderSchema = (optional: boolean = true) => {
  return z.preprocess(
    (value) => {
      if (value === "" || value === undefined || value === null) {
        return undefined;
      }
      return value;
    },
    optional ? z.enum(genderEnum).optional() : z.enum(genderEnum)
  );
};
