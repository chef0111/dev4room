import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";
import { dev4roomLight } from "./theme";

Code.theme = {
  light: dev4roomLight,
  dark: "github-dark",
  lightSelector: "html.light",
};

const MarkdownPreview = ({ content = "" }: { content: string }) => {
  const formattedContent = content.replace(/\\/g, "").replace(/&#x20;/g, "");

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
