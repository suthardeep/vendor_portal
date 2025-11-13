import { OrderStatus } from "@/features/orders/types";
import Select, {
  findOptionByValue,
  type CustomSelectProps,
  type SelectOption,
} from "../base/Select";

interface OrderStatusSelectProps {
  value: OrderStatus | undefined;
  onChange: (value: OrderStatus | undefined) => void;
  error?: string;
  label?: string;
  variant?: CustomSelectProps["variant"];
}

const OrderStatusSelector: React.FC<OrderStatusSelectProps> = (props) => {
  const { value, onChange, error, label, variant } = props;

  const selected =
    value !== undefined
      ? findOptionByValue(ORDER_STATUS_OPTIONS, value)
      : undefined;

  return (
    <Select
      placeholder="Status"
      options={ORDER_STATUS_OPTIONS}
      onChange={(option) =>
        onChange((option as SelectOption<OrderStatus>).value)
      }
      value={selected}
      error={error}
      label={label}
      variant={variant}
    />
  );
};

export default OrderStatusSelector;

const ORDER_STATUS_OPTIONS: SelectOption<OrderStatus>[] = [
  { label: "Initiated", value: OrderStatus.initiated },
  { label: "Payment Confirmed", value: OrderStatus.payment_confirmed },
  { label: "Payment Error", value: OrderStatus.payment_error },
  { label: "Cancelled", value: OrderStatus.cancelled },
  { label: "Preparing", value: OrderStatus.preparing },
  { label: "Ready to Pickup", value: OrderStatus.ready_to_pickup },
  { label: "On the Way", value: OrderStatus.on_the_way },
  { label: "Delivered", value: OrderStatus.delivered },
];
