import { ReactNode, Suspense, RefObject, useCallback } from "react";
import dynamic from "next/dynamic";

import EditorFallback from "@/components/editor/markdown/editor-fallback";
import type { FormEditorMethods } from "@/components/editor/markdown/form-editor";
import { FormBase, FormControlFn } from "./form-base";
import { useDebounce } from "@/hooks/use-debounce";

const FormEditorComponent = dynamic(
  () => import("@/components/editor/markdown/form-editor"),
  {
    ssr: false,
    loading: () => <EditorFallback />,
  }
);

function Editor({
  editorRef,
  editorKey,
  field,
  children,
}: {
  editorRef?: RefObject<FormEditorMethods | null>;
  editorKey?: number;
  field: {
    id: string;
    value: string;
    onChange: (value: string) => void;
    "aria-invalid": boolean;
  };
  children?: ReactNode;
}) {
  const fieldChange = useDebounce(
    useCallback(
      (value: string) => {
        field.onChange(value);
      },
      [field.onChange]
    ),
    300
  );

  return (
    <>
      <Suspense fallback={<EditorFallback />}>
        <FormEditorComponent
          key={editorKey}
          ref={editorRef}
          id={field.id}
          value={field.value ?? ""}
          onChange={fieldChange}
          isInvalid={field["aria-invalid"]}
          className="bg-card light-border-2 rounded-lg border"
        />
      </Suspense>
      {children}
    </>
  );
}

export const FormMarkdown: FormControlFn<{
  editorRef?: RefObject<FormEditorMethods | null>;
  editorKey?: number;
  children?: ReactNode;
}> = ({ editorRef, editorKey, children, ...props }) => {
  return (
    <FormBase {...props}>
      {(field) => (
        <Editor editorRef={editorRef} editorKey={editorKey} field={field}>
          {children}
        </Editor>
      )}
    </FormBase>
  );
};
