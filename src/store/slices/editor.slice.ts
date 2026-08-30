import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICanvasCard, ICardLayer } from "@/interfaces/editor.interface";

export interface EditorState {
  card: ICanvasCard;
  selectedLayerId: string | null;
  zoom: number;
  history: ICardLayer[][];
  historyIndex: number;
}

const initialCard: ICanvasCard = {
  id: "default-card",
  title: "Untitled Card",
  width: 800,
  height: 1200,
  backgroundColor: "#FFFFFF",
  layers: [],
};

const initialState: EditorState = {
  card: initialCard,
  selectedLayerId: null,
  zoom: 1,
  history: [[]],
  historyIndex: 0,
};

const pushHistory = (state: EditorState) => {
  state.history = state.history.slice(0, state.historyIndex + 1);
  state.history.push([...state.card.layers]);
  state.historyIndex = state.history.length - 1;
};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setCard: (state, action: PayloadAction<ICanvasCard>) => {
      state.card = action.payload;
      state.selectedLayerId = null;
      state.history = [[...action.payload.layers]];
      state.historyIndex = 0;
    },
    selectLayer: (state, action: PayloadAction<string | null>) => {
      state.selectedLayerId = action.payload;
    },
    addLayer: (state, action: PayloadAction<ICardLayer>) => {
      state.card.layers.push(action.payload);
      state.selectedLayerId = action.payload.id;
      pushHistory(state);
    },
    updateLayer: (state, action: PayloadAction<{ id: string; changes: Partial<ICardLayer> }>) => {
      const index = state.card.layers.findIndex((l) => l.id === action.payload.id);
      if (index !== -1) {
        state.card.layers[index] = {
          ...state.card.layers[index],
          ...action.payload.changes,
        } as ICardLayer;
        pushHistory(state);
      }
    },
    removeLayer: (state, action: PayloadAction<string>) => {
      state.card.layers = state.card.layers.filter((l) => l.id !== action.payload);
      if (state.selectedLayerId === action.payload) {
        state.selectedLayerId = null;
      }
      pushHistory(state);
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = Math.max(0.1, Math.min(3, action.payload));
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1;
        state.card.layers = [...state.history[state.historyIndex]];
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1;
        state.card.layers = [...state.history[state.historyIndex]];
      }
    },
  },
});

export const {
  setCard,
  selectLayer,
  addLayer,
  updateLayer,
  removeLayer,
  setZoom,
  undo,
  redo,
} = editorSlice.actions;

export default editorSlice.reducer;
