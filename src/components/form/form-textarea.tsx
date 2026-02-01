import { ReactNode, ComponentPropsWithoutRef } from "react";

import { Textarea } from "@/components/ui/textarea";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { FormBase, FormControlFn } from "./form-base";

export const FormTextarea: FormControlFn<
  Omit<ComponentPropsWithoutRef<typeof Textarea>, "children"> & {
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
  orientation,
  descPosition,
  ...textareaProps
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
          <Textarea {...field} {...textareaProps} />
          {children}
        </>
      )}
    </FormBase>
  );
};

export const FormTextareaGroup: FormControlFn<
  Omit<ComponentPropsWithoutRef<typeof Textarea>, "children"> & {
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
  descPosition,
  orientation,
  leftAddon,
  rightAddon,
  ...textareaProps
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
          <InputGroup className="base-input">
            {leftAddon && <InputGroupAddon>{leftAddon}</InputGroupAddon>}
            <InputGroupTextarea {...field} {...textareaProps} />
            {rightAddon && (
              <InputGroupAddon align="block-end">{rightAddon}</InputGroupAddon>
            )}
          </InputGroup>
          {children}
        </>
      )}
    </FormBase>
  );
};
