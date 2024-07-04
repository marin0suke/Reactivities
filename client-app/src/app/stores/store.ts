import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import ModalStore from "./modalStore";
import ProfileStore from "./profileStore";

interface Store { // 69. setting up MobX
    activityStore: ActivityStore
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
    profileStore: ProfileStore; // 195.
}

export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfileStore() // 195.
}

export const StoreContext = createContext(store);

export function useStore() { // 69 setting up mobx - create a simple react hook to allow us to use our stores inside out components
    return useContext(StoreContext);
}

// 112. commonStore added to interface as a commonstore, then added inside const Store.
//145.  adding interfaces and methods. added userStore in interface, and in const Store.
// 152. adding modals. added modalStore in interface and in const Store.