import { Button } from "@/components/base/Button";
import {Image}  from "@/components/base/Image";
import { Input } from "@/components/base/Input";
import React, { useState } from "react";
import logo from "@/assets/logo1.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <>
      {/* Header section with logo and tagline */}
      <div className="w-full flex flex-col items-start justify-start px-5 py-6 sm:px-6 md:px-8 lg:px-10">
        {/* Logo */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <Image src={logo} alt="Aavak Logo" className="h-auto w-32 sm:w-32 md:w-40" />
        </div>

        {/* Content Container */}
        <div className="w-full">
          {/* Heading */}
          <div className="mb-8 sm:mb-10">
            <h1 className="mb-2 text-base-content text-2xl font-semibold sm:text-3xl md:text-4xl">Log In</h1>
            <p className="text-sm sm:text-[16px] font-normal text-body-content">
              Establish your business and connect with millions throughout India.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6 sm:space-y-8">
            {/* Email Input */}
            <div>
              <Input
                type="email"
                label="Email ID"
                placeholder="Enter email"
                variant="outlined"
                inputSize="md"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">Password</label>
              </div>
              <Input
                type="password"
                placeholder="Enter password"
                variant="outlined"
                inputSize="md"
                fullWidth
                togglePassword
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="mt-2 flex justify-end">
                <Button
                  as="link"
                  href="#"
                  variant="ghost"
                  size="sm"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Forgot Password?
                </Button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              variant="filled"
              size="lg"
              color="primary"
              fullWidth
              isLoading={isLoading}
              loadingText="Logging in..."
              className="mt-8"
            >
              Login
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            <span className="text-sm text-gray-700 sm:text-base">Don't have an account?</span>
            <Button
              as="link"
              href="#"
              variant="ghost"
              size="sm"
              className="text-sm font-semibold sm:text-base"
            >
              Register Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
