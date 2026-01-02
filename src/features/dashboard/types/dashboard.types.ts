export interface RecentTransaction {
    productName:string;
    amount: number;
    date: string;
    status: "delivered" | "delivery-update"
}

export interface TopProductsSold {
    productImage:string;
    productName: string;
    unitsSold: number;
    price: number;
}