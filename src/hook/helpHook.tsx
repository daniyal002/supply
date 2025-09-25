import { IErrorResponse } from "@/interface/error";
import { IHelp } from "@/interface/help";
import { helpService } from "@/services/help.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axios, { AxiosError } from "axios";

export const useHelpData = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryFn: helpService.getHelp,
    queryKey: ["help"],
    staleTime: 1000 * 60 * 5,
  });

  return { data, isLoading, isError, error };
};

export const useRegisterHelpView = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (helpId: number) => helpService.registerHelpView(helpId),
    mutationKey: ["registerHelpView"],
    onSuccess(data, variables) {
      queryClient.setQueryData(["help"], (oldData: IHelp[] | undefined) => {
        if (!oldData) return [];
        return oldData.map((help) =>
          help.help_id === variables ? {...help, view_count: data.detail.view_count} : help
        );
      });
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });

  return { mutate };
};
