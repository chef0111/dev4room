import { Checkbox } from "@/components/ui/checkbox";
import { FormBase, FormControlFn } from "./form-base";

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
        <Checkbox
          {...field}
          checked={value ?? false}
          onCheckedChange={onChange}
        />
      )}
    </FormBase>
  );
};
