import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";
import { dev4roomLight } from "../themes/preview-theme";

Code.theme = {
  light: dev4roomLight,
  dark: "github-dark",
  lightSelector: "html.light",
};

const MarkdownPreview = ({ content = "" }: { content: string }) => {
  const formattedContent = content
    .replace(/\\/g, "")
    .replace(/&#32;/g, " ")
    .replace(/&#x20;/g, " ")
    .replace(/\*\*(.+?) \*\*/g, "**$1**")
    .replace(/(?<!\*)\*([^*]+?) \*(?!\*)/g, "*$1*")
    .replace(/(?<!_)_([^_]+?) _(?!_)/g, "_$1_")
    .replace(/~~(.+?) ~~/g, "~~$1~~");

  return (
    <section className="markdown break-workds grid">
      <MDXRemote
        source={formattedContent}
        options={{
          mdxOptions: {
            format: "md", // Treat as plain markdown, not MDX
          },
        }}
        components={{
          pre: (props) => (
            <Code
              {...props}
              lineNumbers
              className="shadow-light-200 dark:shadow-dark-200"
            />
          ),
        }}
      />
    </section>
  );
};

export default MarkdownPreview;
