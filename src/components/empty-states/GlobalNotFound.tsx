import { Button } from "@/components/base/Button";
import { ROUTES } from "@/constants/routes";
import { DarkGraphic, Graphic } from "./NotFound";
import { Link } from "@tanstack/react-router";

interface GlobalNotFoundProps {
  error?: Error;
}

const GlobalNotFound: React.FC<GlobalNotFoundProps> = ({ error }) => {
  console.log(error?.stack);

  return (
    <div className="fall flex h-dvh w-full flex-col gap-y-1">
      <div className="fall max-w-xs">
        <div className="block dark:hidden">
          <Graphic />
        </div>
        <div className="hidden dark:block">
          <DarkGraphic />
        </div>
      </div>
      <h6 className="text-nl-600 dark:text-nd-200"> {error?.message || ""} </h6>
      <Link to={ROUTES.DASHBOARD} className="mt-4">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
};

export default GlobalNotFound;
