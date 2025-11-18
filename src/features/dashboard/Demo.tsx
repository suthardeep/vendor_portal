import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/base/Input";
import { MobileNumberInput } from "@/components/base/MobileNumberInput";
import { DateTimeInput } from "@/components/base/DateTimeInput";
import { Checkbox } from "@/components/base/Checkbox";
import { OTPInput } from "@/components/base/OTPInput";
import { RadioGroup } from "@/components/base/RadioGroup";
import Dropdown from "@/components/base/DropDown";
import Button2 from "@/components/base/Button2";


// Proper Zod schema with default values
const demoFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required").regex(/^\d{10}$/, "Phone number must be 10 digits"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters").max(12, "Password must be less than 12 characters"),
  date: z.string().min(1, "Date is required").refine(
    (value) => new Date(value) > new Date("2024-01-01"),
    { message: "Date must be after 1st Jan 2024" }
  ),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
  otp: z.string().min(1, "OTP is required").length(6, "OTP must be 6 digits"),
  businessType: z.string().min(1, "Please select a business type"), // No default - user must select
  category: z.string().min(1, "Please select a category"), // No default - user must select
  plan: z.string().min(1, "Please select a plan"), // No default - user must select
  dropdownSingle: z.string().min(1, "Please select an option"), // No default
  dropdownMultiple: z.array(z.string()).min(1, "Please select at least one option"),
  dummyInput: z.string().default(""),
  disabledInput: z.string().default(""),
  successInput: z.string().min(1, "This field is required"),
  numberInput: z.string().regex(/^\d+$/, "Must be a number").default(""),
});

type DemoFormSchema = z.infer<typeof demoFormSchema>;

