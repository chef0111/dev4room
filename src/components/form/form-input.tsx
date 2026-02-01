import { ReactNode, ComponentPropsWithoutRef } from "react";

import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FormBase, FormControlFn } from "./form-base";

export const FormInput: FormControlFn<
  Omit<ComponentPropsWithoutRef<typeof Input>, "children"> & {
    children?: ReactNode;
  }
> = ({
  children,
  control,
  name,
  label,
  description,
  labelAction,
  fieldClassName,
  descPosition,
  orientation,
  ...inputProps
}) => {
  return (
    <FormBase
      control={control}
      name={name}
      label={label}
      description={description}
      labelAction={labelAction}
      className={fieldClassName}
      orientation={orientation}
      descPosition={descPosition}
    >
      {(field) => (
        <>
          <Input {...field} {...inputProps} />
          {children}
        </>
      )}
    </FormBase>
  );
};

export const FormInputGroup: FormControlFn<
  Omit<ComponentPropsWithoutRef<typeof Input>, "children"> & {
    children?: ReactNode;
    leftAddon?: ReactNode;
    rightAddon?: ReactNode;
  }
> = ({
  children,
  control,
  name,
  label,
  description,
  labelAction,
  fieldClassName,
  orientation,
  descPosition,
  leftAddon,
  rightAddon,
  ...inputProps
}) => {
  return (
    <FormBase
      control={control}
      name={name}
      label={label}
      description={description}
      labelAction={labelAction}
      className={fieldClassName}
      orientation={orientation}
      descPosition={descPosition}
    >
      {(field) => (
        <>
          <InputGroup className="base-input min-h-10!">
            {leftAddon && <InputGroupAddon>{leftAddon}</InputGroupAddon>}
            <InputGroupInput {...field} {...inputProps} />
            {rightAddon && (
              <InputGroupAddon align="inline-end">{rightAddon}</InputGroupAddon>
            )}
          </InputGroup>
          {children}
        </>
      )}
    </FormBase>
  );
};
