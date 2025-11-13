import * as LucideIcons from "lucide-react";

interface StatCardProps {
  title: string | number;
  icon: keyof typeof LucideIcons;
  subTitle?: string;
}

const StatCard: React.FC<StatCardProps> = (props) => {
  const { title, icon, subTitle } = props;
  const Icon = icon ? (LucideIcons[icon] as LucideIcons.LucideIcon) : null;

  return (
    <div className="bg-nl-50/50 border-nl-200 dark:bg-nd-700 dark:border-nd-500 flex justify-between overflow-hidden rounded-2xl border">
      <div className="px-5 py-3.5">
        <h5 className="text-nl-700 dark:text-pd-100 font-semibold">
          {" "}
          {title}{" "}
        </h5>
        {subTitle && (
          <p className="text-nl-400 dark:text-nd-200"> {subTitle} </p>
        )}
      </div>
      {Icon && (
        <div className="fall bg-pl-50 dark:bg-pd-600/50 h-full w-20">
          {<Icon className="text-pl-500 dark:text-pd-200" />}
        </div>
      )}
    </div>
  );
};

export default StatCard;
