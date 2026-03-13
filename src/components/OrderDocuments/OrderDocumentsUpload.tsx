import { InboxOutlined } from "@ant-design/icons";
import AttachmentPicker from "@/components/AttachmentPicker/AttachmentPicker";
import {
  ORDER_DOCUMENT_PICKER_CONFIG,
  getLocalAttachmentKey,
  toLocalUploadFile,
  toRemoteUploadFile,
} from "@/helper/attachmentPicker";
import { getVisibleOrderDocuments } from "@/helper/orderDocumentSubmit";
import {
  getOrderDocumentName,
  getOrderDocumentUrl,
} from "@/helper/orderDocuments";
import { IOrderDocumentItem } from "@/interface/orderItem";
import { UploadFile } from "antd/lib";
import React, { useEffect, useMemo, useState } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

type OrderDocumentFile = UploadFile & {
  filePath?: string;
  fileName?: string;
};

interface Props {
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  disabled?: boolean;
}

const toServerFile = (
  doc: IOrderDocumentItem,
  index: number
): OrderDocumentFile => ({
  ...toRemoteUploadFile({
    uid: `server-${index}-${doc.path}`,
    name: doc.file_name || getOrderDocumentName(doc.path),
    url: getOrderDocumentUrl(doc.path),
  }),
  filePath: doc.path,
  fileName: doc.file_name,
});

const toLocalFile = (file: File): OrderDocumentFile =>
  toLocalUploadFile(file) as OrderDocumentFile;

export default function OrderDocumentsUpload({
  setValue,
  watch,
  disabled = false,
}: Props) {
  const watchedExistingDocuments = watch("existingDocuments");
  const watchedRemovedDocuments = watch("removedDocuments");
  const watchedNewDocuments = watch("newDocuments");
  const existingDocuments = useMemo(
    () => (watchedExistingDocuments || []) as IOrderDocumentItem[],
    [watchedExistingDocuments]
  );
  const removedDocuments = useMemo(
    () => (watchedRemovedDocuments || []) as IOrderDocumentItem[],
    [watchedRemovedDocuments]
  );
  const newDocuments = useMemo(
    () => (watchedNewDocuments || []) as File[],
    [watchedNewDocuments]
  );

  const [fileList, setFileList] = useState<OrderDocumentFile[]>([]);

  const visibleServerDocuments = useMemo(
    () => getVisibleOrderDocuments(existingDocuments, removedDocuments),
    [existingDocuments, removedDocuments]
  );

  useEffect(() => {
    const serverFiles = visibleServerDocuments.map(toServerFile);
    const localFiles = newDocuments.map(toLocalFile);
    setFileList([...serverFiles, ...localFiles]);
    setValue(
      "documents",
      visibleServerDocuments.map((doc) => doc.path),
      { shouldDirty: false }
    );
  }, [newDocuments, setValue, visibleServerDocuments]);

  return (
    <AttachmentPicker
      fileList={fileList}
      disabled={disabled}
      hideDropzoneWhenDisabled
      listType="picture-card"
      maxFiles={ORDER_DOCUMENT_PICKER_CONFIG.maxFiles}
      maxFileSizeBytes={ORDER_DOCUMENT_PICKER_CONFIG.maxFileSizeBytes}
      title={ORDER_DOCUMENT_PICKER_CONFIG.title}
      hint={ORDER_DOCUMENT_PICKER_CONFIG.hint}
      subHint={ORDER_DOCUMENT_PICKER_CONFIG.subHint}
      icon={<InboxOutlined />}
      onFilesSelected={(nextLocalFiles) => {
        const existingKeys = new Set(newDocuments.map(getLocalAttachmentKey));
        const mergedLocalFiles = [...newDocuments];

        nextLocalFiles.forEach((nextFile) => {
          const key = getLocalAttachmentKey(nextFile);
          if (!existingKeys.has(key)) {
            existingKeys.add(key);
            mergedLocalFiles.push(nextFile);
          }
        });

        setValue("newDocuments", mergedLocalFiles, {
          shouldDirty: true,
        });
      }}
      onRemove={(file) => {
        const orderFile = file as OrderDocumentFile;

        if (orderFile.originFileObj) {
          const nextLocalFiles = newDocuments.filter(
            (doc) =>
              getLocalAttachmentKey(doc) !==
              getLocalAttachmentKey(orderFile.originFileObj as File)
          );
          setValue("newDocuments", nextLocalFiles, {
            shouldDirty: true,
          });
          return true;
        }

        if (orderFile.filePath && orderFile.fileName) {
          const removedExists = removedDocuments.some(
            (doc) => doc.path === orderFile.filePath
          );

          if (!removedExists) {
            setValue(
              "removedDocuments",
              [
                ...removedDocuments,
                {
                  path: orderFile.filePath,
                  file_name: orderFile.fileName,
                },
              ],
              { shouldDirty: true }
            );
          }
        }

        return true;
      }}
    />
  );
}
