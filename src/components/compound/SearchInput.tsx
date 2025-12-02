import { useEffect, type Dispatch, type SetStateAction } from "react";
import { Input } from "../base/Input";
import {Icon} from "../base/Icon";

interface SearchInputProps {
  defaultVal?: string;
  val: string;
  setVal: Dispatch<SetStateAction<string>>;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = (props) => {
  const { setVal, val, defaultVal, placeholder } = props;

  useEffect(() => {
    if (defaultVal && defaultVal.trim().length > 0) {
      setVal(defaultVal);
    }
  }, []);

  return (
    <Input
      leftElement={<Icon name="SearchIcon" size={16} strokeWidth={1} />}
      placeholder={placeholder || "Search"}
      value={val}
      onChange={(e) => setVal(e.target.value)}
    />
  );
};

export default SearchInput;
