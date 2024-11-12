// import { env } from "../../env.mjs";
import { StateCreator } from "zustand";
import { ChatModel } from "../../../../../generated";
import { faL } from "@fortawesome/free-solid-svg-icons";

type State = {
  model: ChatModel;
  localMode: boolean;
  proMode: boolean;
};

type Actions = {
  setModel: (model: ChatModel) => void;
  toggleLocalMode: () => void;
  toggleProMode: () => void;
};

export type ConfigStore = State & Actions;

export const createConfigSlice: StateCreator<
  ConfigStore,
  [],
  [],
  ConfigStore
> = (set) => ({
  model: ChatModel.CUSTOM,
  localMode: true,
  proMode: false,
  setModel: (model: ChatModel) => set({ model }),
  toggleLocalMode: () =>
    set((state) => {
      const localModeEnabled = true;
      if (!localModeEnabled) {
        return { ...state, localMode: false };
      }

      const newLocalMode = !state.localMode;
      const newModel = newLocalMode
        ? ChatModel.LLAMA3
        : ChatModel.CUSTOM;
      return { localMode: newLocalMode, model: newModel };
    }),
  toggleProMode: () =>
    set((state) => {
      const proModeEnabled = true;
      if (!proModeEnabled) {
        return { ...state, proMode: false };
      }
      return { ...state, proMode: !state.proMode };
    }),
});