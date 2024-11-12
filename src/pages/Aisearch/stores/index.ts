// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { ConfigStore, createConfigSlice } from "./slices/configSlice";
// import { createMessageSlice, ChatStore } from "./slices/messageSlice";

// type StoreState = ChatStore & ConfigStore;

// const useStore = create<StoreState>()(
//   persist(
//     (...a) => ({
//       ...createMessageSlice(...a),
//       ...createConfigSlice(...a),
//     }),
//     {
//       name: "store",
//       partialize: (state) => ({
//         model: state.model,
//         localMode: state.localMode,
//         proMode: state.proMode,
//       }),
//     },
//   ),
// );

// export const useChatStore = () =>
//   useStore((state) => ({
//     messages: state.messages,
//     addMessage: state.addMessage,
//     setMessages: state.setMessages,
//     threadId: state.threadId,
//     setThreadId: state.setThreadId,
//   }));

// export const useConfigStore = () =>
//   useStore((state) => ({
//     localMode: state.localMode,
//     toggleLocalMode: state.toggleLocalMode,
//     model: state.model,
//     setModel: state.setModel,
//     proMode: state.proMode,
//     toggleProMode: state.toggleProMode,
//   }));
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ConfigStore, createConfigSlice } from "./slices/configSlice";
import { createMessageSlice, ChatStore } from "./slices/messageSlice";
import { useMemo } from "react";

type StoreState = ChatStore & ConfigStore;

const useStore = create<StoreState>()(
  persist(
    (set, get, api) => ({
      ...createMessageSlice(set, get, api),
      ...createConfigSlice(set, get, api),
    }),
    {
      name: "store",
      partialize: (state) => ({
        model: state.model,
        localMode: state.localMode,
        proMode: state.proMode,
      }),
    },
  ),
);

export const useChatStore = () => {
  const store = useStore();
  return useMemo(() => ({
    messages: store.messages,
    addMessage: store.addMessage,
    setMessages: store.setMessages,
    threadId: store.threadId,
    setThreadId: store.setThreadId,
  }), [store]);
};

export const useConfigStore = () => {
  const store = useStore();
  return useMemo(() => ({
    localMode: store.localMode,
    toggleLocalMode: store.toggleLocalMode,
    model: store.model,
    setModel: store.setModel,
    proMode: store.proMode,
    toggleProMode: store.toggleProMode,
  }), [store]);
};