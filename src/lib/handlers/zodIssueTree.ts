type ZodErrorTree = {
  errors?: string[];
  properties?: Record<string, ZodErrorTree>;
  items?: ZodErrorTree[];
};

export const flattenTree = (
  tree: ZodErrorTree,
  prefix = "",
): Record<string, string[]> => {
  const result: Record<string, string[]> = {};

  for (const key in tree) {
    const path = prefix ? `${prefix}.${key}` : key;
    const value = tree[key as keyof ZodErrorTree];

    if (key === "errors" && Array.isArray(value)) {
      result[path] = value as string[];
    } else if (typeof value === "object" && value !== null) {
      Object.assign(result, flattenTree(value as ZodErrorTree, path));
    }
  }

  return result;
};
