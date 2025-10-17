"use client";

import type { ForwardedRef } from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  toolbarPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  UndoRedo,
  Separator,
  BoldItalicUnderlineToggles,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  linkPlugin,
  codeBlockPlugin,
  imagePlugin,
  tablePlugin,
  linkDialogPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useTheme } from "next-themes";
import { basicDark } from "cm6-theme-basic-dark";
import { programmingLanguages } from "@/common/constants";

interface EditorRefProps {
  id?: string;
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  markdown?: string;
  fieldChange?: (value: string) => void;
}

const Editor = ({
  id,
  editorRef,
  markdown,
  fieldChange,
  ...props
}: EditorRefProps & MDXEditorProps) => {
  const { resolvedTheme } = useTheme();

  const theme = resolvedTheme === "dark" ? [basicDark] : [];

  return (
    <MDXEditor
      aria-label={id}
      key={resolvedTheme}
      markdown={markdown}
      ref={editorRef}
      onChange={fieldChange}
      className="grid no-scrollbar bg-light800_dark200! light-border-2 markdown-editor dark-editor w-full border no-focus! rounded-md"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin(),
        tablePlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
        codeMirrorPlugin({
          codeBlockLanguages: programmingLanguages,
          autoLoadLanguageSupport: true,
          codeMirrorExtensions: theme,
        }),
        diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
        toolbarPlugin({
          toolbarContents: () => {
            return (
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === "codeblock",
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    fallback: () => (
                      <>
                        <UndoRedo />
                        <Separator />

                        <BoldItalicUnderlineToggles />
                        <Separator />

                        <ListsToggle />
                        <Separator />

                        <CreateLink />
                        <InsertImage />
                        <Separator />

                        <InsertTable />
                        <InsertThematicBreak />

                        <InsertCodeBlock />
                      </>
                    ),
                  },
                ]}
              />
            );
          },
        }),
      ]}
      {...props}
    />
  );
};

export default Editor;
