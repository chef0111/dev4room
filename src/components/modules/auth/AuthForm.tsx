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

import { AUTH_FORM_TYPES } from "@/common/constants";
import { formatFieldName } from "@/lib/utils";
import { toast } from "sonner";
import {
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Alert,
  AlertDescription,
  AlertTitle,
  Spinner,
} from "@/components/ui";
import { TextShimmer } from "@/components/ui/dev";
import { AlertCircleIcon } from "lucide-react";

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
        router.push("/");
        router.refresh();
      } else if (formType === "RESET_PASSWORD") {
        router.push("/login");
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
      className="mt-6 space-y-6"
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
                    className="pg-medium grow"
                  >
                    {formatFieldName(fieldName)}
                  </FieldLabel>

                  {fieldName === "password" && formType === "LOGIN" && (
                    <Button
                      variant="link"
                      className="text-link-100 ml-auto inline-block size-fit p-0 text-sm"
                      asChild
                    >
                      <Link href="/forgot-password">Forgot your password?</Link>
                    </Button>
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
          className="bg-destructive/10 border-destructive/20 border"
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
        className="primary-gradient pg-semibold text-light-900 hover:primary-gradient-hover min-h-10 w-full cursor-pointer transition-all"
      >
        {form.formState.isSubmitting && (
          <Spinner className="border-primary-foreground/30 border-t-primary-foreground!" />
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
