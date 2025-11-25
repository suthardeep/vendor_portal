import Image from "@/components/base/Image";
import { Outlet } from "@tanstack/react-router";
import authBg from "@/assets/auth/bg-left.png";

export default function AuthLayout() {
  return (
    <div className="h-screen w-screen relative flex ">
      <div className="xl:block hidden h-[45dvh]">
        <Image
          src={authBg}
          alt="Authentication Background"
          className="object-cover"
          width={"45dvw"}
          height={"100dvh"}
        />
      </div>

      <div className="relative w-full h-screen">
        <div className="w-full h-screen flex justify-center items-center">
          <div className="flex w-[90%] max-h-[95dvh] bg-base-1 rounded-2xl shadow-md ">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
