"use client";

import z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { InputGroupText } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { FormInputGroup, FormTextareaGroup } from "@/components/form";
import { ProfileSchema } from "@/lib/validations";
import { useUpdateProfile } from "@/queries/user.queries";
import { useRouter } from "next/navigation";
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
}

const ProfileForm = ({ user }: ProfileFormProps) => {
  const router = useRouter();
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

  const updateProfile = useUpdateProfile({
    onSuccess: () => {
      // Reset form with the current values
      form.reset(form.getValues());
    },
  });

  const handleUpdateProfile = (values: z.infer<typeof ProfileSchema>) => {
    updateProfile.mutate(values);
  };

  const bioLength = useWatch({ control: form.control, name: "bio" })?.length;

  return (
    <form
      className="mt-2 w-full"
      onSubmit={form.handleSubmit(handleUpdateProfile)}
    >
      <FieldGroup className="gap-5!">
        {profileFields.map((field) => {
          const Icon = field.icon;
          return (
            <FormInputGroup
              key={field.name}
              name={field.name}
              control={form.control}
              label={field.label}
              description={field.description}
              leftAddon={<Icon />}
              fieldClassName="form-field-card"
              orientation="responsive"
            >
              <FieldDescription className="body-regular text-light-500">
                {field.hint}
              </FieldDescription>
            </FormInputGroup>
          );
        })}

        <FormTextareaGroup
          name="bio"
          control={form.control}
          label="Your Personal Bio"
          description="Please write a brief description about yourself."
          rows={6}
          rightAddon={
            <InputGroupText className="small-medium!">
              {bioLength}/200 characters
            </InputGroupText>
          }
          fieldClassName="form-field-card"
          orientation="responsive"
        >
          <FieldDescription className="body-regular text-light-500">
            Min 10 characters, max 200 characters
          </FieldDescription>
        </FormTextareaGroup>
      </FieldGroup>

      <div className="mt-6 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-full"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="primary-gradient hover:primary-gradient-hover h-full w-fit"
          disabled={updateProfile.isPending || !form.formState.isDirty}
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
