
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
  BusinessDetailsType,
  BrandDetailsType,
  BankDetailsType, // Used for the mutation data type
} from "./schemas/registration.schema";
import { useBankDetailsRegistration, useBrandDetailsRegistration, useBusinessRegistrationMutation, useSubmitVerification } from "./api/queryHooks"; 
import BusinessDetailsStep from "./components/business-details/BusinessDetailsStep";
import BrandDetailsStep, { initialBrandState } from "./components/brand-details/BrandDetailsStep";
import BankDetailsStep from "./components/bank-details/BankDetailsStep";
import RegistrationSidebar from "./components/RegistrationSidebar";

import { Button } from "@/components/base/Button";
import {Icon} from "@/components/base/Icon";
import { showValidationErrors } from "@/utils/helpers";
import DeclarationStep from "./components/declaration/DeclarationStep";
import { toast } from "@/components/toast/Sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { prefillFormFromProfile } from "./utils/prefillFormData";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { ROUTES } from "@/constants/routes";


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



const BusinessRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, any>>({});
  
  // Get user data from auth store for prefilling
  const { user , setAuth } = useAuthStore();



  
  // 1. INITIALIZE ALL MUTATION HOOKS
  const businessMutation = useBusinessRegistrationMutation();
  const brandMutation= useBrandDetailsRegistration();
  const bankMutation = useBankDetailsRegistration();
  const verificationMutation = useSubmitVerification();

  // 2. DEFINE AGGREGATE LOADING STATE
  const isSaving = useMemo(() => {
    return (
      businessMutation.isPending ||
      brandMutation.isPending ||
      bankMutation.isPending ||
      verificationMutation.isPending
    );
  }, [
    businessMutation.isPending,
    brandMutation.isPending,
    bankMutation.isPending,
    verificationMutation.isPending,
  ]);
    
  // NOTE: Previous individual loading states (isLoading, isBrandMutationLoading, etc.) have been removed.


  const { step, tab } = Route.useSearch();
  const navigate = useNavigate();

  const queryClient = useQueryClient()

  useEffect(() => {
    setCurrentStep(step);
  }, [step]);

  // Update completed steps based on profile onboarding data
  useEffect(() => {
    if (user?.onboarding?.steps) {
      const completedStepNumbers = user.onboarding.steps
        .filter(step => step.completed)
        .map(step => {
          // Map API step numbers to form step numbers
          switch (step.step) {
            case 2: return 1; // Business Details -> Step 1
            case 3: return 2; // Brand Details -> Step 2  
            case 4: return 3; // Bank Details -> Step 3
            case 5: return 4; // Declaration -> Step 4
            default: return null;
          }
        })
        .filter(stepNum => stepNum !== null) as number[];
      
      setCompletedSteps(completedStepNumbers);
      console.log('✅ [PREFILL] Set completed steps:', completedStepNumbers);
    }
  }, [user?.onboarding?.steps]);

  // Initialize form data - prefill from profile if available
  const [formData, setFormData] = useState<FormData>(() => {
    if (user && user.businessDetails) {
      return prefillFormFromProfile(user);
    }
    
    return {
      businessDetails: {
        hasGST: true,
        gstNumber: "",
        gstCertificateId: "",
        gstCertificate: "",
        businessName: "",
        addressLine1: "",
        addressLine2: "",
        pinCode: "",
        city: "",
        state: "",
        panCardId: "",
        panCard: "",
        registrationCertificateId: "",
        registrationCertificate: "",
        authorisedPersonName: "",
        authorisedPersonEmail: "",
        authorisedPersonPhoneNumber: "",
        authorisedPersonPanCardId: "",
        authorisedPersonPanCard: "",
        authorisedPersonAadharCardId: "",
        authorisedPersonAadharCard: "",
        selfDeclared: false,
      },
      brandDetails: [initialBrandState],
      bankDetails: {
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
        bankProofDocumentId: "",
        bankProofDocument: "",
      },
      declaration: {
        agreed: false,
      },
    };
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
            // Validates all required non-GST fields
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

        showValidationErrors(stepErrors);
      }
      return false;
    }
  };

  // API CALLS
  const saveStepData = async (step: number) => {
    try {
      if (step === 1) {
        await businessMutation.mutateAsync(formData.businessDetails as BusinessDetailsType);
      } else if(step==2) {

        console.log("brabd" ,formData.brandDetails)
        await brandMutation.mutateAsync(formData.brandDetails as BrandDetailsType)

      }else if(step == 3){
        await bankMutation.mutateAsync(formData.bankDetails as BankDetailsType)
      }else if(step==4){
          await verificationMutation.mutateAsync()
            .then(() => {
                setAuth({
              ...user!,
              verificationStatus:'under_review'
              
            });

             queryClient.invalidateQueries({ queryKey: ['profile'] });

             navigate({
              to:ROUTES.DASHBOARD
             })
               
            })
            .catch((error) => {
              console.error("Verification mutation failed:", error);
            });

      }

      return true;
    } catch (error) {
      console.error("Error saving step data:", error);
      return false;
    }
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      const success = await saveStepData(currentStep);
      if (success) {
        setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
        if (currentStep < steps.length) {
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
    if(!(completedSteps.includes(1) && completedSteps.includes(2) && completedSteps.includes(3))){
      toast.error("Please complete all the steps before submitting.")
      return;
    }
    if (validateStep(currentStep)) {
      try {
        // Ensure the final step's API call is made
        const success = await saveStepData(currentStep);

        if(success){
            // Mocked successful post-submission logic
            console.log("Final submission successful.");
            toast.success("Registration Successful!");
        }

        const businessDetails = formData.businessDetails;
        
        // Build base payload
        const backendPayload: any = {
          // STEP 1: BUSINESS DETAILS
          businessDetails: {
            name: businessDetails.businessName,
            addressLine1: businessDetails.addressLine1,
            addressLine2: businessDetails.addressLine2,
            pinCode: businessDetails.pinCode,
            city: businessDetails.city,
            state: businessDetails.state,
            panCard: businessDetails.panCard,
            panCardId: businessDetails.panCardId,
            registrationCertificate: businessDetails.registrationCertificate,
            registrationCertificateId: businessDetails.registrationCertificateId,
          },
          authorisedPersonDetails: {
            name: businessDetails.authorisedPersonName,
            mobileNumber: businessDetails.authorisedPersonPhoneNumber,
            email: businessDetails.authorisedPersonEmail,
            panCard: businessDetails.authorisedPersonPanCard,
            panCardId: businessDetails.authorisedPersonPanCardId,
            aadharCard: businessDetails.authorisedPersonAadharCard,
            aadharCardId: businessDetails.authorisedPersonAadharCardId,
          },
          // You would typically include other steps' data here as well:
          // brandDetails: formData.brandDetails,
          // bankDetails: formData.bankDetails,
          // declaration: formData.declaration,
        };

        // Only include GST fields if hasGST is true
        if (businessDetails.hasGST) {
          backendPayload.gstNumber = businessDetails.gstNumber;
          backendPayload.gstCertificate = businessDetails.gstCertificate;
          backendPayload.gstCertificateId = businessDetails.gstCertificateId;
        } else {
          // Include selfDeclared only for non-GST flow
          backendPayload.selfDeclared = businessDetails.selfDeclared;
        }

        console.log("Final Backend Payload (for reference):", backendPayload);

      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Final submission failed.");
      }
    }
  };

  const handleSkip = () => {
    // setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
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
              disabled={isSaving}
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
      <div className="w-full pt-4 border-t border-base-content/10 flex items-center justify-between bg-base-1 z-10">
        <div className="w-[30%] pr-4">
          {currentStep > 1 && (
            <Button
              onClick={handlePrevious}
              variant="filled"
              className="w-full bg-secondary text-secondary-content hover:bg-secondary/80"
              disabled={isSaving}
            >
              Previous
            </Button>
          )}
        </div>

        <div className="w-[70%]">
          <Button
            onClick={isLastStep ? handleSubmit : handleNext}
            isLoading={isSaving}
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
