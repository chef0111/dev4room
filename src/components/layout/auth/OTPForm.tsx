"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2Icon, AlertCircleIcon } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { OTPSchema } from "@/lib/validations";
import routes from "@/common/constants/routes";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TextShimmer from "@/components/ui/text-shimmer";

type OTPFormValues = z.infer<typeof OTPSchema>;

interface OTPFormProps {
  onSubmit: (data: OTPFormValues) => Promise<ActionResponse>;
  successMessage?: string;
  redirectTo?: string;
}

const OTPForm = ({
  onSubmit,
  successMessage = "Email verified successfully!",
  redirectTo = routes.home,
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

      router.push(redirectTo);
      router.refresh();
    } else {
      setError(response?.error?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <form
      id="otp-form"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-6 mt-6"
    >
      <FieldGroup>
        <Controller
          name="otp"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-col items-center gap-2.5"
            >
              <div className="flex flex-col items-center gap-2.5">
                <InputOTP
                  {...field}
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  className="justify-center"
                  aria-invalid={fieldState.invalid}
                >
                  <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                    <InputOTPSlot index={0} className="input-otp-slot" />
                    <InputOTPSlot index={1} className="input-otp-slot" />
                  </InputOTPGroup>
                  <InputOTPSeparator className="max-xs:hidden" />
                  <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                    <InputOTPSlot index={2} className="input-otp-slot" />
                    <InputOTPSlot index={3} className="input-otp-slot" />
                  </InputOTPGroup>
                  <InputOTPSeparator className="max-xs:hidden" />
                  <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                    <InputOTPSlot index={4} className="input-otp-slot" />
                    <InputOTPSlot index={5} className="input-otp-slot" />
                  </InputOTPGroup>
                </InputOTP>
                <FieldDescription className="text-center text-dark500_light400 pg-regular">
                  Enter the 6-digit code sent to your email
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </div>
            </Field>
          )}
        />
      </FieldGroup>

      {!!error && (
        <Alert
          variant="destructive"
          className="bg-destructive/10 border border-destructive/20"
        >
          <AlertCircleIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="primary-gradient pg-semibold min-h-10 w-full text-light-900 hover:primary-gradient-hover transition-all cursor-pointer"
      >
        {form.formState.isSubmitting && (
          <Loader2Icon className="animate-spin" />
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
