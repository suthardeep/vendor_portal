import { getFileType, getMimeType } from "@/utils/helpers";
import { MinimalMediaProps } from "../types/media.types";

export const createMinimalMediaItem = (items: MinimalMediaProps[])=>{
    if(!items.length){
        return []
    }
    return items.map((i:MinimalMediaProps, index:number)=>{
        return {
            id: i.id,
            originalName: `file-${index}`,
            fileName: `file-${index}`,
            s3Url: i.s3Url,
            mimeType: getMimeType(i.s3Url),
            fileSize: '200',
            type: getFileType(i.s3Url),
            group: "group",
            uploadedBy: "vendor",
            uploaderType: "vendor",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    })
}