"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Button,
  Textarea,
} from "@/components/ui";
import { ProfileSchema } from "@/lib/validations";
import { orpc } from "@/lib/orpc";
import { profileFields } from "@/common/constants";

interface ProfileFormProps {
  user: {
    id: string;
    name: string;
    username: string;
    portfolio: string | null;
    location: string | null;
    bio: string | null;
  };
  onSuccess?: () => void;
}

const ProfileForm = ({ user, onSuccess }: ProfileFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const updateProfile = useMutation(
    orpc.user.update.mutationOptions({
      onSuccess: () => {
        toast.success("Your profile has been updated successfully.");
        onSuccess?.();
        router.push(`/profile/${user.id}`);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update profile");
      },
    }),
  );

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      portfolio: user.portfolio || "",
      location: user.location || "",
      bio: user.bio || "",
    },
  });

  const handleUpdateProfile = async (values: z.infer<typeof ProfileSchema>) => {
    startTransition(async () => {
      await updateProfile.mutateAsync(values);
    });
  };

  return (
    <form
      className="mt-9 flex w-full flex-col gap-9"
      onSubmit={form.handleSubmit(handleUpdateProfile)}
    >
      <FieldGroup>
        {profileFields.map((fieldConfig) => (
          <Controller
            key={fieldConfig.name}
            name={fieldConfig.name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={`profile-${fieldConfig.name}`}
                  className="pg-semibold"
                >
                  {fieldConfig.label}
                  {fieldConfig.required && (
                    <span className="text-destructive">*</span>
                  )}
                </FieldLabel>
                <Input
                  {...field}
                  id={`profile-${fieldConfig.name}`}
                  type={fieldConfig.type}
                  aria-invalid={fieldState.invalid}
                  className="base-input"
                  placeholder={fieldConfig.placeholder}
                  autoComplete={fieldConfig.autoComplete}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        ))}

        <Controller
          name="bio"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-bio" className="pg-semibold">
                Bio
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Textarea
                {...field}
                id="profile-bio"
                rows={8}
                aria-invalid={fieldState.invalid}
                className="base-input min-h-40!"
                placeholder="What's special about you?"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          className="primary-gradient hover:primary-gradient-hover w-fit"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Profile"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
