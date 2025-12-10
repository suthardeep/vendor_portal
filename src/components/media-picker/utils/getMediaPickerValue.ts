import { MinimalMediaProps } from "../types/media.types";

export type MediaValue = string | string[] | undefined | null;

export const getMediaPickerValue = (id: MediaValue, s3Url: MediaValue): MinimalMediaProps[] => {
  const uncleanedIds = id;
  const uncleanedUrls = s3Url;

  // if both values are null return empty array
  if (!uncleanedIds && !uncleanedUrls) {
    console.log("here 1");
    return [];
  }

  if (typeof uncleanedIds === "string" && typeof uncleanedUrls === "string") {
    console.log("Here: 1.1")
    return [
      {
        id: uncleanedIds,
        s3Url: uncleanedUrls,
      },
    ];
  }

  // if array is returned for ids and s3url , then return a clean array of MinimalMediaProps
  if (Array.isArray(uncleanedIds) && Array.isArray(uncleanedUrls)) {
    console.log("here 2");
    if (!uncleanedIds.length || !uncleanedUrls.length) {
      console.log("here 3");
      return [];
    }

    const maxLen = Math.max(uncleanedIds?.length || 0, uncleanedUrls?.length || 0);
    const result: { id: string; s3Url: string }[] = [];

    for (let i = 0; i < maxLen; i++) {
      const id = uncleanedIds?.[i] ?? "";
      const s3Url = uncleanedUrls?.[i] ?? "";
      // include only if both of the values exists
      if (id && s3Url) result.push({ id, s3Url });
    }
    console.log("here 4");
    return result;
  }
  console.log("here 5", id, s3Url);
  // if any other case return empty array
  return [];
};
