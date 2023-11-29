import {
  isError,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import customFetch from "./utils";
import { toast } from "react-toastify";

export const useFetchTasks = () => {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await customFetch.get("/");
      return data;
    },
  });
  return { isLoading, isError, data };
};

export const useCreateTasks = () => {
  const queryClient = useQueryClient();
  const { mutate: createTask, isLoading } = useMutation({
    mutationFn: (taskTitle) => customFetch.post("/", { title: taskTitle }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("task added");
    },
    onError: (error) => {
      toast.error(error.response.data.msg);
    },
  });
  return { createTask, isLoading };
};

export const useEditTasks = () => {
  const queryClient = useQueryClient();
  const { mutate: editTask } = useMutation({
    mutationFn: ({ taskId, isDone }) =>
      customFetch.patch(`/${taskId}`, { isDone }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("task updated");
    },
    onError: () => {
      toast.error(error.response.data.msg);
    },
  });
  return { editTask };
};

export const useDeleteTasks = () => {
  const queryClient = useQueryClient();
  const { mutate: deleteTask, isLoading: deleteTaskLoading } = useMutation({
    mutationFn: ({ taskId }) => customFetch.delete(`/${taskId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("task deleted");
    },
    onError: () => {
      toast.error(error.response.data.msg);
    },
  });
  return { deleteTask, deleteTaskLoading };
};
