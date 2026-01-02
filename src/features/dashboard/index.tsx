import ChartsSection from "./components/ChartsSection";
import RecentTransactionTable from "./components/RecentTransaction";
import StatsCardSection from "./components/StatsCardSection";
import TopProductsSoldTable from "./components/TopProductsSoldTable";

const ordersData = [
  { month: "Jan", "2024": 12, "2023": -15 },
  { month: "Feb", "2024": 2, "2023": -20 },
  { month: "Mar", "2024": 8, "2023": -10 },
  { month: "Apr", "2024": 24, "2023": -15 },
  { month: "May", "2024": 12, "2023": -8 },
  { month: "Jun", "2024": 6, "2023": -18 },
  { month: "Jul", "2024": 5, "2023": -12 },
];

const salesData = [
  { day: "Mon", sales: 290 },
  { day: "Tue", sales: 350 },
  { day: "Wed", sales: 480 },
  { day: "Thu", sales: 420 },
  { day: "Fri", sales: 550 },
  { day: "Sat", sales: 480 },
  { day: "Sun", sales: 320 },
];

export default function Dashboard() {
  return (
    <div className="relative flex flex-col gap-4 w-full">
      <StatsCardSection />
      <ChartsSection ordersData={ordersData} salesData={salesData} />
      <div className="w-full flex gap-4 ">
          <div className="w-1/2">
            <RecentTransactionTable/>
          </div>
          <div className="w-1/2">
            <TopProductsSoldTable/>
          </div>
      </div>
    </div>
  );
}
