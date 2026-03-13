import {
  IOrderDocumentItem,
  IOrderDocumentUploadItem,
} from "@/interface/orderItem";
import {
  normalizeOrderDocumentItem,
  normalizeOrderDocumentItems,
  normalizeOrderDocumentPath,
} from "@/helper/orderDocuments";

interface ISubmitOrderDocumentsParams<T> {
  existingDocuments?: IOrderDocumentItem[];
  removedDocuments?: IOrderDocumentItem[];
  newDocuments?: File[];
  uploadDocuments: (files: File[]) => Promise<IOrderDocumentUploadItem[]>;
  deleteDocument: (data: { file_name: string }) => Promise<unknown>;
  submitRequest: (documents: string[]) => Promise<T>;
}

export const createOrderDocumentFormState = (
  docs?: Array<string | { path?: string | null; file_path?: string | null; file_name?: string | null }>
) => {
  const existingDocuments = normalizeOrderDocumentItems(docs);

  return {
    documents: existingDocuments.map((doc) => doc.path),
    existingDocuments,
    removedDocuments: [],
    newDocuments: [],
  };
};

export const getVisibleOrderDocuments = (
  existingDocuments?: IOrderDocumentItem[],
  removedDocuments?: IOrderDocumentItem[]
) => {
  const removedPaths = new Set(
    normalizeOrderDocumentItems(removedDocuments).map((doc) => doc.path)
  );

  return normalizeOrderDocumentItems(existingDocuments).filter(
    (doc) => !removedPaths.has(doc.path)
  );
};

export const submitOrderDocuments = async <T>({
  existingDocuments = [],
  removedDocuments = [],
  newDocuments = [],
  uploadDocuments,
  deleteDocument,
  submitRequest,
}: ISubmitOrderDocumentsParams<T>) => {
  const normalizedExisting = normalizeOrderDocumentItems(existingDocuments);
  const normalizedRemoved = normalizeOrderDocumentItems(removedDocuments);
  const uploadedDocuments =
    newDocuments.length > 0 ? await uploadDocuments(newDocuments) : [];
  const removedFileNames = normalizedRemoved.map((doc) => doc.file_name);

  try {
    for (const fileName of removedFileNames) {
      await deleteDocument({ file_name: fileName });
    }

    const removedPaths = new Set(normalizedRemoved.map((doc) => doc.path));
    const keptExistingDocuments = normalizedExisting.filter(
      (doc) => !removedPaths.has(doc.path)
    );
    const finalDocumentItems = [
      ...keptExistingDocuments,
      ...uploadedDocuments
        .map((doc) => normalizeOrderDocumentItem(doc))
        .filter((doc): doc is IOrderDocumentItem => Boolean(doc)),
    ];
    const payloadDocuments = [
      ...keptExistingDocuments.map((doc) => doc.file_name),
      ...uploadedDocuments.map((doc) => doc.file_name),
    ];

    const response = await submitRequest(payloadDocuments);

    return {
      response,
      uploadedDocuments,
      payloadDocuments,
      finalDocumentItems,
    };
  } catch (error) {
    for (const uploadedDocument of uploadedDocuments) {
      const normalizedUpload = normalizeOrderDocumentItem(uploadedDocument);

      if (normalizedUpload?.file_name) {
        try {
          await deleteDocument({ file_name: normalizedUpload.file_name });
        } catch {
          // Ignore cleanup errors to preserve original failure.
        }
      }
    }

    throw error;
  }
};
