"use client";

import z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FieldDescription,
  FieldGroup,
  InputGroupText,
  Spinner,
} from "@/components/ui";
import { FormInputGroup, FormTextareaGroup } from "@/components/form";
import { ProfileSchema } from "@/lib/validations";
import { LinkIcon, MapPin, ShieldUser, UserIcon } from "lucide-react";
import { useUpdateProfile } from "@/queries/user.queries";
import { useRouter } from "next/navigation";

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

  const updateProfile = useUpdateProfile();

  const handleUpdateProfile = (values: z.infer<typeof ProfileSchema>) => {
    updateProfile.mutate(values);
    form.reset();
  };

  const bioLength = useWatch({ control: form.control, name: "bio" })?.length;

  return (
    <form
      className="mt-2 w-full"
      onSubmit={form.handleSubmit(handleUpdateProfile)}
    >
      <FieldGroup className="gap-5!">
        <FormInputGroup
          name="name"
          control={form.control}
          label="Your name"
          description="Please enter your full name."
          leftAddon={<ShieldUser />}
          fieldClassName="form-field-card"
          orientation="responsive"
        >
          <FieldDescription className="body-regular text-light-500">
            Max 50 characters
          </FieldDescription>
        </FormInputGroup>

        <FormInputGroup
          name="username"
          control={form.control}
          label="Username"
          description="Please enter a display name you are comfortable with."
          leftAddon={<UserIcon />}
          fieldClassName="form-field-card"
          orientation="responsive"
        >
          <FieldDescription className="body-regular text-light-500">
            Max 30 characters
          </FieldDescription>
        </FormInputGroup>

        <FormInputGroup
          name="portfolio"
          control={form.control}
          label="Portfolio"
          description="Please enter your portfolio URL."
          leftAddon={<LinkIcon />}
          fieldClassName="form-field-card"
          orientation="responsive"
        >
          <FieldDescription className="body-regular text-light-500">
            Enter a valid URL
          </FieldDescription>
        </FormInputGroup>

        <FormInputGroup
          name="location"
          control={form.control}
          label="Your Location"
          description="Please enter your location."
          leftAddon={<MapPin />}
          fieldClassName="form-field-card"
          orientation="responsive"
        >
          <FieldDescription className="body-regular text-light-500">
            Provide a proper location, max 100 characters
          </FieldDescription>
        </FormInputGroup>

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
            Max 200 characters
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
