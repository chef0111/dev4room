import qs from "query-string";

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const queryString = qs.parse(params);

  if (value) {
    queryString[key] = value;
  } else {
    delete queryString[key];
  }

  if (key !== "page") {
    queryString.page = "1";
  }

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryString,
    },
    {
      // Ensure `query` is first and `page` is last among present params
      sort: (a, b) => {
        if (a === "query" && b !== "query") return -1;
        if (b === "query" && a !== "query") return 1;
        if (a === "page" && b !== "page") return 1;
        if (b === "page" && a !== "page") return -1;
        return 0;
      },
    },
  );
};

export const removeKeysFromUrlQuery = ({
  params,
  keysToRemove,
}: RemoveKeysParams) => {
  const queryString = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete queryString[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryString,
    },
    { skipNull: true },
  );
};
