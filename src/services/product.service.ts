import { axiosWidthAuth } from "@/api/interseptors";
import { IUnitMeasurement } from "@/interface/basicUnit";
import {
  IProductGroupResponse,
  IProductImageResponse,
  IProductResponse,
} from "@/interface/product";

export const productService = {
  async getProduct() {
    const response = await axiosWidthAuth.get<IProductResponse>(
      "/product/get_product"
    );
    return response.data.detail;
  },
  async getProductGroup() {
    const response = await axiosWidthAuth.get<IProductGroupResponse>(
      "/product/get_product_group"
    );
    return response.data.detail;
  },
  async getAllUnitMeasurment() {
    const response = await axiosWidthAuth.get<IUnitMeasurement>(
      "/product/get_all_unit_measurement"
    );
    return response.data.detail;
  },

  async uploadProductImage(files: File[]) {
    // 1. Создайте объект FormData
    const formData = new FormData();

    // 2. Добавьте каждый файл в formData под именем 'files'
    files.forEach((file) => {
      // Первый аргумент - имя поля ('files'), второй - сам файл
      formData.append("files", file);
    });

    // 3. Отправьте formData
    // При использовании formData, axios автоматически устанавливает
    // правильный заголовок 'Content-Type: multipart/form-data'
    // с нужным 'boundary'.
    // Вы можете убрать его из 'headers', но оставить не будет ошибкой.
    try {
      const response = await axiosWidthAuth.post<IProductImageResponse>(
        "/product/upload_product_image",
        formData, // <--- Отправляем объект FormData
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return response.data.detail;
    } catch (error) {
      // Обработка ошибок
      console.error("Ошибка при загрузке изображений:", error);
      throw error; // Перебрасываем ошибку для дальнейшей обработки
    }
  },

  async deleteProductImage(fileName: string) {
    const response = await axiosWidthAuth.delete<string>(
      "/product/delete_product_image",
      { data: { file_name: fileName } }
    );

    return response.data;
  },
};
