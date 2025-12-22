In the PricingAndShipping.tsx file, The Header is ok , but he UI below it is not ,
these are the changes for UI : 
A single variant section will have 3 levels (vertically arranged)

The First row is header , dont change it

The second row is The Input Fields :
now note that this section will also be divided into 2 sections 
left section w-3/4 (Title: Pricing Details) : 
    - with fields like mrp, selling price , aavan coins, local cost, regional cost and national cost in a grid with 3 columns and 2 rows
right section w-1/4 (Title: Shipment Data) :
    - with fields like Height, width, length, weight

The 3rd level which is invisible but will be visible once View Settlement price is clicked or when save and next button is click. 
 - it will display fields like On Local, On Regional, On National and User gets fields in a 2 row 2 column format. just like how the input fields are shown. 
  - These 3rd level will also have a button "View Breakdown" clicking on which will open the BreakdownDialog and that BreakdownDialog will then display a tabular structure to display various fields of Local , regional and national .
   - Local regional national are 3 table headers (Horizontally on top most row) and there will be fields like selling Price, Customer's charge for shipping, Fees and taxes, TDS/TCS, Shipping charges, praised avavak coins ; and Settlement Price at last making calculation of all the above things ; which will act like the left most table header in a column . 
   - You main task is to generate randome data everytime for all these fields , DOnt pass any data as of now to this dialog and let it generate random data and display things accoringly. 
   - Make sure the tabular form looks good and it looks like a professional breakdown of money and charges.
   - use theme of primary and base , for bg use base-1 and maybe body-content and primary for texts (eg: text-primary, bg-base-1)


- now note that there is no need of settlement data here as of now, as we are generating it randomly in BreakdownDialog. so we dont really need {/* Settlement Prices Section */}
      {showSettlementSection && settlementPrices.length > 0  ...}
    as of now. 

Also when clicking save and submit button each 3rd level of each variant will be visble right in their respective section. and display fields like On Local, On Regional, On National and User gets .

here just make sure that UI looks extremely professional and you dont have to chnage the parent change only the variant section. 

ALso please remove the unusded types from pricing-and-shipping folder and remove the unused zod validations as well as it makes the code look messy, i will give you the response of each api properly so just do everything accorindgly.

1. get product by id 
response : 
{
    "statusCode": 200,
    "message": "Resource retrieved successfully",
    "data": {
        "id": "adb27b36-835f-471d-84ec-2f67c8d16608",
        "name": "TestProduct-2",
        "categoryId": "631c04c3-a776-49cc-87c6-35db0f862ee1",
        "externalSku": "SKU-Random-1234",
        "attributes": null,
        "hasVariants": true,
        "hasBrand": false,
        "brandName": null,
        "brandId": null,
        "brandLogo": null,
        "categoryPath": [
            "Clothing",
            "Clothing",
            "Clothing"
        ],
        "vendorId": "e1135d61-1a7d-4c4e-a816-27e552f778a2",
        "createdByAdminId": null,
        "createdBy": "vendor",
        "description": "Proper Description of Product -2",
        "bulletPoints": [
            "Point 1",
            "Point 2",
            "Point 3"
        ],
        "mediaUrls": [
            "https://aavak-media.s3.ap-south-1.amazonaws.com/test-2/1765363751896-n0dpu0.png",
            "https://aavak-media.s3.ap-south-1.amazonaws.com/new-folder/1765348021154-97ceqe.png",
            "https://aavak-media.s3.ap-south-1.amazonaws.com/new-folder/1765348021154-60zgtd.png"
        ],
        "modelNumber": "model-number-1",
        "modelName": "model-name-1",
        "isFragile": true,
        "manufacturerName": "Mann Jasmatia",
        "packerDetails": "Yash Mishra",
        "importerDetails": "Siddhant Kotak",
        "tags": [
            "Summer Collection",
            "Men Clothes",
            "Winter Sale"
        ],
        "hsnCode": "1243",
        "gstRate": 18,
        "cessCode": "cess-code-123",
        "targetAge": "18-35",
        "targetGender": "Female",
        "quantity": 23,
        "approvedAt": null,
        "approvedBy": null,
        "rejectedAt": null,
        "rejectedBy": null,
        "rejectionReason": null,
        "rejectedFields": null,
        "adminNotes": null,
        "status": "under_review",
        "createdAt": "2025-12-22T00:29:30.064Z",
        "updatedAt": "2025-12-22T07:49:06.000Z",
        "variants": [
            {
                "id": "3f15aadc-6264-42cf-a84d-dbee8f4dd39c",
                "aavakSku": "AAVK-ADB27B36--RED-8C0U",
                "sellerSku": "SKU-XS-COL-123",
                "attributes": {
                    "size": "XS",
                    "color": "#EF4444"
                },
                "targetAge": "21",
                "targetGender": "Female",
                "quantity": 0,
                "mrp": "1999.00",
                "sellingPrice": "1499.00",
                "aavakCoinsPrice": 10,
                "eanUpc": "0123456789123",
                "description": "Variant-1 Description",
                "mediaUrls": [
                    "https://aavak-media.s3.ap-south-1.amazonaws.com/new-folder/1765348021154-97ceqe.png",
                    "https://aavak-media.s3.ap-south-1.amazonaws.com/new-folder/1765348021154-d5wwai.png"
                ],
                "deliveryCharges": {
                    "local": {
                        "cost": 50,
                        "unitDelivered": 1
                    },
                    "national": {
                        "cost": 150,
                        "unitDelivered": 1
                    },
                    "regional": {
                        "cost": 100,
                        "unitDelivered": 1
                    }
                },
                "dimensions": {
                    "width": 25,
                    "height": 5,
                    "length": 30,
                    "weight": 0.3
                },
                "isActive": true,
                "createdAt": "2025-12-22T00:48:54.997Z",
                "updatedAt": "2025-12-22T07:51:20.000Z"
            },
            {
                "id": "aeebab1e-4038-46de-bc6b-a2eee60c5407",
                "aavakSku": "AAVK-ADB27B36--RED-UJKD",
                "sellerSku": "SKU-S-EF-123",
                "attributes": {
                    "size": "S",
                    "color": "#EF4444"
                },
                "targetAge": "23",
                "targetGender": "Male",
                "quantity": 0,
                "mrp": "532.00",
                "sellingPrice": "332.00",
                "aavakCoinsPrice": 67,
                "eanUpc": "0123456789123",
                "description": "Variant-2 Description",
                "mediaUrls": [
                    "https://aavak-media.s3.ap-south-1.amazonaws.com/test-3/1766354078397-ilyown.png",
                    "https://aavak-media.s3.ap-south-1.amazonaws.com/test-3/1766354078396-pt59af.png"
                ],
                "deliveryCharges": {
                    "local": {
                        "cost": 20,
                        "unitDelivered": 1
                    },
                    "national": {
                        "cost": 40,
                        "unitDelivered": 1
                    },
                    "regional": {
                        "cost": 30,
                        "unitDelivered": 1
                    }
                },
                "dimensions": {
                    "width": 34,
                    "height": 45,
                    "length": 12,
                    "weight": 56
                },
                "isActive": true,
                "createdAt": "2025-12-22T00:48:55.008Z",
                "updatedAt": "2025-12-22T07:51:20.000Z"
            }
        ]
    }
}


