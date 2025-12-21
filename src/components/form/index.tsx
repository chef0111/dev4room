import {
  ReactNode,
  Suspense,
  RefObject,
  ComponentPropsWithoutRef,
} from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { MDXEditorMethods } from "@mdxeditor/editor";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import MarkdownEditor from "@/components/markdown/markdown-editor";
import EditorFallback from "@/components/markdown/editor-fallback";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";

type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = {
  name: TName;
  label?: ReactNode;
  description?: ReactNode;
  labelAction?: ReactNode;
  fieldClassName?: string;
  orientation?: "horizontal" | "vertical" | "responsive" | null;
  control: ControllerProps<TFieldValues, TName, TTransformedValues>["control"];
};

type FormBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = FormControlProps<TFieldValues, TName, TTransformedValues> & {
  horizontal?: boolean;
  controlFirst?: boolean;
  className?: string;
  children: (
    field: Parameters<
      ControllerProps<TFieldValues, TName, TTransformedValues>["render"]
    >[0]["field"] & {
      "aria-invalid": boolean;
      id: string;
    }
  ) => ReactNode;
};

type FormControlFn<
  ExtraProps extends Record<string, unknown> = Record<never, never>,
> = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(
  props: FormControlProps<TFieldValues, TName, TTransformedValues> & ExtraProps
) => ReactNode;

function FormBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  children,
  control,
  label,
  name,
  description,
  className,
  controlFirst,
  orientation,
  labelAction,
}: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const labelElement = (
          <>
            {label && (
              <div className="flex-between w-full">
                <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                {labelAction}
              </div>
            )}
            {description && (
              <FieldDescription className="body-regular text-light-500">
                {description}
              </FieldDescription>
            )}
          </>
        );

        const control = children({
          ...field,
          id: field.name,
          "aria-invalid": fieldState.invalid,
        });

        const errorElement = fieldState.invalid && (
          <FieldError errors={[fieldState.error]} />
        );

        return (
          <Field
            data-invalid={fieldState.invalid}
            orientation={orientation}
            className={className}
          >
            {controlFirst ? (
              <>
                <FieldContent>{control}</FieldContent>
                <FieldContent>
                  {labelElement}
                  {errorElement}
                </FieldContent>
              </>
            ) : (
              <>
                <FieldContent>{labelElement}</FieldContent>
                <FieldContent>
                  {control}
                  {errorElement}
                </FieldContent>
              </>
            )}
          </Field>
        );
      }}
    />
  );
}

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

export const FormSelect: FormControlFn<{
  children: ReactNode;
  fieldClassName?: string;
  orientation?: "horizontal" | "vertical" | "responsive" | null;
}> = ({ children, fieldClassName, orientation, ...props }) => {
  return (
    <FormBase {...props} className={fieldClassName} orientation={orientation}>
      {({ onChange, onBlur, ...field }) => (
        <Select {...field} onValueChange={onChange}>
          <SelectTrigger
            aria-invalid={field["aria-invalid"]}
            id={field.id}
            onBlur={onBlur}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
      )}
    </FormBase>
  );
};

export const FormCheckbox: FormControlFn<{
  fieldClassName?: string;
  orientation?: "horizontal" | "vertical" | "responsive" | null;
}> = ({ fieldClassName, orientation = "horizontal", ...props }) => {
  return (
    <FormBase
      {...props}
      controlFirst
      className={fieldClassName}
      orientation={orientation}
    >
      {({ onChange, value, ...field }) => (
        <Checkbox {...field} checked={value} onCheckedChange={onChange} />
      )}
    </FormBase>
  );
};

export const FormInputOTP: FormControlFn<{ children?: ReactNode }> = ({
  children,
  ...props
}) => {
  return (
    <FormBase {...props}>
      {(field) => (
        <div className="flex flex-col items-center gap-2.5">
          <InputOTP
            {...field}
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            className="justify-center"
          >
            <InputOTPGroup className="input-otp-group">
              <InputOTPSlot index={0} className="input-otp-slot" />
              <InputOTPSlot index={1} className="input-otp-slot" />
            </InputOTPGroup>
            <InputOTPSeparator className="max-xs:hidden" />
            <InputOTPGroup className="input-otp-group">
              <InputOTPSlot index={2} className="input-otp-slot" />
              <InputOTPSlot index={3} className="input-otp-slot" />
            </InputOTPGroup>
            <InputOTPSeparator className="max-xs:hidden" />
            <InputOTPGroup className="input-otp-group">
              <InputOTPSlot index={4} className="input-otp-slot" />
              <InputOTPSlot index={5} className="input-otp-slot" />
            </InputOTPGroup>
          </InputOTP>
          {children}
        </div>
      )}
    </FormBase>
  );
};

export const FormMarkdown: FormControlFn<{
  editorRef?: RefObject<MDXEditorMethods | null>;
  editorKey?: number;
  children?: ReactNode;
}> = ({ editorRef, editorKey, children, ...props }) => {
  return (
    <FormBase {...props}>
      {(field) => (
        <>
          <Suspense fallback={<EditorFallback />}>
            <MarkdownEditor
              key={editorKey}
              id={field.id}
              editorRef={editorRef ?? null}
              value={field.value}
              onChange={field.onChange}
              isInvalid={field["aria-invalid"]}
            />
          </Suspense>
          {children}
        </>
      )}
    </FormBase>
  );
};
