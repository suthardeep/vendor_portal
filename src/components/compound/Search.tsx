import { Search as SearchIcon } from "lucide-react";
import { Input } from "../base/Input";

interface SearchProps {
  placeholder?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const Search: React.FC<SearchProps> = ({ placeholder, setValue, value }) => {
  return (
    <Input
      leftElement={<SearchIcon size={18} strokeWidth={1} />}
      placeholder={placeholder || "Search"}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default Search;