2. get variants 
response: {
    "statusCode": 200,
    "message": "Resource retrieved successfully",
    "data": {
        "productId": "adb27b36-835f-471d-84ec-2f67c8d16608",
        "productName": "TestProduct-2",
        "variants": [
            {
                "id": "3f15aadc-6264-42cf-a84d-dbee8f4dd39c",
                "aavakSku": "AAVK-ADB27B36--RED-8C0U",
                "sellerSku": "SKU-XS-COL-123",
                "attributes": {
                    "size": "XS",
                    "color": "#EF4444"
                },
                "targetAge": "21",
                "targetGender": "Female",
                "quantity": 0,
                "eanUpc": "0123456789123",
                "description": "Variant-1 Description",
                "mediaUrls": [
                    "https://aavak-media.s3.ap-south-1.amazonaws.com/new-folder/1765348021154-97ceqe.png",
                    "https://aavak-media.s3.ap-south-1.amazonaws.com/new-folder/1765348021154-d5wwai.png"
                ],
                "mrp": "1999.00",
                "sellingPrice": "1499.00",
                "aavakCoinsPrice": 10,
                "deliveryCharges": {
                    "local": {
                        "cost": 50,
                        "unitDelivered": 1
                    },
                    "national": {
                        "cost": 150,
                        "unitDelivered": 1
                    },
                    "regional": {
                        "cost": 100,
                        "unitDelivered": 1
                    }
                },
                "dimensions": {
                    "width": 25,
                    "height": 5,
                    "length": 30,
                    "weight": 0.3
                },
                "calculatedPricing": {
                    "onLocal": 1949,
                    "onRegional": 1899,
                    "onNational": 1849,
                    "userGets": 10
                },
                "isActive": true,
                "createdAt": "2025-12-22T00:48:54.997Z",
                "updatedAt": "2025-12-22T07:51:20.000Z"
            },
            {
                "id": "aeebab1e-4038-46de-bc6b-a2eee60c5407",
                "aavakSku": "AAVK-ADB27B36--RED-UJKD",
                "sellerSku": "SKU-S-EF-123",
                "attributes": {
                    "size": "S",
                    "color": "#EF4444"
                },
                "targetAge": "23",
                "targetGender": "Male",
                "quantity": 0,
                "eanUpc": "0123456789123",
                "description": "Variant-2 Description",
                "mediaUrls": [
                    "https://aavak-media.s3.ap-south-1.amazonaws.com/test-3/1766354078397-ilyown.png",
                    "https://aavak-media.s3.ap-south-1.amazonaws.com/test-3/1766354078396-pt59af.png"
                ],
                "mrp": "532.00",
                "sellingPrice": "332.00",
                "aavakCoinsPrice": 67,
                "deliveryCharges": {
                    "local": {
                        "cost": 20,
                        "unitDelivered": 1
                    },
                    "national": {
                        "cost": 40,
                        "unitDelivered": 1
                    },
                    "regional": {
                        "cost": 30,
                        "unitDelivered": 1
                    }
                },
                "dimensions": {
                    "width": 34,
                    "height": 45,
                    "length": 12,
                    "weight": 56
                },
                "calculatedPricing": {
                    "onLocal": 512,
                    "onRegional": 502,
                    "onNational": 492,
                    "userGets": 67
                },
                "isActive": true,
                "createdAt": "2025-12-22T00:48:55.008Z",
                "updatedAt": "2025-12-22T07:51:20.000Z"
            }
        ]
    }
}

