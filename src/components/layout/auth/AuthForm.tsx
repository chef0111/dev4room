"use client";

import { useState } from "react";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Controller,
  DefaultValues,
  FieldValues,
  Path,
  Resolver,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import Link from "next/link";

import routes from "@/common/constants/routes";
import { AUTH_FORM_TYPES } from "@/common/constants";
import { formatFieldName } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import TextShimmer from "@/components/ui/text-shimmer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";

type AuthFormType = keyof typeof AUTH_FORM_TYPES;

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T, FieldValues>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResponse>;
  formType: AuthFormType;
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<T>) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema) as Resolver<T>,
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    setError(null);
    const response = (await onSubmit(data)) as ActionResponse;

    if (response?.success) {
      const successMessage = AUTH_FORM_TYPES[formType].successMessage;

      toast.success("Success", {
        description: successMessage,
      });

      if (formType === "LOGIN") {
        router.push(routes.home);
        router.refresh();
      } else if (formType === "RESET_PASSWORD") {
        router.push(routes.login);
        router.refresh();
      }
    } else {
      setError(response?.error?.message || "Something went wrong");
    }
  };

  const formConfig = AUTH_FORM_TYPES[formType];

  return (
    <form
      id="auth-form"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-6 mt-6"
    >
      <FieldGroup>
        {Object.keys(defaultValues).map((fieldName) => (
          <Controller
            key={fieldName}
            name={fieldName as Path<T>}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex-between w-full">
                  <FieldLabel
                    htmlFor={`auth-form-${fieldName}`}
                    className="flex-grow pg-medium"
                  >
                    {formatFieldName(fieldName)}
                  </FieldLabel>

                  {fieldName === "password" && formType === "LOGIN" && (
                    <Link
                      href={routes.forgotPassword}
                      className="ml-auto inline-block text-sm text-link-100 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  )}
                </div>
                <Input
                  {...field}
                  id={`auth-form-${fieldName}`}
                  type={
                    fieldName === "password" || fieldName === "confirmPassword"
                      ? "password"
                      : "text"
                  }
                  placeholder={
                    fieldName === "confirmPassword"
                      ? "Confirm your password"
                      : `Enter your ${fieldName}`
                  }
                  className="pg-regular light-border-2 bg-light900_dark300 text-dark300_light700 min-h-10 border"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        ))}
      </FieldGroup>

      {!!error && (
        <Alert
          variant="destructive"
          className="bg-destructive/10 border border-destructive/20"
        >
          <AlertCircleIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="text-wrap">
            {error}
            {error === "Invalid email or password" && ". Please try again."}
          </AlertDescription>
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
            {formConfig.loadingLabel}
          </TextShimmer>
        ) : (
          formConfig.buttonLabel
        )}
      </Button>
    </form>
  );
};

export default AuthForm;
