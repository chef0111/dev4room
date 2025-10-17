"use client";

import { ForwardedRef, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { MDXEditorMethods } from "@mdxeditor/editor";

import { useDebounce } from "@/hooks/use-debounce";
import TextShimmer from "../ui/text-shimmer";

interface MarkdownProps {
  id?: string;
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  value: string;
  onChange: (value: string) => void;
}

const DynamicEditor = dynamic(() => import("./index"), {
  ssr: false,
  loading: () => (
    <div className="md-editor-fallback">
      <TextShimmer duration={0.75}>Loading editor...</TextShimmer>
    </div>
  ),
});

const MarkdownEditor = memo(
  ({ id, editorRef, value, onChange }: MarkdownProps) => {
    const fieldChange = useDebounce(
      useCallback(
        (value: string) => {
          onChange(value);
        },
        [onChange]
      ),
      500
    );

    return (
      <DynamicEditor
        id={id}
        editorRef={editorRef}
        markdown={value}
        fieldChange={fieldChange}
      />
    );
  }
);

MarkdownEditor.displayName = "MarkdownEditor";

export default MarkdownEditor;
