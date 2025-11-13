import {
  findOptionByValue,
  Select,
  type SelectOnChangeVal,
  type SelectOption,
} from "@/components/base/Select";
import type { Uploader } from "@/types/uploader.types";
import { useEffect } from "react";

interface MediaUploaderSelectProps {
  defaultSelected?: string;
  selected: SelectOption;
  setSelected: React.Dispatch<React.SetStateAction<SelectOption>>;
}

const MediaUploaderSelect: React.FC<MediaUploaderSelectProps> = (props) => {
  const { selected, setSelected, defaultSelected } = props;

  const handleChange = (val: SelectOnChangeVal) => {
    setSelected(val as SelectOption);
  };

  useEffect(() => {
    if (defaultSelected) {
      const found = findOptionByValue(options, defaultSelected);
      if (found) {
        setSelected(found);
      }
    }
  }, []);

  return (
    <Select
      options={options}
      value={selected}
      onChange={handleChange}
      placeholder="Select Uploader"
      width={120}
    />
  );
};

export default MediaUploaderSelect;

const options: SelectOption<Uploader>[] = [
  { label: "Customer", value: "customer" },
  { label: "Seller Owner", value: "seller_owner" },
  { label: "Seller Staff", value: "seller_staff" },
  { label: "Rider", value: "rider" },
  { label: "Staff", value: "staff" },
];
