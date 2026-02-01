import { createEditor, SerializedEditorState } from "lexical";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from "@lexical/markdown";

import { nodes } from "@/components/editor/markdown/nodes";
import { HR } from "@/components/editor/transformers/markdown-hr-transformer";
import { IMAGE } from "@/components/editor/transformers/markdown-image-transformer";
import { TABLE } from "@/components/editor/transformers/markdown-table-transformer";

/**
 * All markdown transformers used for conversion between markdown and Lexical state.
 * This must match the transformers used in MarkdownShortcutPlugin.
 */
export const MARKDOWN_TRANSFORMERS = [
  TABLE,
  HR,
  IMAGE,
  CHECK_LIST,
  ...ELEMENT_TRANSFORMERS,
  ...MULTILINE_ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
];

/**
 * Creates an empty Lexical editor state with the default configuration.
 */
function createConfiguredEditor() {
  return createEditor({
    namespace: "MarkdownConverter",
    nodes,
    onError: (error) => {
      console.error("Lexical conversion error:", error);
    },
  });
}

/**
 * Converts a markdown string to a Lexical SerializedEditorState.
 *
 * @param markdown - The markdown string to convert
 * @returns SerializedEditorState that can be passed to the Editor component
 *
 * @example
 * const state = markdownToEditorState("# Hello World");
 * <Editor editorSerializedState={state} />
 */
export function markdownToEditorState(
  markdown: string
): SerializedEditorState | undefined {
  // Handle empty/invalid input
  if (!markdown || typeof markdown !== "string") {
    return undefined;
  }

  if (markdown.trim() === "") {
    return undefined;
  }

  try {
    const editor = createConfiguredEditor();

    editor.update(
      () => {
        $convertFromMarkdownString(markdown, MARKDOWN_TRANSFORMERS);
      },
      { discrete: true }
    );

    return editor.getEditorState().toJSON();
  } catch (error) {
    console.error("Failed to convert markdown to editor state:", error);
    return undefined;
  }
}

/**
 * Converts a Lexical SerializedEditorState to a markdown string.
 *
 * @param serializedState - The serialized editor state to convert
 * @returns A markdown string representation of the editor content
 *
 * @example
 * const markdown = editorStateToMarkdown(editorState);
 * // Save markdown to database
 */
export function editorStateToMarkdown(
  serializedState: SerializedEditorState | null | undefined
): string {
  // Handle empty/invalid input
  if (!serializedState) {
    return "";
  }

  try {
    const editor = createConfiguredEditor();

    editor.setEditorState(editor.parseEditorState(serializedState));

    let markdown = "";

    editor.update(
      () => {
        markdown = $convertToMarkdownString(MARKDOWN_TRANSFORMERS);
      },
      { discrete: true }
    );

    markdown = cleanupMarkdownFormatting(markdown);

    return markdown;
  } catch (error) {
    console.error("Failed to convert editor state to markdown:", error);
    return "";
  }
}

function cleanupMarkdownFormatting(markdown: string): string {
  return markdown
    .replace(/&#32;/g, " ")
    .replace(/&#x20;/g, " ")
    .replace(/\*\*(.+?) \*\*/g, "**$1**")
    .replace(/(?<!\*)\*([^*]+?) \*(?!\*)/g, "*$1*")
    .replace(/(?<!_)_([^_]+?) _(?!_)/g, "_$1_")
    .replace(/~~(.+?) ~~/g, "~~$1~~");
}

/**
 * Creates an empty editor state.
 * Useful for initializing a new editor with no content.
 */
export function createEmptyEditorState(): SerializedEditorState {
  const editor = createConfiguredEditor();
  return editor.getEditorState().toJSON();
}
