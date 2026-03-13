import AttachmentPicker from "@/components/AttachmentPicker/AttachmentPicker";
import { ORDER_DOCUMENT_PICKER_CONFIG, toRemoteUploadFile } from "@/helper/attachmentPicker";
import {
  IOrderDocumentDto,
  getOrderDocumentName,
  getOrderDocumentUrl,
  normalizeOrderDocuments,
} from "@/helper/orderDocuments";
import { UploadFile } from "antd/lib";
import React, { useMemo } from "react";

interface Props {
  documents?: Array<string | IOrderDocumentDto>;
}

export default function OrderDocumentsView({ documents = [] }: Props) {
  const fileList = useMemo<UploadFile[]>(
    () =>
      normalizeOrderDocuments(documents).map((filePath, index) =>
        toRemoteUploadFile({
          uid: `view-${index}-${filePath}`,
          name: getOrderDocumentName(filePath),
          url: getOrderDocumentUrl(filePath),
        })
      ),
    [documents]
  );

  return (
    <AttachmentPicker
      mode="view"
      fileList={fileList}
      emptyDescription={ORDER_DOCUMENT_PICKER_CONFIG.emptyDescription}
      listType="picture-card"
    />
  );
}
