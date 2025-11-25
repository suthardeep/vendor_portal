import React, { useState } from "react";
import { z } from "zod";
import { FormData } from "./types/registration.types";
import {
  AddressDetailsSchema,
  BusinessDetailsSchema,
  BrandDetailsSchema,
  businessDetailsWithGSTSchema,
  businessDetailsWithoutGSTSchema,
  DocumentsSchema,
  PersonalDetailsSchema,
} from "./schemas/registration.schema";
import PersonalDetailsStep from "./components/PersonalDetailsStep";
import AddressDetailsStep from "./components/AddressDetailsStep";
import BusinessDetailsStep from "./components/business-details/BusinessDetailsStep";
import DocumentsStep from "./components/DocumentsStep";
import RegistrationSidebar, { sidebarSteps } from "./components/RegistrationSidebar";
import { Button } from "@/components/base/Button";
import Icon from "@/components/base/Icon";
import { toast } from "@/components/toast/Sonner";

// ============================================================================
// MAIN REGISTRATION FORM COMPONENT
// ============================================================================

const RegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    personalDetails: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
    },
    addressDetails: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    brandDetails: [],
    businessDetails: {
      hasGST: true,
      gstCertificate: null,
      businessName: "",
      addressLine1: "",
      addressLine2: "",
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
      selfDeclaration: false,
    },
    selfDeclaration: false,
    documents: {
      documents: [],
    },
  });

  const validateStep = (step: number): boolean => {
    try {
      switch (step) {
        case 1:
          if (formData.businessDetails.hasGST) {
            businessDetailsWithGSTSchema.parse(formData.businessDetails);
          } else {
            businessDetailsWithoutGSTSchema.parse(formData.businessDetails);
          }
          break;
        case 2:
          BrandDetailsSchema.parse(formData.addressDetails);
          break;
        case 3:
          PersonalDetailsSchema.parse(formData.personalDetails);
          break;
        case 4:
          DocumentsSchema.parse(formData.documents);
          break;
        default:
          return false;
      }
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`step${step}`];
        return newErrors;
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const stepErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          // toast.error(`Validation error at ${err.path.join(".")}: ${err.message}`);
          const path = err.path.join(".");
          stepErrors[path] = err.message;
        });
        setErrors((prev) => ({ ...prev, [`step${step}`]: stepErrors }));
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (completedSteps.includes(stepId) || stepId === currentStep) {
      setCurrentStep(stepId);
    }
  };

  const handleSkip = () => {
    setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
    setCurrentStep(currentStep + 1);
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      setIsLoading(true);
      try {
        // API call would go here
        console.log("Form Data:", formData);
        // await submitForm(formData);
        alert("Form submitted successfully!");
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsLoading(false);
      }
    }
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
          <PersonalDetailsStep
            data={formData.personalDetails}
            onChange={(data) => setFormData({ ...formData, personalDetails: data })}
            errors={currentStepErrors}
          />
        );
      case 2:
        return (
          <AddressDetailsStep
            data={formData.addressDetails}
            onChange={(data) => setFormData({ ...formData, addressDetails: data })}
            errors={currentStepErrors}
          />
        );
      case 4:
        return (
          <DocumentsStep
            data={formData.documents}
            onChange={(data) => setFormData({ ...formData, documents: data })}
            errors={currentStepErrors}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === sidebarSteps.length;

  return (
    <div className="w-full px-5 py-6 sm:px-6 md:px-8 lg:px-10">
      {/* Heading */}
      <div className="mb-8 sm:mb-10">
        <div className="flex justify-between items-center">
          <h1 className="mb-2 text-base-content text-2xl font-semibold sm:text-3xl md:text-4xl">
            Registration
          </h1>
          {currentStep < sidebarSteps.length && (
            <Button
              onClick={handleSkip}
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
      <div className="w-full max-h-[75%] flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-0 md:w-[30%] overflow-y-auto border-r border-base-content/20">
          <RegistrationSidebar
            currentStep={currentStep}
            onStepClick={handleStepClick}
            completedSteps={completedSteps}
          />
        </div>

        {/* Main Content */}
        <div className="w-full md:w-[70%] overflow-y-auto scroll-fade flex-1 flex flex-col">
          {/* Content Scrollable Area */}
          <div className="">
            <div className="max-w-4xl ml-6 flex-1">{renderStepContent()}</div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="w-full py-4 flex items-center justify-between">
        <div className="w-[30%] pr-2">
          {currentStep > 1 && (
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="filled"
              className="w-full bg-secondary text-secondary-content hover:bg-secondary/90 hover:text-secondary-content/90 active:bg-secondary/90 active:text-secondary-content/90 focus:bg-secondary/90 focus:text-secondary-content/90"
            >
              Previous
            </Button>
          )}
        </div>

        <div className="w-[70%] pl-2">
          <Button
            onClick={isLastStep ? handleSubmit : handleNext}
            isLoading={isLoading}
            loadingText={isLastStep ? "Submitting..." : "Loading..."}
            fullWidth
            // className="w-full"
          >
            {isLastStep ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
