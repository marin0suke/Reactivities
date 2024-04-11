import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";

interface Store { // 69. setting up MobX
    activityStore: ActivityStore
}

export const store: Store = {
    activityStore: new ActivityStore()
}

export const StoreContext = createContext(store);

export function useStore() { // 69 setting up mobx - create a simple react hook to allow us to use our stores inside out components
    return useContext(StoreContext);
}