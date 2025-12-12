"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Button,
  Textarea,
  Spinner,
} from "@/components/ui";
import { ProfileSchema } from "@/lib/validations";
import { profileFields } from "@/common/constants";
import { useUpdateProfile } from "@/queries/user.queries";

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
  const updateProfile = useUpdateProfile({
    userId: user.id,
    onSuccess,
  });

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

  const handleUpdateProfile = (values: z.infer<typeof ProfileSchema>) => {
    updateProfile.mutate(values);
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
          disabled={updateProfile.isPending}
        >
          {updateProfile.isPending ? (
            <>
              <Spinner className="border-primary-foreground/30 border-t-primary-foreground!" />
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
