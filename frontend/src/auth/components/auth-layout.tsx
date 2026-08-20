import { Outlet } from "react-router";

import { Atmosphere } from "@/app/components/theme";
import AuthImage from "@/shared/assets/images/authLayout.jpg";

export default function AuthLayout() {
  return (
    <div className="auth-shell relative flex h-dvh w-dvw">
      <Atmosphere />
      <div className="relative z-10 w-[50%] hidden md:flex py-[40px] pl-[40px]">
        <img
          src={AuthImage}
          alt="Auth"
          className="rounded-[50px] object-cover w-full"
        />
      </div>
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center">
        <div className="flex flex-col gap-[48px] lg:w-[400px] w-full p-5 lg:p-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
