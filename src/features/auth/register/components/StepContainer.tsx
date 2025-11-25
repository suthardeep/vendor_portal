import { StepContainerProps } from "../types/registration.types";

const StepContainer: React.FC<StepContainerProps> = ({
  // title,
  // description,
  children,
}) => {
  return (
    <div className="">
      {/* <div>
        <h2 className="text-2xl md:text-3xl font-bold text-base-content">{title}</h2>
        {description && (
          <p className="text-sm md:text-base text-body-content mt-2">{description}</p>
        )}
      </div> */}
      {children}
    </div>
  );
};

export default StepContainer;