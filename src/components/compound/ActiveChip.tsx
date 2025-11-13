import Chip from "../base/Chip";
import Label from "../base/Label";

interface ActiveChipProps {
  isActive: boolean;
  label?: string;
  activeLabelName?: string;
  inactiveLabelName?: string;
}

const ActiveChip: React.FC<ActiveChipProps> = (props) => {
  const { isActive, label, activeLabelName, inactiveLabelName } = props;

  const chipLabel = isActive
    ? activeLabelName || "True"
    : inactiveLabelName || "False";

  const chipContent = (
    <Chip label={chipLabel} color={isActive ? "green" : "red"} />
  );

  if (label) {
    return (
      <div>
        <Label className="mb-1"> {label} </Label>
        {chipContent}
      </div>
    );
  }
  return chipContent;
};

export default ActiveChip;
