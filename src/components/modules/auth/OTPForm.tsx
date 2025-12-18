"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { AlertCircleIcon } from "lucide-react";

import { OTPSchema } from "@/lib/validations";
import {
  Button,
  FieldDescription,
  Alert,
  AlertDescription,
  AlertTitle,
  Spinner,
} from "@/components/ui";
import TextShimmer from "@/components/ui/dev/text-shimmer";
import { FormInputOTP } from "@/components/form";

type OTPFormValues = z.infer<typeof OTPSchema>;

interface OTPFormProps {
  onSubmit: (data: OTPFormValues) => Promise<ActionResponse>;
  successMessage?: string;
}

const OTPForm = ({
  onSubmit,
  successMessage = "Email verified successfully!",
}: OTPFormProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleSubmit = async (data: OTPFormValues) => {
    setError(null);
    const response = await onSubmit(data);

    if (response?.success) {
      toast.success("Success", {
        description: successMessage,
      });

      router.refresh();
    } else {
      setError(response?.error?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <form
      id="otp-form"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="mt-6 space-y-6"
    >
      <FormInputOTP name="otp" control={form.control}>
        <FieldDescription className="text-dark500_light400 pg-regular text-center">
          Enter the 6-digit code sent to your email
        </FieldDescription>
      </FormInputOTP>

      {!!error && (
        <Alert
          variant="destructive"
          className="bg-destructive/10 border-destructive/20 border"
        >
          <AlertCircleIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="primary-gradient pg-semibold text-light-900 hover:primary-gradient-hover min-h-10 w-full"
      >
        {form.formState.isSubmitting && (
          <Spinner className="border-primary-foreground/30 border-t-primary-foreground!" />
        )}
        {form.formState.isSubmitting ? (
          <TextShimmer duration={1} className="text-loading!">
            Verifying...
          </TextShimmer>
        ) : (
          "Verify"
        )}
      </Button>
    </form>
  );
};

export default OTPForm;
