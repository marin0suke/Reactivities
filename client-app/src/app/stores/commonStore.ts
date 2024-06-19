import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
    error: ServerError | null = null;
    token: string | null = localStorage.getItem("jwt");
    appLoaded = false;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.token,
            token => {
                if (token) {
                    localStorage.setItem("jwt", token)
                } else {
                    localStorage.removeItem("jwt")
                }
            }
        )
    }

    setServerError(error: ServerError) {
        this.error = error
    }

    setToken = (token: string | null) => {
        this.token = token;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }
}


// 112. created to handle 500 errors in the client
// 148. setting token on login - storing token inside state here. adding more properties - token and appLoaded
// add helper methods to both set token and set appLoaded.

//150. we had the token type in CommonStore class set to string | null | undefined = null; then in this lesson we had to set null to localstorage. keeping note here incase need to change back.
//. aslo added reaction inside constructor. we remove the if statement inside setToken - no longer needed.