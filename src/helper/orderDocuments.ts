export interface IOrderDocumentDto {
  path?: string | null;
  file_path?: string | null;
  file_name?: string | null;
}

const normalizePath = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const uploadSegment = "/upload/odoc/";
  const unixValue = trimmed.replace(/\\/g, "/");
  const normalizedSlashes = unixValue.replace(/\/{2,}/g, "/");

  const absoluteIdx = normalizedSlashes.indexOf(uploadSegment);
  if (absoluteIdx >= 0) {
    return normalizedSlashes.slice(absoluteIdx);
  }

  const relativeIdx = normalizedSlashes.indexOf("upload/odoc/");
  if (relativeIdx >= 0) {
    return `/${normalizedSlashes.slice(relativeIdx)}`;
  }

  const withoutPrefix = normalizedSlashes.replace(/^\/+/, "");
  return `${uploadSegment}${withoutPrefix}`;
};

export const normalizeOrderDocumentPath = (
  doc: string | IOrderDocumentDto | null | undefined
): string => {
  if (!doc) {
    return "";
  }

  if (typeof doc === "string") {
    return normalizePath(doc);
  }

  const fileName = typeof doc.file_name === "string" ? doc.file_name : "";
  const path = typeof doc.path === "string" ? doc.path : "";
  const filePath = typeof doc.file_path === "string" ? doc.file_path : "";

  // Prefer explicit path fields, fallback to file_name.
  return normalizePath(path || filePath || fileName);
};

export const normalizeOrderDocuments = (
  docs: Array<string | IOrderDocumentDto> | null | undefined
): string[] => {
  if (!Array.isArray(docs)) {
    return [];
  }

  return docs
    .map((doc) => normalizeOrderDocumentPath(doc))
    .filter((doc): doc is string => Boolean(doc));
};

export const getOrderDocumentName = (
  doc: string | IOrderDocumentDto | null | undefined
) => {
  const normalizedPath = normalizeOrderDocumentPath(doc).split("?")[0];
  const fileName = normalizedPath.split("/").filter(Boolean).pop();
  return fileName || "";
};

export const getOrderDocumentUrl = (
  doc: string | IOrderDocumentDto | null | undefined
) => {
  const normalizedPath = normalizeOrderDocumentPath(doc);

  if (
    normalizedPath.startsWith("http://") ||
    normalizedPath.startsWith("https://")
  ) {
    return normalizedPath;
  }

  return `${process.env.NEXT_PUBLIC_API_URL || ""}${normalizedPath}`;
};

export const normalizeOrderDocumentItem = (
  doc: string | IOrderDocumentDto | null | undefined
) => {
  const path = normalizeOrderDocumentPath(doc);
  const file_name =
    typeof doc === "object" && doc?.file_name
      ? getOrderDocumentName(doc.file_name)
      : getOrderDocumentName(path);

  if (!path || !file_name) {
    return null;
  }

  return {
    path,
    file_name,
  };
};

export const normalizeOrderDocumentItems = (
  docs: Array<string | IOrderDocumentDto> | null | undefined
) => {
  if (!Array.isArray(docs)) {
    return [];
  }

  return docs
    .map((doc) => normalizeOrderDocumentItem(doc))
    .filter(
      (
        doc
      ): doc is {
        path: string;
        file_name: string;
      } => Boolean(doc)
    );
};
