import { configureStore } from "@reduxjs/toolkit";
import parkingAreasSlice from "./slices/ParkingAreasSlice";
import modalSlice from "./slices/ModalSlice";

export const store = configureStore({
    reducer: {
        parkingAreas: parkingAreasSlice,
        modal: modalSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch