"use client";

import { ForwardedRef, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { MDXEditorMethods } from "@mdxeditor/editor";

import { useDebounce } from "@/hooks/use-debounce";
import TextShimmer from "../ui/text-shimmer";

interface MarkdownProps {
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  value: string;
  onChange: (value: string) => void;
}

const DynamicEditor = dynamic(() => import("./index"), {
  ssr: false,
  loading: () => (
    <div className="h-40 w-full rounded-md border bg-light800_dark200 flex items-center justify-center">
      <TextShimmer duration={1} className="text-loading!">
        Loading editor...
      </TextShimmer>
    </div>
  ),
});

const MarkdownEditor = memo(({ editorRef, value, onChange }: MarkdownProps) => {
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
      editorRef={editorRef}
      markdown={value}
      fieldChange={fieldChange}
    />
  );
});

MarkdownEditor.displayName = "MarkdownEditor";

export default MarkdownEditor;
