import { axiosWidthAuth } from "@/api/interseptors";
import {
    IStorage,
  IStorageCreateRequest,
  IStorageIdOnly,
  IStorageRequest,
  IStorageResponse,
  IStorageResponseItem,
} from "@/interface/storage";

export const storageService = {
  async getAllStorage() {
    const response = await axiosWidthAuth.get<IStorageResponse>(
      "/storage/get_all_storage",
    );
    return response.data.detail;
  },

  async addStorage(data:IStorageCreateRequest) {
    const response = await axiosWidthAuth.post<IStorageResponseItem>(
      "/storage/add_storage",
      data
    );
    return response.data;
  },

  async updateStorage(data:IStorageRequest) {
    const response = await axiosWidthAuth.put<IStorageResponseItem>(
      "/storage/update_storage",
      data
    );
    return response.data;
  },

  async archiveStorage(data:IStorageIdOnly) {
    const response = await axiosWidthAuth.put(
      "/storage/archive_storage",
      data
    );
    return response.data;
  },

  async deleteStorage(data:IStorageIdOnly) {
    const response = await axiosWidthAuth.delete(
      "/storage/delete_storage",
      {data}
    );
    return response.data;
  },
};
