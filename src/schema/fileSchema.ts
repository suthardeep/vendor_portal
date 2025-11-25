import z from "zod";

/**
 * 
 * @param message - error message
 * @param nullable - whether the file can be null (default: true)
 * @returns zod schema for file validation
 */
export const fileSchema = (message: string = 'File is required', nullable: boolean = true) => {
    const instance = z.instanceof(File);

    if(nullable) {
        return z.nullable(instance).refine((f: File | null) => f !== null && f.size > 0, message);
    }

    return instance.refine((f: File) => f.size > 0, message);
}