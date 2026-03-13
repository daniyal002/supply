import { UploadFile } from "antd/lib";

export const DEFAULT_ATTACHMENT_MAX_FILES = 5;
export const DEFAULT_ATTACHMENT_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const ORDER_DOCUMENT_PICKER_CONFIG = {
  maxFiles: DEFAULT_ATTACHMENT_MAX_FILES,
  maxFileSizeBytes: DEFAULT_ATTACHMENT_MAX_FILE_SIZE_BYTES,
  title: "Перетащите файл или нажмите для загрузки",
  hint: "Файлы будут загружены только после нажатия Создать, Перезапуск или Сохранить",
  subHint: "Максимум 5 файлов, до 10 МБ каждый",
  emptyDescription: "Документы не прикреплены",
} as const;

export const PRODUCT_IMAGE_PICKER_CONFIG = {
  maxFiles: DEFAULT_ATTACHMENT_MAX_FILES,
  title: "Кликните или перетащите изображение",
  hint: "Поддержка одиночной или множественной загрузки изображений",
} as const;

export const getLocalAttachmentKey = (file: File) =>
  `${file.name}-${file.size}-${file.lastModified}`;

export const toLocalUploadFile = (
  file: File,
  uidPrefix = "local"
): UploadFile => ({
  uid: `${uidPrefix}-${getLocalAttachmentKey(file)}`,
  name: file.name,
  status: "done",
  originFileObj: file as any,
});

interface RemoteUploadFileParams {
  uid: string;
  name: string;
  url: string;
}

export const toRemoteUploadFile = ({
  uid,
  name,
  url,
}: RemoteUploadFileParams): UploadFile => ({
  uid,
  name,
  status: "done",
  url,
});
