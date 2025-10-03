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
import { Checkbox } from "@/components/ui/checkbox";
import TextShimmer from "@/components/ui/text-shimmer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T, FieldValues>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResponse>;
  formType: "LOGIN" | "REGISTER";
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
      toast.success("Success", {
        description:
          formType === "LOGIN"
            ? "Logged in successfully!"
            : "Registered successfully!",
      });

      router.push(routes.home);
      router.refresh();
    } else {
      setError(response?.error?.message || "Something went wrong.");
    }
  };

  const buttonLabel = formType === "LOGIN" ? "Log in" : "Register";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 mt-6"
      >
        {Object.keys(defaultValues)
          .filter((field) => field !== "rememberMe")
          .map((field) => (
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
                        href="#"
                        className="ml-auto inline-block text-sm text-primary underline"
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

        {formType === "LOGIN" && (
          <FormField
            control={form.control}
            name={"rememberMe" as Path<T>}
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Remember me</FormLabel>
              </FormItem>
            )}
          />
        )}

        {!!error && (
          <Alert
            variant="destructive"
            className="bg-destructive/10 border border-destructive/50"
          >
            <AlertCircleIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="primary-gradient pg-semibold min-h-12 w-full text-light-900 hover:primary-gradient-hover transition-all cursor-pointer"
        >
          {form.formState.isSubmitting && (
            <Loader2Icon className="animate-spin" />
          )}
          {form.formState.isSubmitting ? (
            <TextShimmer duration={1} className="text-loading!">
              {buttonLabel === "Log in" ? "Logging in..." : "Registering..."}
            </TextShimmer>
          ) : (
            buttonLabel
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AuthForm;
