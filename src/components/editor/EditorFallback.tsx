import TextShimmer from "../ui/text-shimmer";

const EditorFallback = () => {
  return (
    <div className="md-editor-fallback">
      <TextShimmer duration={0.75}>Loading editor...</TextShimmer>
    </div>
  );
};

export default EditorFallback;
