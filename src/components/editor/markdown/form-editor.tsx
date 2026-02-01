"use client";

import { useRef, forwardRef, useImperativeHandle, useMemo } from "react";
import { LexicalEditor, $getRoot } from "lexical";
import { $convertFromMarkdownString } from "@lexical/markdown";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";
import { nodes } from "@/components/editor/markdown/nodes";
import { Plugins } from "@/components/editor/markdown/plugins";
import {
  MARKDOWN_TRANSFORMERS,
  markdownToEditorState,
  editorStateToMarkdown,
} from "@/components/editor/utils/markdown-converter";

export interface FormEditorMethods {
  setMarkdown: (markdown: string) => void;
  getMarkdown: () => string;
  focus: () => void;
  getEditor: () => LexicalEditor | null;
}

interface FormEditorProps {
  id?: string;
  value: string;
  onChange: (markdown: string) => void;
  isInvalid?: boolean;
  placeholder?: string;
  className?: string;
}

const editorConfig: InitialConfigType = {
  namespace: "FormEditor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error("Lexical editor error:", error);
  },
};

/**
 * Internal component that handles editor state and provides ref methods.
 * Must be rendered inside LexicalComposer.
 */
function EditorRefPlugin({
  editorRef,
  onChange,
}: {
  editorRef: React.RefObject<FormEditorMethods | null>;
  onChange: (markdown: string) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const lastMarkdownRef = useRef<string>("");

  useImperativeHandle(
    editorRef,
    () => ({
      setMarkdown: (markdown: string) => {
        editor.update(() => {
          const root = $getRoot();
          root.clear();
          $convertFromMarkdownString(markdown || "", MARKDOWN_TRANSFORMERS);
        });
        lastMarkdownRef.current = markdown;
      },
      getMarkdown: () => {
        const state = editor.getEditorState();
        return editorStateToMarkdown(state.toJSON());
      },
      focus: () => {
        editor.focus();
      },
      getEditor: () => editor,
    }),
    [editor]
  );

  return (
    <OnChangePlugin
      ignoreSelectionChange={true}
      onChange={(editorState) => {
        const markdown = editorStateToMarkdown(editorState.toJSON());
        // Only trigger onChange if content actually changed
        if (markdown !== lastMarkdownRef.current) {
          lastMarkdownRef.current = markdown;
          onChange(markdown);
        }
      }}
    />
  );
}

const FormEditor = forwardRef<FormEditorMethods, FormEditorProps>(
  function FormEditor(
    { id, value, onChange, isInvalid = false, className },
    ref
  ) {
    const internalRef = useRef<FormEditorMethods>(null);

    // Forward the internal ref to the external ref
    useImperativeHandle(
      ref,
      () => ({
        setMarkdown: (markdown: string) => {
          internalRef.current?.setMarkdown(markdown);
        },
        getMarkdown: () => internalRef.current?.getMarkdown() ?? "",
        focus: () => internalRef.current?.focus(),
        getEditor: () => internalRef.current?.getEditor() ?? null,
      }),
      []
    );

    // Compute initial state synchronously (only on first render)
    const initialState = useMemo(
      () => markdownToEditorState(value),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [] // Only compute on mount, not on value changes
    );

    return (
      <div
        aria-invalid={isInvalid}
        aria-label={id}
        className={`group w-full ${className || ""}`}
      >
        <LexicalComposer
          initialConfig={{
            ...editorConfig,
            ...(initialState
              ? { editorState: JSON.stringify(initialState) }
              : {}),
          }}
        >
          <TooltipProvider>
            <Plugins />
            <EditorRefPlugin editorRef={internalRef} onChange={onChange} />
          </TooltipProvider>
        </LexicalComposer>
      </div>
    );
  }
);

FormEditor.displayName = "FormEditor";

export default FormEditor;
