import Image from "@/components/base/Image";
import { Outlet } from "@tanstack/react-router";
import authBg from "@/assets/auth/bg-left.png";

export default function AuthLayout() {
  return (
    <div className="h-screen w-screen relative flex justify-around">
      <div className=" w-full h-[45dvh]">
        <Image
          src={authBg}
          alt="Authentication Background"
          className="object-cover"
          width={"45dvw"}
          height={"100dvh"}
        />
      </div>

      <div className="relative ">
        <Outlet />
      </div>
    </div>
  );
}
