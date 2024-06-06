import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";

interface Store { // 69. setting up MobX
    activityStore: ActivityStore
    commonStore: CommonStore;
}

export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore()
}

export const StoreContext = createContext(store);

export function useStore() { // 69 setting up mobx - create a simple react hook to allow us to use our stores inside out components
    return useContext(StoreContext);
}

// 112. commonStore added to interface as a commonstore, then added inside the store.