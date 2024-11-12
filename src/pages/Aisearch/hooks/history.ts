import { useQuery } from "@tanstack/react-query";
// import { env } from "../env.mjs";
import { ChatSnapshot } from "../../../../generated";
import { baseUrl } from "@/utils/process";


export const fetchChatHistory = async (): Promise<ChatSnapshot[]> => {
  const response = await fetch(`${baseUrl}/history`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch chat history");
  }
  const data = await response.json();
  return data.snapshots;
};

export const useChatHistory = () => {
  return useQuery<ChatSnapshot[], Error>({
    queryKey: ["chatHistory"],
    queryFn: fetchChatHistory,
    retry: false,
  });
};
