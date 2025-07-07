import { combineReducers, configureStore, AnyAction } from "@reduxjs/toolkit";
import { persistStore, persistReducer, PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";
import noopStorage from "./noopStorage";
import cartReducer from "./cart/slice";
import userReducer from "./user/slice";
import { appApi } from "@/api/appApi";

const rootReducer = combineReducers({
  [appApi.reducerPath]: appApi.reducer,
  shoppingCart: cartReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

function syncReducer(
  state: RootState | undefined,
  action: AnyAction
): RootState {
  if (action.type === "SYNC_STATE_FROM_BROADCAST") {
    return {
      ...state,
      ...action.payload,
    };
  }
  return rootReducer(state, action);
}

const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage: typeof window !== "undefined" ? storage : noopStorage,
  whitelist: ["shoppingCart", "user"]
};

const persistedReducer = persistReducer(persistConfig, syncReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(appApi.middleware),
});

const persistor = persistStore(store);

if (typeof window !== "undefined") {
  const bc = new BroadcastChannel("redux_sync_channel");

  let isDispatchingFromBroadcast = false;

  // Suscribirse a los cambios del estado local
  store.subscribe(() => {
    if (!isDispatchingFromBroadcast) {
      const state = store.getState();
      bc.postMessage(state);
    }
    isDispatchingFromBroadcast = false;
  });

  // Recibir cambios de otros tabs
  bc.onmessage = (event) => {
    const newState = event.data;
    const currentState = store.getState();

    // Verificar si el estado recibido es diferente
    if (JSON.stringify(newState) !== JSON.stringify(currentState)) {
      isDispatchingFromBroadcast = true;
      store.dispatch({ type: "SYNC_STATE_FROM_BROADCAST", payload: newState });
    }
  };
}

export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export { store, persistor };