3. PATCH pricing update api 
payload : 
{
  "variants": [
    {
      "variantId": "aeebab1e-4038-46de-bc6b-a2eee60c5407",
      "mrp": 199900,
      "sellingPrice": 149900,
      "aavakCoinsPrice": 1000,
      "localCost": 5000,
      "regionalCost": 10000,
      "nationalCost": 15000,
      "dimensions": {
        "length": 30,
        "width": 25,
        "height": 5,
        "weight": 0.3
      }
    }
  ]
}

response :
{
  "statusCode": 200,
  "message": "Variant pricing updated successfully",
  "data": {
    "variantsUpdated": 1,
    "variants": [
      {
        "id": "aeebab1e-4038-46de-bc6b-a2eee60c5407",
        "aavakSku": "AAVK-ADB27B36--RED-UJKD",
        "sellerSku": "SKU-S-EF-123",
        "attributes": {
          "size": "S",
          "color": "#EF4444"
        },
        "mrp": 199900,
        "sellingPrice": 149900,
        "aavakCoinsPrice": 1000,
        "deliveryCharges": {
          "local": {
            "unitDelivered": 1,
            "cost": 5000
          },
          "regional": {
            "unitDelivered": 1,
            "cost": 10000
          },
          "national": {
            "unitDelivered": 1,
            "cost": 15000
          }
        },
        "dimensions": {
          "length": 30,
          "width": 25,
          "height": 5,
          "weight": 0.3
        },
        "calculatedSettlement": {
          "platformFee": 2998,
          "closingFee": 50,
          "referralFee": 7495,
          "vendorPayout": 139357
        }
      }
    ]
  }
}

4. variant/:variantId/price-breakdown
response : 
{
  "statusCode": 200,
  "message": "Variant pricing updated successfully",
  "data": {
    "variantsUpdated": 1,
    "variants": [
      {
        "id": "aeebab1e-4038-46de-bc6b-a2eee60c5407",
        "aavakSku": "AAVK-ADB27B36--RED-UJKD",
        "sellerSku": "SKU-S-EF-123",
        "attributes": {
          "size": "S",
          "color": "#EF4444"
        },
        "mrp": 199900,
        "sellingPrice": 149900,
        "aavakCoinsPrice": 1000,
        "deliveryCharges": {
          "local": {
            "unitDelivered": 1,
            "cost": 5000
          },
          "regional": {
            "unitDelivered": 1,
            "cost": 10000
          },
          "national": {
            "unitDelivered": 1,
            "cost": 15000
          }
        },
        "dimensions": {
          "length": 30,
          "width": 25,
          "height": 5,
          "weight": 0.3
        },
        "calculatedSettlement": {
          "platformFee": 2998,
          "closingFee": 50,
          "referralFee": 7495,
          "vendorPayout": 139357
        }
      }
    ]
  }
} (see if you can use this api in any way in BreakdownDialog just make sure that the code deosnt break on runtime, not mandatory)


- Please clean code from the pricing-and-shipping folder and variations folder . try to follow DRY as much as possible, if you define variants interface somewhere then use it at other places too. Remove useless things and try to reuse interfaces as much as you can.

also when using variants , if you see that productDetails's variants are needed here , just simply. dont and if only some data is helpful from that api then just use it in some other way, try to keep code clean as much as possible. (like calculatedPricing thing, it depends on 2 things productDetails.variants and normal variant data, see if one can handle everything)


ALso note that when the View Settlement Price button is clicked for some variant then make a call to backend on route products/variants/pricing creating a single item array of variant and passing it to the payload as per the given payload above. and show shimmer till this is happening and then show the Fetched data for that particular Variant in the 3rd level accordingly keeping the response in mind. 