import React, { useState, useMemo, useEffect } from "react";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/_auth/business-registration";
import { FormData, SidebarStep } from "./types/registration.types";
import {
  BankDetailsSchema,
  BrandDetailsSchema,
  // BusinessDetailsSchema,
  businessDetailsWithGSTSchema,
  businessDetailsWithoutGSTSchema,
  DeclarationSchema,
} from "./schemas/registration.schema";

// Component Imports
import BusinessDetailsStep from "./components/business-details/BusinessDetailsStep";
import BrandDetailsStep, { initialBrandState } from "./components/brand-details/BrandDetailsStep";
import BankDetailsStep from "./components/bank-details/BankDetailsStep";
import RegistrationSidebar from "./components/RegistrationSidebar";

import { Button } from "@/components/base/Button";
import {Icon} from "@/components/base/Icon";
import { showValidationErrors } from "@/utils/helpers";
import DeclarationStep from "./components/declaration/DeclarationStep";

// ============================================================================
// STATIC STEPS CONFIG
// ============================================================================
const BASE_STEPS: SidebarStep[] = [
  { id: 1, title: "Business Details", description: "Your business information", icon: "TriangleDash" },
  { id: 2, title: "Brand Details", description: "Your brand information", icon: "Gem" },
  { id: 3, title: "Bank Details", description: "Your bank information", icon: "CreditCard" },
];

const DECLARATION_STEP: SidebarStep = {
  id: 4,
  title: "Declaration",
  description: "Final agreement",
  icon: "FileInfo",
};

// // ============================================================================
// // Fetching Step number from step number
// // ============================================================================

// const getStepNumber = (stepName: number) => {
//   switch (stepName) {
//     case "business-details":
//       return 1;
//     case "brand-details":
//       return 2;
//     case "bank-details":
//       return 3;
//     case "declaration":
//       return 4;
//     default:
//       return 1;
//   }
// };

// ============================================================================
// MAIN REGISTRATION FORM COMPONENT
// ============================================================================

const BusinessRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { step, tab } = Route.useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentStep(step);
  }, [step]);

  const [formData, setFormData] = useState<FormData>({
    businessDetails: {
      hasGST: true,
      gstCertificate: null,
      businessName: "",
      addressLine1: "",
      addressLine2: "", //optional
      pinCode: "",
      city: "",
      state: "",
      panCard: null,
      businessRegistrationCertificate: null,
      gstNumber: "",
      authorisedPersonName: "",
      authorisedPersonEmail: "",
      authorisedPersonPhoneNumber: "",
      authorisedPersonPanCard: null,
      authorisedPersonAadharCard: null,
      selfDeclaration: false, // Used only if hasGST is false
    },
    brandDetails: [initialBrandState],
    bankDetails: {
      bankAccountNumber: "",
      ifscCode: "",
      accountHolderName: "",
      cancellationProof: null,
    },
    declaration: {
      agreed: false, // Used if hasGST is true (Step 4)
    },
  });

  useEffect(() => {
    switch (tab) {
      case "with-gst":
        setFormData({ ...formData, businessDetails: { ...formData.businessDetails, hasGST: true } });
        break;
      case "without-gst":
        setFormData({ ...formData, businessDetails: { ...formData.businessDetails, hasGST: false } });
        break;
      default:
        setFormData({ ...formData, businessDetails: { ...formData.businessDetails, hasGST: true } });
    }
  }, [tab]);

  // Dynamic Sidebar Steps based on GST selection
  const steps = useMemo(() => {
    if (formData.businessDetails.hasGST) {
      return [...BASE_STEPS, DECLARATION_STEP];
    }
    return BASE_STEPS;
  }, [formData.businessDetails.hasGST]);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    navigate({ to: ".", search: { step } });
  };

  const validateStep = (step: number): boolean => {
    try {
      setErrors({}); // Clear previous errors

      switch (step) {
        case 1:
          if (formData.businessDetails.hasGST) {
            businessDetailsWithGSTSchema.parse(formData.businessDetails);
          } else {
            businessDetailsWithoutGSTSchema.parse(formData.businessDetails);
          }
          break;
        case 2:
          BrandDetailsSchema.parse(formData.brandDetails);
          break;
        case 3:
          BankDetailsSchema.parse(formData.bankDetails);
          break;
        case 4:
          if (formData.businessDetails.hasGST) {
            DeclarationSchema.parse(formData.declaration);
          }
          break;
        default:
          return false;
      }

      // If parse successful
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const stepErrors: Record<string, any> = {};

        error.issues.forEach((err) => {
          const path = err.path;

          // Handling Array errors (Brand Details)
          if (step === 2 && typeof path[0] === "number") {
            const index = path[0];
            const field = path[1];
            if (!stepErrors[index]) stepErrors[index] = {};
            stepErrors[index][field] = err.message;
          } else {
            // Flat object errors
            const fieldName = path.join(".");
            stepErrors[fieldName] = err.message;
          }
        });

        setErrors((prev) => ({ ...prev, [`step${step}`]: stepErrors }));

        // Optional: Show toast for visibility
        showValidationErrors(stepErrors);
      }
      return false;
    }
  };

  // API CALLS (Mock)
  const saveStepData = async (step: number) => {
    setIsLoading(true);
    try {
      // Simulate API call based on step
      await new Promise((resolve) => setTimeout(resolve, 800));

      // if(step === 1) await apiService.post('/register/business', formData.businessDetails);
      // if(step === 2) await apiService.post('/register/brand', formData.brandDetails);
      // etc...

      return true;
    } catch (e) {
      console.error(e);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      const success = await saveStepData(currentStep);
      if (success) {
        setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
        if (currentStep < 4) {
          handleStepChange(currentStep + 1);
        }
        // window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      handleStepChange(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    // Allow navigation to completed steps or current step
    if (completedSteps.includes(stepId) || stepId === currentStep) {
      handleStepChange(stepId);
    }
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      setIsLoading(true);
      try {
        // Final Submission Logic
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("Final Form Data:", formData);
        alert("Registration Successful!");
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSkip = () => {
    setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
    handleStepChange(currentStep + 1);
  };

  const currentStepErrors = errors[`step${currentStep}`] || {};

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessDetailsStep
            data={formData.businessDetails}
            onChange={(data) => setFormData({ ...formData, businessDetails: data })}
            errors={currentStepErrors}
          />
        );
      case 2:
        return (
          <BrandDetailsStep
            data={formData.brandDetails}
            onChange={(data) => setFormData({ ...formData, brandDetails: data })}
            errors={currentStepErrors}
          />
        );
      case 3:
        return (
          <BankDetailsStep
            data={formData.bankDetails}
            onChange={(data) => setFormData({ ...formData, bankDetails: data })}
            errors={currentStepErrors}
          />
        );
      case 4:
        // Only rendered if hasGST is true
        return (
          <DeclarationStep
            data={formData.declaration}
            onChange={(data) => setFormData({ ...formData, declaration: data })}
            errors={currentStepErrors}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === steps.length;

  return (
    <div className="w-full px-5 py-6 sm:px-6 md:px-8 lg:px-10 flex flex-col">
      {/* Heading */}
      <div className="mb-6 shrink-0">
        <div className="flex justify-between items-center">
          <h1 className="mb-1 text-base-content text-2xl font-semibold sm:text-3xl">Registration</h1>
          {currentStep < steps.length && (
            <Button
              onClick={handleSkip} // Skip essentially validates and moves next in dev usually, but here behaves as Next
              variant="ghost"
              className="text-base-content/80 text-base flex gap-2"
              disabled={isLoading}
            >
              Skip
              <Icon name="ChevronsRight" className="text-base text-base-content/80" />
            </Button>
          )}
        </div>
        <p className="text-sm sm:text-base font-normal text-body-content">
          Establish your business and connect with millions throughout India.
        </p>
      </div>

      {/* Middle Section */}
      <div className="w-full max-h-[75%] flex flex-1 md:gap-8">
        {/* Sidebar */}
        <div className="w-0 md:w-[28%] lg:w-[30%] overflow-y-auto border-r border-base-content/20 pr-4 hidden md:block">
          <RegistrationSidebar
            currentStep={currentStep}
            onStepClick={handleStepClick}
            completedSteps={completedSteps}
            steps={steps}
          />
        </div>

        {/* Main Content */}
        <div className="w-full md:w-[70%]  overflow-y-auto scroll-fade flex flex-col pb-4">
          <div className="w-full max-w-4xl flex-1">
            {/* Step Title Mobile Only */}
            <div className="md:hidden mb-4 font-semibold text-lg text-primary">
              Step {currentStep}: {steps.find((s) => s.id === currentStep)?.title}
            </div>
            {renderStepContent()}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="w-full pt-4 mt-auto border-t border-base-content/10 flex items-center justify-between bg-base-1 z-10">
        <div className="w-[30%] pr-4">
          {currentStep > 1 && (
            <Button
              onClick={handlePrevious}
              variant="filled"
              className="w-full bg-secondary text-secondary-content hover:bg-secondary/80"
              disabled={isLoading}
            >
              Previous
            </Button>
          )}
        </div>

        <div className="w-[70%]">
          <Button
            onClick={isLastStep ? handleSubmit : handleNext}
            isLoading={isLoading}
            loadingText={isLastStep ? "Submitting..." : "Saving..."}
            fullWidth
            color="primary"
          >
            {isLastStep ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistrationForm;
