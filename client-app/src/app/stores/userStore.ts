import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (creds: UserFormValues) => {
        const user = await agent.Account.login(creds);
        store.commonStore.setToken(user.token);
        runInAction(() => this.user = user);
        router.navigate("/activities");
        store.modalStore.closeModal(); // 152. adding modals - adding closing functionality after user has filled in the form. 
    }

    register = async (creds: UserFormValues) => {
        const user = await agent.Account.register(creds);
        store.commonStore.setToken(user.token);
        runInAction(() => this.user = user);
        router.navigate("/activities");
        store.modalStore.closeModal(); 
    }
    
    // 153. adding rego form - adding method here for functionality.

    logout = () => {
        store.commonStore.setToken(null);
        // localStorage.removeItem("jwt");  150. added reaction in commonStore so this is no longer needed (keeping it for notes)
        this.user = null;
        router.navigate("/");
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => this.user = user);
        } catch (error) {
            console.log(error);
        }
    }
}

//145. creating the interfaces and methods. new file! 
//148. after we get th user back from the API, will make use of the store. access commonStore, and setToken, and pass in user.token. 
// specify that this.user = user
// then redirect to activities.
// also add a logout option while we are here. 
//150. added getUser method. remove the setting setToken inside login and logout methods. when we're using commonstore to set token, the reaction will run. so the setToken methods are redundant