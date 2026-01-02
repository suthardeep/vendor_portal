import { MinimalMediaProps } from "../types/media.types";

export type MediaValue = string | string[] | undefined | null;

export const getMediaPickerValue = (s3Url: MediaValue): MinimalMediaProps[] => {
  // const uncleanedIds = id;
  const uncleanedUrls = s3Url;

  // if both values are null return empty array
  if (!uncleanedUrls) {
    return [];
  }

  if (typeof uncleanedUrls === "string") {
    return [
      {
        id: uncleanedUrls,
        s3Url: uncleanedUrls,
      },
    ];
  }

  // if array is returned for ids and s3url , then return a clean array of MinimalMediaProps
  if ( Array.isArray(uncleanedUrls)) {
    if (!uncleanedUrls.length) {
      return [];
    }

    const result: { id: string; s3Url: string }[] = [];

    for (let i = 0; i < uncleanedUrls.length; i++) {
      const id = uncleanedUrls?.[i] ?? "";
      const s3Url = uncleanedUrls?.[i] ?? "";
      // include only if both of the values exists
      if (id && s3Url) result.push({ id, s3Url });
    }
    return result;
  }
  // if any other case return empty array
  return [];
};
