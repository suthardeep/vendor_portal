import { ReactNode } from "react";

interface StatCardProps {
  title: string | number;
  icon: ReactNode;
  subTitle?: string;
}

const StatCard: React.FC<StatCardProps> = (props) => {
  const { title, icon, subTitle } = props;
  // const Icon = icon ? icon : null;

  return (
    <div className="bg-neutral-content/50 border-neutral-content dark:bg-base-3 dark:border-base-3 flex justify-between overflow-hidden rounded-2xl border">
      <div className="px-5 py-3.5">
        <h5 className="text-base-3 dark:text-primary-100 font-semibold">
          {" "}
          {title}{" "}
        </h5>
        {subTitle && (
          <p className="text-base-2 dark:text-neutral-content"> {subTitle} </p>
        )}
      </div>
      {icon && (
        <div className="fall bg-primary-50 dark:bg-primary-600/50 h-full w-20">
          {/* {<Icon className="text-primary-500 dark:text-primary-200" />} */}
          {icon}
        </div>
      )}
    </div>
  );
};

export default StatCard;
