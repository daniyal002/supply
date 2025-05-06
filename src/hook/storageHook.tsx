import { storageService } from "@/services/storage.service";
import { useQuery } from "@tanstack/react-query";

export const useStorageData = () => {
    const {
      data: storageData,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["Storage"],
      queryFn: storageService.getAllStorage,
      staleTime: Infinity,
    });
    return { storageData, isLoading, error };
  };
