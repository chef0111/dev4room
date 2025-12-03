export const dev4roomLight = {
  name: "Custom GitHub Light",
  type: "light",
  colors: {
    "editor.background": "#eff2f5",
    "editor.foreground": "#24292e",
    "editorLineNumber.foreground": "#1b1f234d",
    "editorLineNumber.activeForeground": "#24292e",
    "editor.selectionBackground": "#0366d625",
    "editor.lineHighlightBackground": "#f6f8fa",
  },
  tokenColors: [
    {
      name: "Comment",
      scope: ["comment", "punctuation.definition.comment"],
      settings: {
        fontStyle: "italic",
        foreground: "#6a737d",
      },
    },
    {
      name: "Variables",
      scope: ["variable", "string constant.other.placeholder"],
      settings: {
        foreground: "#24292e",
      },
    },
    {
      name: "Colors",
      scope: ["constant.other.color"],
      settings: {
        foreground: "#005cc5",
      },
    },
    {
      name: "Invalid",
      scope: ["invalid", "invalid.illegal"],
      settings: {
        foreground: "#b31d28",
      },
    },
    {
      name: "Keyword, Storage",
      scope: ["keyword", "storage.type", "storage.modifier"],
      settings: {
        foreground: "#d73a49",
      },
    },
    {
      name: "Operator, Misc",
      scope: [
        "keyword.control",
        "constant.other.color",
        "punctuation",
        "meta.tag",
        "punctuation.definition.tag",
        "punctuation.separator.inheritance.php",
        "punctuation.definition.tag.html",
        "punctuation.definition.tag.begin.html",
        "punctuation.definition.tag.end.html",
        "punctuation.section.embedded",
        "keyword.other.template",
        "keyword.other.substitution",
      ],
      settings: {
        foreground: "#24292e",
      },
    },
    {
      name: "Tag",
      scope: ["entity.name.tag", "meta.tag.sgml", "markup.deleted.git_gutter"],
      settings: {
        foreground: "#22863a",
      },
    },
    {
      name: "Function, Special Method",
      scope: [
        "entity.name.function",
        "meta.function-call",
        "variable.function",
        "support.function",
        "keyword.other.special-method",
      ],
      settings: {
        foreground: "#6f42c1",
      },
    },
    {
      name: "Block Level Variables",
      scope: ["meta.block variable.other"],
      settings: {
        foreground: "#24292e",
      },
    },
    {
      name: "Other Variable, String Link",
      scope: ["support.other.variable", "string.other.link"],
      settings: {
        foreground: "#032f62",
      },
    },
    {
      name: "Number, Constant, Function Argument, Tag Attribute, Embedded",
      scope: [
        "constant.numeric",
        "constant.language",
        "support.constant",
        "constant.character",
        "constant.escape",
        "variable.parameter",
        "keyword.other.unit",
        "keyword.other",
      ],
      settings: {
        foreground: "#005cc5",
      },
    },
    {
      name: "String, Symbols, Inherited Class, Markup Heading",
      scope: [
        "string",
        "constant.other.symbol",
        "constant.other.key",
        "entity.other.inherited-class",
        "markup.heading",
        "markup.inserted.git_gutter",
        "meta.group.braces.curly constant.other.object.key.js string.unquoted.label.js",
      ],
      settings: {
        foreground: "#032f62",
      },
    },
    {
      name: "Class, Support",
      scope: [
        "entity.name",
        "support.type",
        "support.class",
        "support.other.namespace.use.php",
        "meta.use.php",
        "support.other.namespace.php",
        "markup.changed.git_gutter",
        "support.type.sys-types",
      ],
      settings: {
        foreground: "#6f42c1",
      },
    },
    {
      name: "Entity Types",
      scope: ["support.type"],
      settings: {
        foreground: "#005cc5",
      },
    },
    {
      name: "CSS Class and Support",
      scope: [
        "source.css support.type.property-name",
        "source.sass support.type.property-name",
        "source.scss support.type.property-name",
        "source.less support.type.property-name",
        "source.stylus support.type.property-name",
        "source.postcss support.type.property-name",
      ],
      settings: {
        foreground: "#005cc5",
      },
    },
    {
      name: "Sub-methods",
      scope: [
        "entity.name.module.js",
        "variable.import.parameter.js",
        "variable.other.class.js",
      ],
      settings: {
        foreground: "#24292e",
      },
    },
    {
      name: "Language methods",
      scope: ["variable.language"],
      settings: {
        fontStyle: "italic",
        foreground: "#6f42c1",
      },
    },
    {
      name: "entity.name.method.js",
      scope: ["entity.name.method.js"],
      settings: {
        fontStyle: "italic",
        foreground: "#6f42c1",
      },
    },
    {
      name: "meta.method.js",
      scope: [
        "meta.class-method.js entity.name.function.js",
        "variable.function.constructor",
      ],
      settings: {
        foreground: "#6f42c1",
      },
    },
    {
      name: "Attributes",
      scope: ["entity.other.attribute-name"],
      settings: {
        foreground: "#6f42c1",
      },
    },
    {
      name: "HTML Attributes",
      scope: [
        "text.html.basic entity.other.attribute-name.html",
        "text.html.basic entity.other.attribute-name",
      ],
      settings: {
        fontStyle: "italic",
        foreground: "#6f42c1",
      },
    },
    {
      name: "CSS Classes",
      scope: ["entity.other.attribute-name.class"],
      settings: {
        foreground: "#6f42c1",
      },
    },
    {
      name: "CSS ID's",
      scope: ["source.sass keyword.control"],
      settings: {
        foreground: "#005cc5",
      },
    },
    {
      name: "Inserted",
      scope: ["markup.inserted"],
      settings: {
        foreground: "#22863a",
      },
    },
    {
      name: "Deleted",
      scope: ["markup.deleted"],
      settings: {
        foreground: "#b31d28",
      },
    },
    {
      name: "Changed",
      scope: ["markup.changed"],
      settings: {
        foreground: "#e36209",
      },
    },
    {
      name: "Regular Expressions",
      scope: ["string.regexp"],
      settings: {
        foreground: "#032f62",
      },
    },
    {
      name: "Escape Characters",
      scope: ["constant.character.escape"],
      settings: {
        foreground: "#005cc5",
      },
    },
    {
      name: "URL",
      scope: ["*url*", "*link*", "*uri*"],
      settings: {
        textDecoration: "underline",
      },
    },
    {
      name: "Decorators",
      scope: [
        "tag.decorator.js entity.name.tag.js",
        "tag.decorator.js punctuation.definition.tag.js",
      ],
      settings: {
        fontStyle: "italic",
        foreground: "#6f42c1",
      },
    },
    {
      name: "ES7 Bind Operator",
      scope: [
        "source.js constant.other.object.key.js string.unquoted.label.js",
      ],
      settings: {
        fontStyle: "italic",
        foreground: "#6f42c1",
      },
    },
    {
      name: "JSON Key - Level 0",
      scope: [
        "source.json meta.structure.dictionary.json support.type.property-name.json",
      ],
      settings: {
        foreground: "#6f42c1",
      },
    },
    {
      name: "JSON Key - Level 1",
      scope: [
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
      ],
      settings: {
        foreground: "#6f42c1",
      },
    },
    {
      name: "JSON Key - Level 2",
      scope: [
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
      ],
      settings: {
        foreground: "#6f42c1",
      },
    },
    {
      name: "JSON Key - Level 3",
      scope: [
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
      ],
      settings: {
        foreground: "#6f42c1",
      },
    },
    {
      name: "Markdown - Plain",
      scope: [
        "text.html.markdown",
        "punctuation.definition.list_item.markdown",
      ],
      settings: {
        foreground: "#24292e",
      },
    },
    {
      name: "Markdown - Markup Raw Inline",
      scope: ["text.html.markdown markup.inline.raw.markdown"],
      settings: {
        foreground: "#032f62",
      },
    },
    {
      name: "Markdown - Markup Raw Inline Punctuation",
      scope: [
        "text.html.markdown markup.inline.raw.markdown punctuation.definition.raw.markdown",
      ],
      settings: {
        foreground: "#032f62",
      },
    },
    {
      name: "Markdown - Line Break",
      scope: ["text.html.markdown meta.dummy.line-break"],
      settings: {
        foreground: "#24292e",
      },
    },
    {
      name: "Markdown - Heading",
      scope: [
        "markdown.heading",
        "markup.heading | markup.heading entity.name",
        "markup.heading.markdown punctuation.definition.heading.markdown",
      ],
      settings: {
        foreground: "#005cc5",
      },
    },
    {
      name: "Markup - Italic",
      scope: ["markup.italic"],
      settings: {
        fontStyle: "italic",
        foreground: "#24292e",
      },
    },
    {
      name: "Markup - Bold",
      scope: ["markup.bold", "markup.bold string"],
      settings: {
        fontWeight: "bold",
        foreground: "#24292e",
      },
    },
    {
      name: "Markup - Bold-Italic",
      scope: [
        "markup.bold markup.italic",
        "markup.italic markup.bold",
        "markup.quote markup.bold",
        "markup.bold markup.italic string",
        "markup.italic markup.bold string",
        "markup.quote markup.bold string",
      ],
      settings: {
        fontWeight: "bold",
        fontStyle: "italic",
        foreground: "#24292e",
      },
    },
  ],
};
