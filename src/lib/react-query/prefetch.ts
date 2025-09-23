import { QueryClient } from "@tanstack/react-query";
import { helpService } from "@/services/help.service";

export const prefetchPosts = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery({
    queryKey: ["help"],
    queryFn: () => helpService.getHelp(),
  });
};
