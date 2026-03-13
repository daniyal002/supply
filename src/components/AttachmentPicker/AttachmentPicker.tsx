import { InboxOutlined } from "@ant-design/icons";
import { Empty, Image, message, Upload } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { UploadFile, UploadProps } from "antd/lib";
import React, { ReactNode, useMemo, useState } from "react";

interface Props {
  mode?: "edit" | "view";
  fileList?: UploadFile[];
  disabled?: boolean;
  hideDropzoneWhenDisabled?: boolean;
  multiple?: boolean;
  accept?: string;
  listType?: UploadProps["listType"];
  maxFiles?: number;
  maxFileSizeBytes?: number;
  title?: string;
  hint?: string;
  subHint?: string;
  emptyDescription?: string;
  icon?: ReactNode;
  onFilesSelected?: (files: File[], fileList: UploadFile[]) => void;
  onRemove?: (file: UploadFile) => boolean | Promise<boolean>;
  onValidationError?: (errorText: string) => void;
}

const IMAGE_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".bmp",
  ".webp",
  ".svg",
  ".heic",
  ".heif",
];

const isAcceptedByPattern = (file: File, pattern: string) => {
  const trimmedPattern = pattern.trim();

  if (!trimmedPattern) {
    return true;
  }

  if (trimmedPattern.endsWith("/*")) {
    const mimeGroup = trimmedPattern.replace("/*", "/");
    return file.type.startsWith(mimeGroup);
  }

  if (trimmedPattern.startsWith(".")) {
    return file.name.toLowerCase().endsWith(trimmedPattern.toLowerCase());
  }

  return file.type === trimmedPattern;
};

const isAcceptedFile = (file: File, accept?: string) => {
  if (!accept) {
    return true;
  }

  return accept
    .split(",")
    .some((pattern) => isAcceptedByPattern(file, pattern));
};

const isImageUploadFile = (file: UploadFile) => {
  if (file.type?.startsWith("image/")) {
    return true;
  }

  const candidate = (file.name || file.url || file.thumbUrl || "").toLowerCase();
  return IMAGE_EXTENSIONS.some((extension) => candidate.endsWith(extension));
};

const emitValidationError = (
  errorText: string,
  onValidationError?: (errorText: string) => void
) => {
  if (onValidationError) {
    onValidationError(errorText);
    return;
  }

  message.error(errorText);
};

export default function AttachmentPicker({
  mode = "edit",
  fileList = [],
  disabled = false,
  hideDropzoneWhenDisabled = false,
  multiple = true,
  accept,
  listType,
  maxFiles = 5,
  maxFileSizeBytes,
  title = "Перетащите файл или нажмите для загрузки",
  hint,
  subHint,
  emptyDescription = "Файлы не прикреплены",
  icon,
  onFilesSelected,
  onRemove,
  onValidationError,
}: Props) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const normalizedFileList = useMemo(
    () => fileList.filter((file) => file.status !== "error"),
    [fileList]
  );

  const handlePreview = (file: UploadFile) => {
    const previewUrl = file.url || file.thumbUrl;

    if (!previewUrl) {
      return;
    }

    if (isImageUploadFile(file)) {
      setPreviewImage(previewUrl);
      setPreviewOpen(true);
      return;
    }

    if (typeof window !== "undefined") {
      window.open(previewUrl, "_blank", "noopener,noreferrer");
    }
  };

  const previewNode = (
    <Image
      preview={{
        visible: previewOpen,
        src: previewImage,
        onVisibleChange: (visible) => setPreviewOpen(visible),
        afterOpenChange: (visible) => {
          if (!visible) {
            setPreviewImage("");
          }
        },
      }}
      src={previewImage}
      style={{ display: "none" }}
      alt="preview"
    />
  );

  const sharedUploadProps: UploadProps = {
    multiple,
    accept,
    disabled,
    listType,
    fileList: normalizedFileList,
    onPreview: handlePreview,
    isImageUrl: isImageUploadFile,
    showUploadList: {
      showRemoveIcon: !disabled,
      showDownloadIcon: false,
    },
  };

  if (mode === "view") {
    if (!normalizedFileList.length) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={emptyDescription}
        />
      );
    }

    return (
      <>
        <Upload {...sharedUploadProps} />
        {previewNode}
      </>
    );
  }

  const uploadProps: UploadProps = {
    ...sharedUploadProps,
    beforeUpload: (file, batchFileList) => {
      if (maxFileSizeBytes && file.size > maxFileSizeBytes) {
        emitValidationError(
          `Файл "${file.name}" больше ${Math.round(
            maxFileSizeBytes / 1024 / 1024
          )} МБ`,
          onValidationError
        );
        return Upload.LIST_IGNORE;
      }

      if (!isAcceptedFile(file as File, accept)) {
        emitValidationError("Недопустимый тип файла", onValidationError);
        return Upload.LIST_IGNORE;
      }

      const fileIndex = batchFileList.findIndex(
        (batchFile) => batchFile.uid === file.uid
      );

      if (normalizedFileList.length + fileIndex >= maxFiles) {
        emitValidationError(
          `Можно загрузить не более ${maxFiles} файлов`,
          onValidationError
        );
        return Upload.LIST_IGNORE;
      }

      return false;
    },
    onChange: ({ file, fileList: nextFileList }) => {
      if (file.status === "removed") {
        return;
      }

      const nextFiles = (nextFileList as UploadFile[])
        .filter((item) => item.originFileObj && !item.url)
        .map((item) => item.originFileObj as File);

      onFilesSelected?.(nextFiles, nextFileList as UploadFile[]);
    },
    onRemove,
  };

  if (disabled && hideDropzoneWhenDisabled) {
    return (
      <>
        <Upload {...uploadProps} />
        {previewNode}
      </>
    );
  }

  return (
    <>
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">{icon || <InboxOutlined />}</p>
        <p className="ant-upload-text">{title}</p>
        {hint && <p className="ant-upload-hint">{hint}</p>}
        {subHint && <p className="ant-upload-hint">{subHint}</p>}
      </Dragger>
      {previewNode}
    </>
  );
}
