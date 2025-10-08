"use client";

import { useState } from "react";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
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
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

      if (formType === "LOGIN" || formType === "REGISTER") {
        router.push(routes.home);
      } else if (formType === "RESET_PASSWORD") {
        router.push(routes.login);
      }
      router.refresh();
    } else {
      setError(response?.error?.message || "Something went wrong");
    }
  };

  const formConfig = AUTH_FORM_TYPES[formType];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 mt-6"
      >
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-2.5">
                <div className="flex-between w-full">
                  <FormLabel className="flex-grow pg-medium text-dark400_light700">
                    {field.name === "confirmPassword"
                      ? "Confirm Password"
                      : field.name.charAt(0).toUpperCase() +
                        field.name.slice(1)}
                  </FormLabel>

                  {field.name === "password" && formType === "LOGIN" && (
                    <Link
                      href={routes.forgotPassword}
                      className="ml-auto inline-block text-sm text-link-100 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  )}
                </div>
                <FormControl>
                  <Input
                    type={
                      field.name === "password" ||
                      field.name === "confirmPassword"
                        ? "password"
                        : "text"
                    }
                    placeholder={
                      field.name === "confirmPassword"
                        ? "Confirm your password"
                        : `Enter your ${field.name}`
                    }
                    className="pg-regular bg-light900_dark300 text-dark300_light700 min-h-10 border"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {!!error && (
          <Alert
            variant="destructive"
            className="bg-destructive/10 border border-destructive/20"
          >
            <AlertCircleIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}. {formType === "LOGIN" && "Please try again."}
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
    </Form>
  );
};

export default AuthForm;
