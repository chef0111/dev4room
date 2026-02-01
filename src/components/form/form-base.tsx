import { ReactNode } from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

export type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = {
  name: TName;
  label?: ReactNode;
  description?: ReactNode;
  labelAction?: ReactNode;
  fieldClassName?: string;
  descPosition?: "after-label" | "after-field";
  orientation?: "horizontal" | "vertical" | "responsive" | null;
  control: ControllerProps<TFieldValues, TName, TTransformedValues>["control"];
};

export type FormBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = FormControlProps<TFieldValues, TName, TTransformedValues> & {
  orientation?: "horizontal" | "vertical" | "responsive" | null;
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

export type FormControlFn<
  ExtraProps extends Record<string, unknown> = Record<never, never>,
> = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(
  props: FormControlProps<TFieldValues, TName, TTransformedValues> & ExtraProps
) => ReactNode;

export function FormBase<
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
  descPosition = "after-label",
  labelAction,
}: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const labelElement = label && (
          <div className="flex-between w-full">
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            {labelAction}
          </div>
        );
        const descElement = description && (
          <FieldDescription className="body-regular text-light-500">
            {description}
          </FieldDescription>
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
                  {descPosition === "after-label" && descElement}
                  {errorElement}
                </FieldContent>
              </>
            ) : (
              <>
                <FieldContent>
                  {labelElement}
                  {descPosition === "after-label" && descElement}
                </FieldContent>
                <FieldContent>
                  {control}
                  {descPosition === "after-field" && descElement}
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
