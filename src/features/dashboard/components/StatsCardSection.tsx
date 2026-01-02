import { StatsCard } from "@/components/base/StatsCard";

const StatsCardSection = () => {
  return (
    <div className="flex justify-around gap-4">
      <StatsCard
        title="Total Orders"
        value="42.3K"
        subtitle="Recurring Revenue"
        percentage={52}
        trend="decrease"
        iconName="Package"
        iconBgColor="bg-error"
        iconColor="text-base-1"
      />
      <StatsCard
        title="Today's Orders"
        value="50.7K"
        subtitle="Recurring Revenue"
        percentage={52}
        trend="increase"
        iconName="Package"
        iconBgColor="bg-warning"
        iconColor="text-base-1"
      />
      <StatsCard
        title="Pending Orders"
        value="32.4K"
        subtitle="One-Time Revenue"
        percentage={52}
        trend="increase"
        iconName="Package"
        iconBgColor="bg-warning"
        iconColor="text-base-1"
      />
      <StatsCard
        title="Inventory "
        value="56.4K"
        subtitle="Loss In Revenue"
        percentage={52}
        trend="increase"
        iconName="Package"
        iconBgColor="bg-warning"
        iconColor="text-base-1"
      />
    </div>
  );
};

export default StatsCardSection;
