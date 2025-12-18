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
import MarkdownEditor from "@/components/markdown/MarkdownEditor";
import EditorFallback from "@/components/markdown/EditorFallback";

type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = {
  name: TName;
  label?: ReactNode;
  description?: ReactNode;
  labelAction?: ReactNode;
  control: ControllerProps<TFieldValues, TName, TTransformedValues>["control"];
};

type FormBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = FormControlProps<TFieldValues, TName, TTransformedValues> & {
  horizontal?: boolean;
  controlFirst?: boolean;
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
  controlFirst,
  horizontal,
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
            orientation={horizontal ? "horizontal" : undefined}
          >
            {controlFirst ? (
              <>
                {control}
                <FieldContent>
                  {labelElement}
                  {errorElement}
                </FieldContent>
              </>
            ) : (
              <>
                <FieldContent>{labelElement}</FieldContent>
                {control}
                {errorElement}
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
> = ({ children, ...inputProps }) => {
  return (
    <FormBase {...inputProps}>
      {(field) => (
        <>
          <Input {...field} {...inputProps} />
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
> = ({ children, ...textareaProps }) => {
  return (
    <FormBase {...textareaProps}>
      {(field) => (
        <>
          <Textarea {...field} {...textareaProps} />
          {children}
        </>
      )}
    </FormBase>
  );
};

export const FormSelect: FormControlFn<{ children: ReactNode }> = ({
  children,
  ...props
}) => {
  return (
    <FormBase {...props}>
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

export const FormCheckbox: FormControlFn = (props) => {
  return (
    <FormBase {...props} horizontal controlFirst>
      {({ onChange, value, ...field }) => (
        <Checkbox {...field} checked={value} onCheckedChange={onChange} />
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
