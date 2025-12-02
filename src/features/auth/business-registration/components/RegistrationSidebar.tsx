import { cn } from "@/utils/helpers";
import { RegistrationSidebarProps } from "../types/registration.types";
import {Icon} from "@/components/base/Icon";

const RegistrationSidebar: React.FC<RegistrationSidebarProps> = ({
  currentStep,
  onStepClick,
  completedSteps,
  steps, // Now receiving steps as prop
}) => {
  return (
    <div className="hidden md:flex flex-col w-full md:w-[64%] lg:w-[72%]">
      <div className="flex flex-col gap-1">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;

          return (
            <button
              key={step.id}
              onClick={() => {
                if (isCompleted || isCurrent) {
                  onStepClick(step.id);
                }
              }}
              disabled={!isCompleted && !isCurrent}
              className={cn(
                "w-full flex items-center gap-3 p-2 pl-0 rounded-lg transition-all duration-200 text-left",
                isCompleted
                    ? "text-disabled-content/50 cursor-pointer"
                    : "text-base-content cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-md shrink-0 font-semibold",
                  isCurrent
                    ? "bg-primary text-white"
                    : isCompleted
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary/10 text-base-content"
                )}
              >
                <Icon name={step.icon} size={24} className="" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="md:text-base ">{step.title}</p>
                {/* <p className="text-xs opacity-75 truncate hidden lg:block">{step.description}</p> */}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RegistrationSidebar;