export const ComponentDemo = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = useForm<DemoFormSchema>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: {
      // Set proper defaults - no null values
      email: "",
      phoneNumber: "", 
      password: "",
      date: "",
      terms: false,
      otp: "",
      businessType: "", // Empty string - user must select
      category: "", // Empty string - user must select  
      plan: "", // Empty string - user must select
      dropdownSingle: "", // Empty string - user must select
      dropdownMultiple: [],
      dummyInput: "",
      disabledInput: "Disabled value",
      successInput: "",
      numberInput: "",
    },
    mode: "onChange", // Validate on change for better UX
  });

  const onSubmit = async (data: DemoFormSchema) => {
    console.log("Form submitted:", data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert("Form submitted successfully!");
  };

  // Proper change handlers for custom components
  const handleRadioChange = (field: keyof DemoFormSchema, value: string) => {
    setValue(field, value);
    trigger(field); // Trigger validation immediately
  };

  const handleDropdownChange = (field: keyof DemoFormSchema, value: any) => {
    setValue(field, value);
    trigger(field);
  };

  const handleCheckboxChange = (field: keyof DemoFormSchema, checked: boolean) => {
    setValue(field, checked);
    trigger(field);
  };

  const handleOTPChange = (value: string) => {
    setValue("otp", value);
    trigger("otp");
  };

  // Watch values
  const formData = watch();

  const dropdownOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3", disabled: true },
    { value: "option4", label: "Option 4" },
  ];

  const businessOptions = [
    { label: "Brand Owner", value: "brand" },
    { label: "Manufacturer", value: "manufacturer" },
    { label: "Importer", value: "importer" },
    { label: "Distributor", value: "distributor" },
  ];

  const categoryOptions = [
    { label: "Electronics", value: "electronics" },
    { label: "Fashion", value: "fashion" },
    { label: "Home & Garden", value: "home" },
    { label: "Sports", value: "sports" },
  ];

  const planOptions = [
    { label: "Free", value: "free" },
    { label: "Pro", value: "pro" },
    { label: "Enterprise", value: "enterprise" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Proper Form Demo
          </h1>
          <p className="text-gray-600">
            With correct state management and validation
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Inputs */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Inputs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                error={errors.email?.message}
              />

              <MobileNumberInput
                label="Phone Number"
                placeholder="Enter your phone number"
                {...register("phoneNumber")}
                error={errors.phoneNumber?.message}
              />

              <Input
                label="Password"
                togglePassword
                placeholder="Enter your password"
                type="password"
                {...register("password")}
                error={errors.password?.message}
              />

              <DateTimeInput
                label="Select Date"
                type="date"
                {...register("date")}
                error={errors.date?.message}
              />
            </div>
          </div>

          {/* Checkbox */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Terms & Conditions</h2>
            
            <Checkbox
              label={
                <>
                  I agree to the{" "}
                  <a href="/terms" className="text-primary underline">
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-primary underline">
                    Privacy Policy
                  </a>
                </>
              }
              checked={formData.terms}
              onChange={(checked) => handleCheckboxChange("terms", checked)}
              error={errors.terms?.message}
              required
            />
          </div>

          {/* OTP Input */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">OTP Verification</h2>
            
            <OTPInput 
              label="Verify Mobile Number"
              phoneNumber="+91 98765 43210"
              length={6}
              onValueChange={handleOTPChange}
              onComplete={(value) => console.log("OTP Complete:", value)}
              error={errors.otp?.message}
            />
          </div>

          {/* Radio Groups - REQUIRED FIELDS */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Selections</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RadioGroup
                name="businessType"
                label="Nature of Business *"
                options={businessOptions}
                value={formData.businessType}
                onValueChange={(value) => handleRadioChange("businessType", value)}
                error={errors.businessType?.message}
                required
              />

              <RadioGroup
                name="category"
                label="Product Category *"
                options={categoryOptions}
                value={formData.category}
                orientation="vertical"
                onValueChange={(value) => handleRadioChange("category", value)}
                error={errors.category?.message}
                required
              />

              <RadioGroup
                name="plan"
                label="Subscription Plan *"
                options={planOptions}
                value={formData.plan}
                onValueChange={(value) => handleRadioChange("plan", value)}
                error={errors.plan?.message}
                required
              />
            </div>
          </div>

          {/* Dropdowns */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Dropdowns</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dropdown
                label="Single Select *"
                placeholder="Choose an option"
                options={dropdownOptions}
                value={formData.dropdownSingle}
                onChange={(value) => handleDropdownChange("dropdownSingle", value)}
                error={errors.dropdownSingle?.message}
                searchable
              />

              <Dropdown
                label="Multi Select *"
                placeholder="Choose multiple options"
                options={dropdownOptions}
                value={formData.dropdownMultiple}
                onChange={(value) => handleDropdownChange("dropdownMultiple", value)}
                error={errors.dropdownMultiple?.message}
                multiple
                searchable
              />
            </div>
          </div>

          {/* Additional Inputs */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Inputs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Optional Field"
                extraLabel="Optional"
                extraLabelPosition="top-right"
                {...register("dummyInput")}
              />

              <Input
                label="Disabled Field"
                disabled
                value="Pre-filled disabled value"
                {...register("disabledInput")}
              />

              <Input
                label="Required Field *"
                success={!errors.successInput && formData.successInput.length > 0}
                extraLabel={!errors.successInput && formData.successInput.length > 0 ? "Valid" : "Required"}
                extraLabelPosition="top-right"
                {...register("successInput")}
                error={errors.successInput?.message}
              />

              <Input
                label="Number Only"
                type="number"
                extraLabel="Digits only"
                extraLabelPosition="top-right"
                {...register("numberInput")}
                error={errors.numberInput?.message}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Button2
                theme={['gray-500', 'white']}
                type="button"
                onClick={() => reset()}
                disabled={isSubmitting}
              >
                Reset Form
              </Button2>

              <Button2
                theme={['primary-500', 'white']}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Form"}
              </Button2>
            </div>
          </div>
        </form>

        {/* Debug Info */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Form State</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Current Values:</h3>
              <pre className="bg-gray-100 p-3 rounded overflow-auto">
                {/* {JSON.stringify(formData, null, 2)} */}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Validation Errors:</h3>
              <pre className="bg-red-50 p-3 rounded overflow-auto">
                {/* {JSON.stringify(errors, null, 2)} */}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default ComponentDemo