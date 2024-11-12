// import { type ClassValue, clsx } from "clsx";
// import { twMerge } from "tailwind-merge";
// import { ChatModel } from "../../../../generated";

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }


// export function isCloudModel(model: ChatModel) {
//   return [
//     ChatModel.LLAMA_3_70B,
//     ChatModel.GPT_4O,
//     ChatModel.GPT_4O_MINI,
//   ].includes(model);
// }
// export function isLocalModel(model: ChatModel) {
//   return !isCloudModel(model);
// }

import { twMerge } from "tailwind-merge";
import { ChatModel } from "../../../../generated";

// 自定义类名合并函数
export function cn(...inputs: (string | undefined | false | null)[]) {
  return twMerge(inputs.filter(Boolean).join(' '));
}

export function isCloudModel(model: ChatModel) {
  return [
    ChatModel.LLAMA_3_70B,
    ChatModel.GPT_4O,
    ChatModel.GPT_4O_MINI,
  ].includes(model);
}

export function isLocalModel(model: ChatModel) {
  return !isCloudModel(model);
}