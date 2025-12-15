import { useState, useCallback } from 'react';
import { UploadFile } from 'antd/lib/upload/interface';

export const useImageUpload = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const initializeImages = useCallback((existingImages: string[] = []) => {
    const existingFiles: UploadFile[] = existingImages.map((fileName, index) => ({
      uid: `existing-${index}-${fileName}`,
      name: fileName,
      status: 'done',
      url: `${process.env.NEXT_PUBLIC_API_URL}/upload/product/${fileName}`,
    }));

    setFileList(existingFiles);
    setImagesToUpload([]);
    setImagesToDelete([]);
  }, []);

  const handleImageChange = useCallback((info: any) => {
    // Обновляем fileList для отображения
    const newFileList = info.fileList.filter((file: UploadFile) => !!file.status);
    setFileList(newFileList);

    // Собираем только новые файлы для загрузки
    const newFiles = info.fileList
      .filter((file: UploadFile) => file.originFileObj && !file.url)
      .map((file: UploadFile) => file.originFileObj as File);

    setImagesToUpload(newFiles);
  }, []);

  const handleImageRemove = useCallback((file: UploadFile) => {
    // Удаляем из fileList
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));

    // Если файл был загружен ранее (есть url, но нет originFileObj)
    if (file.url && !file.originFileObj) {
      setImagesToDelete((prev) => [...prev, file.name]);
    }

    // Если файл еще не загружен (есть originFileObj)
    if (file.originFileObj) {
      setImagesToUpload((prev) =>
        prev.filter((f) => f.name !== file.originFileObj?.name)
      );
    }

    return true;
  }, []);

  const resetImages = useCallback(() => {
    setFileList([]);
    setImagesToUpload([]);
    setImagesToDelete([]);
  }, []);

  return {
    fileList,
    imagesToUpload,
    imagesToDelete,
    initializeImages,
    handleImageChange,
    handleImageRemove,
    resetImages,
  };
};