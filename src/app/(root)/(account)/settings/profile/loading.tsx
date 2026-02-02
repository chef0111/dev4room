import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { IdCardLanyard, Link, MapPin, UserIcon } from "lucide-react";

const Loading = async () => {
  return (
    <div className="mx-auto w-full">
      <FieldSet>
        <FieldLegend className="h1-bold!">Profile Settings</FieldLegend>
        <FieldDescription className="pg-regular! text-light-500">
          Manage your personal information
        </FieldDescription>
        <FieldSeparator />
        <FieldGroup className="mt-4 flex flex-col-reverse items-start gap-10 md:flex-row md:gap-16 xl:gap-24">
          <FieldGroup className="mt-2 gap-5!">
            <Field className="form-field-card" orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="name">Your Name</FieldLabel>
                <FieldDescription className="body-regular text-light-500">
                  Please enter your full name.
                </FieldDescription>
              </FieldContent>
              <FieldContent>
                <InputGroup className="base-input min-h-10!">
                  <InputGroupAddon>
                    <IdCardLanyard />
                  </InputGroupAddon>
                  <InputGroupInput disabled />
                </InputGroup>
                <FieldDescription className="body-regular">
                  Max 50 characters
                </FieldDescription>
              </FieldContent>
            </Field>

            <Field className="form-field-card" orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="name">Your Username</FieldLabel>
                <FieldDescription className="body-regular text-light-500">
                  Please enter a display name you are comfortable with.
                </FieldDescription>
              </FieldContent>
              <FieldContent>
                <InputGroup className="base-input min-h-10!">
                  <InputGroupAddon>
                    <UserIcon />
                  </InputGroupAddon>
                  <InputGroupInput disabled />
                </InputGroup>
                <FieldDescription className="body-regular">
                  Max 30 characters
                </FieldDescription>
              </FieldContent>
            </Field>

            <Field className="form-field-card" orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="name">Your Portfolio</FieldLabel>
                <FieldDescription className="body-regular text-light-500">
                  Please enter the link to your portfolio.
                </FieldDescription>
              </FieldContent>
              <FieldContent>
                <InputGroup className="base-input min-h-10!">
                  <InputGroupAddon>
                    <Link />
                  </InputGroupAddon>
                  <InputGroupInput disabled />
                </InputGroup>
                <FieldDescription className="body-regular">
                  Enter a valid URL
                </FieldDescription>
              </FieldContent>
            </Field>

            <Field className="form-field-card" orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="name">Your Location</FieldLabel>
                <FieldDescription className="body-regular text-light-500">
                  Please enter your location.
                </FieldDescription>
              </FieldContent>
              <FieldContent>
                <InputGroup className="base-input min-h-10!">
                  <InputGroupAddon>
                    <MapPin />
                  </InputGroupAddon>
                  <InputGroupInput disabled />
                </InputGroup>
                <FieldDescription className="body-regular">
                  Provide a proper location, max 100 characters
                </FieldDescription>
              </FieldContent>
            </Field>

            <Field className="form-field-card" orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="name">Your Personal Bio</FieldLabel>
                <FieldDescription className="body-regular text-light-500">
                  Please write a brief description about yourself.
                </FieldDescription>
              </FieldContent>
              <FieldContent>
                <InputGroup className="base-input">
                  <InputGroupTextarea rows={6} disabled />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="small-medium!">
                      0/200 characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription className="body-regular">
                  Min 10 characters, max 200 characters
                </FieldDescription>
              </FieldContent>
            </Field>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-full"
                disabled
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="primary-gradient hover:primary-gradient-hover h-full w-fit"
                disabled
              >
                Save Profile
              </Button>
            </div>
          </FieldGroup>
          <FieldGroup className="flex flex-col items-center py-0 md:w-64 md:items-start md:pr-32">
            <FieldLabel className="h3-bold! text-nowrap">
              Profile picture
            </FieldLabel>
            <Skeleton className="size-36 rounded-full md:size-48" />
          </FieldGroup>
        </FieldGroup>
      </FieldSet>
    </div>
  );
};

export default Loading;
