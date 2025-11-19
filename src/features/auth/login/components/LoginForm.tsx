import { useLogin } from "../hooks/useLogin";
import { Input } from "@/components/base/Input";
// import { Button } from "@/components/base/Button";
import { MobileNumberInput } from "@/components/base/MobileNumberInput";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    errors,
    // isSubmitting,
    onSubmit,
    // isPending,
  } = useLogin();

  return (
    <div className="flex h-dvh bg-gray-50 overflow-scroll">
      {/* Left Panel - Form */}
      <div className="flex h-full w-full flex-col justify-center items-center px-6 py-10 md:w-2/3 lg:w-1/2 lg:px-24">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-3xl font-semibold text-gray-900">
            Welcome Back 👋
          </h2>
          <p className="text-gray-600 mt-2">
            Log in to access your account
          </p>

          <form
            className="mt-8 grid gap-y-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              error={errors.email?.message}
              isVerified={true}
              showStatus={true}
              unverifiedText="Verification needed"
              verifiedText="Verified"

              

            />

            <MobileNumberInput
            label="Phone Number"
            placeholder="Enter your phone number"
            type="text"
            {...register("phoneNumber")}
              
            error={errors.phoneNumber?.message}



            ></MobileNumberInput>
            <Input
              label="Password"
              togglePassword
              placeholder="Enter your password"
              type="password"
              {...register("password")}
              error={errors.password?.message}
            />

            <Input
            label="Dummy Input"
            extraLabel="Extra"
            extraLabelPosition="top-right"
            ></Input>

             <Input
            label="Dummy Input"
            extraLabel="Extra"
            extraLabelPosition="bottom-right"
            ></Input>


             <Input
            label="Dummy Input"
            extraLabel="Extra"
            extraLabelPosition="bottom-left"
            ></Input>

             <Input
            label="Dummy Input"
            disabled={true}
          
            ></Input>


             <Input
            label="Dummy Input"
            extraLabel="Extra"
            extraLabelPosition="top-right"
            ></Input>


             <Input
            label="Dummy Input"
            success={true}
                 extraLabel="Extra"
            extraLabelPosition="top-right"




            

          
            ></Input>




              <Input
            label="Dummy Input"
            type="number"
            extraLabel="Extra"
            extraLabelPosition="top-right"
            ></Input>


               
{/* <RadioGroup name="size" options={[...]} size="sm" />
<RadioGroup name="size" options={[...]} size="lg" /> */}


{/* <Demo></Demo> */}





            


            {/* <div className="flex justify-end">
              <a
                href="#"
                className="text-sm text-indigo-600 hover:underline font-medium"
              >
                Forgot password?
              </a>
            </div>
            <Button2
            theme={['primary-500', 'white']}
            type="submit"
            >
              Login
            </Button2> */}
          </form>

          {/* <Demo></Demo> */}


     


          
          <p className="text-sm text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-indigo-600 font-medium hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>

      <div className="hidden md:flex h-full w-1/3 lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/login-pattern.svg')] opacity-10 bg-cover bg-center"></div>
        <div className="relative z-10 text-white text-center px-6">
          <h3 className="text-3xl font-bold mb-3">Your Dashboard Awaits</h3>
          <p className="text-white/90">
            Manage your projects, insights, and analytics — all in one place.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;




