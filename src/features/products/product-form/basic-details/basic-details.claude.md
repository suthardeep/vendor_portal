Flow

route 
http://localhost:5173/products/product-form/:productId/basic-details

you will get productId in Props
(export const BasicProductDetails = ({ productId }: Props) => {})

use the api useGetCategoryRequirementsQuery present in features/category/api folder and understand the response structure from the types folder inside category folder. and take the mandatoryProductFields and display all these fields at the last of the BasicProductDetails.tsx file in the same UI as made in that file. Make a different section for it named "Additional Mandatory Fields" and display all the fields using Input.tsx and handle their zod validations accordingly, all are compulsory and all are text only fields.

This is the payload to send to the basic-details save api:

{
  "description": "Premium smartphone with advanced features...",
  "bulletPoints": [
    "6.8 inch Dynamic AMOLED display",
    "200MP main camera with AI enhancement",
    "5000mAh battery with 45W fast charging"
  ],
  "mediaUrls": [
    "https://media.aavak.com/products/abc123/image1.jpg",
    "https://media.aavak.com/products/abc123/video1.mp4"
  ],
  "modelNumber": "SM-S928B",
  "modelName": "Galaxy S24 Ultra",
  "isFragile": false,
  "manufacturerName": "Samsung Electronics",
  "packerDetails": "Samsung India Electronics Pvt Ltd, Noida, UP",
  "importerDetails": "Samsung India Electronics Pvt Ltd, Noida, UP",
  "tags": [
    "smartphone",
    "5G",
    "flagship",
    "android"
  ],
  "hsnCode": "85171200",
  "gstRate": 18,
  "cessCode": "CESS001",
  "variants": [
    {
      "targetAge": "20-59",
      "targetGender": "Male",
    }
  ],
  "customFields": [
    {
      "groupName": "Fabric Details",
      "fields": {
        "Fabric Material": "100% Cotton",
        "GSM": "180",
        "Thread Count": "200"
      }
    },
    {
      "groupName": "Care Instructions",
      "fields": {
        "Wash Type": "Machine Wash",
        "Iron Temperature": "Medium"
      }
    }
  ]
}

almost everything is up to date, just some changes : 

1.The variants [] is completely optional , check if product hasVariants or not ( const hasVariants = apiData?.hasVariants ?? false ) , if it has then dont send variants array, if not then send variant array with single object inside it of targetAge and targetGender

2.Remove quantity completely it shouldnt exist anywhere.

3. Display the customFields and store it accordingly and then send the payload exactly as given.

4.There are changes in the productHeader.types.ts file, so read that too in product-form/product-header/types folder and change the BasicDetailsStep.tsx accordingly so that it can manage both state properly (when data is available and is preffiled and also when a total new product arrives where no data is present, handle both efficiently).

5.You can fetch fields from useGetCategoryRequirementsQuery and passing the [apiData?.categories[0]?.id] as arguement to hook and you will get the required fields array. Must analyze the types first , make changes where needed.


If you are stuck or confused then stop in between and ask me the doubt, i will clear it and then only move forward