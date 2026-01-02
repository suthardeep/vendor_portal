import { PaginationMeta } from "@/types/baseApi";
import { RecentTransaction, TopProductsSold } from "../types/dashboard.types";

export const recentTransactionsMockData: RecentTransaction[] = [
  { productName: "Blue Yeti USB Microphone", amount: 9896, date: "2025-12-21", status: "delivered" },
  {
    productName: "HyperX QuadCast Gaming Microphone",
    amount: 11249,
    date: "2025-12-20",
    status: "delivery-update",
  },
  { productName: "Rode NT-USB Mini Microphone", amount: 8199, date: "2025-12-20", status: "delivered" },
  { productName: "Audio-Technica AT2020 USB+", amount: 13999, date: "2025-12-19", status: "delivery-update" },
  { productName: "FIFINE K669B USB Microphone", amount: 3199, date: "2025-12-19", status: "delivered" },
  { productName: "Elgato Wave:3 USB Microphone", amount: 13749, date: "2025-12-18", status: "delivered" },
  {
    productName: "Maono AU-A04 Condenser Microphone",
    amount: 4599,
    date: "2025-12-18",
    status: "delivery-update",
  },
  { productName: "Logitech C922 Pro Stream Webcam", amount: 7499, date: "2025-12-17", status: "delivered" },
  {
    productName: "Razer Seiren X USB Microphone",
    amount: 8999,
    date: "2025-12-17",
    status: "delivery-update",
  },
  { productName: "Sony MDR-7506 Studio Headphones", amount: 7999, date: "2025-12-16", status: "delivered" },
  { productName: "Boya M1 Lavalier Microphone", amount: 799, date: "2025-12-16", status: "delivered" },
  {
    productName: "Samson Meteor USB Microphone",
    amount: 6999,
    date: "2025-12-15",
    status: "delivery-update",
  },
  { productName: "JBL Quantum 100 Gaming Headset", amount: 2499, date: "2025-12-15", status: "delivered" },
  { productName: "Corsair HS50 Pro Headset", amount: 4299, date: "2025-12-14", status: "delivered" },
  {
    productName: "SteelSeries Arctis 1 Headset",
    amount: 5999,
    date: "2025-12-14",
    status: "delivery-update",
  },
  { productName: "Logitech G Pro X Headset", amount: 12999, date: "2025-12-13", status: "delivered" },
  {
    productName: "Sennheiser HD 280 Pro Headphones",
    amount: 8999,
    date: "2025-12-13",
    status: "delivery-update",
  },
  { productName: "AKG P120 Condenser Microphone", amount: 6499, date: "2025-12-12", status: "delivered" },
  {
    productName: "Focusrite Scarlett Solo Audio Interface",
    amount: 11499,
    date: "2025-12-12",
    status: "delivery-update",
  },
  { productName: "Zoom H1n Portable Recorder", amount: 9499, date: "2025-12-11", status: "delivered" },
];

export const metaMock: PaginationMeta = {
  currentPage: 1,
  pageSize: 5,
  totalPages: 2,
  totalRows: 20,
  currentRows: 5,
  hasNextPage: true,
  hasPrevPage: false,
};

export const topProductsSoldMockData: TopProductsSold[] = [
  {
    productName: "Blue Yeti USB Microphone",
    unitsSold: 120,
    price: 9896,
    productImage: "https://picsum.photos/seed/blueyeti/200/200",
  },
  {
    productName: "HyperX QuadCast Gaming Microphone",
    unitsSold: 95,
    price: 11249,
    productImage: "https://picsum.photos/seed/hyperxquadcast/200/200",
  },
  {
    productName: "Rode NT-USB Mini Microphone",
    unitsSold: 180,
    price: 8199,
    productImage: "https://picsum.photos/seed/rodentusbmini/200/200",
  },
  {
    productName: "Audio-Technica AT2020 USB+",
    unitsSold: 60,
    price: 13999,
    productImage: "https://picsum.photos/seed/at2020usb/200/200",
  },
  {
    productName: "Elgato Wave:3 USB Microphone",
    unitsSold: 75,
    price: 13749,
    productImage: "https://picsum.photos/seed/elgatowave3/200/200",
  },
  {
    productName: "FIFINE K669B USB Microphone",
    unitsSold: 300,
    price: 3199,
    productImage: "https://picsum.photos/seed/fifinek669b/200/200",
  },
  {
    productName: "Maono AU-A04 Condenser Microphone",
    unitsSold: 220,
    price: 4599,
    productImage: "https://picsum.photos/seed/maonoa04/200/200",
  },
  {
    productName: "Logitech C922 Pro Stream Webcam",
    unitsSold: 140,
    price: 7499,
    productImage: "https://picsum.photos/seed/logitechc922/200/200",
  },
  {
    productName: "Razer Seiren X USB Microphone",
    unitsSold: 85,
    price: 8999,
    productImage: "https://picsum.photos/seed/razersx/200/200",
  },
  {
    productName: "Focusrite Scarlett Solo Audio Interface",
    unitsSold: 50,
    price: 11499,
    productImage: "https://picsum.photos/seed/focusritesolo/200/200",
  },
];
