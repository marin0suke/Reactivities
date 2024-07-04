import { makeAutoObservable, runInAction } from "mobx";
import { Photo, Profile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false; // 203. another flag in our store so we can mark if uploading.
    loading = false; // 204. another flag to indicate loading for setting main photo.

    constructor() {
        makeAutoObservable(this);
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.username === this.profile.username;
        } 
        return false;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingProfile = false);
        }
    }

    uploadPhoto = async (file: Blob) => { // 203. adding photo upload method.
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data; // bc we aren't getting response body we created earlier.
            runInAction(() => { // next we want to modify our properties inside our profile store.
                if (this.profile) { // first make the check bc profile could be profile or null. do this to avoid the type safety warnings.
                    this.profile.photos?.push(photo); 
                    if (photo.isMain && store.userStore.user) { // check to see if the photo we are getting back is the main photo. if it is, we want to set our user obj in the userStore as well as the profile img that's in the profile obj. 2x obj to update.
                        store.userStore.setImage(photo.url); // went into userStore and added helper method setImage. then used it here to change user object.
                        this.profile.image = photo.url; // change in profile obj.
                    }
                }
                this.uploading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.uploading = false);
        }
    }

    setMainPhoto = async (photo: Photo) => { // 204. setting the main photo.
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id); 
            store.userStore.setImage(photo.url); // update the photo in the userstore - using this to display in the navbar. 
            runInAction(() => { // so we can update properties inside the profilestore itself.
                if (this.profile && this.profile.photos) { // check we have prof and photos.
                    this.profile.photos.find(p => p.isMain)!.isMain = false; // this sets the current main photo to false. can't use optional chaining when we are assigning something. swap for ! operator.
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true; // then we do the opposite - for the photo we are updating.
                    this.profile.image = photo.url; 
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction(() => this.loading = false);
            console.log(error);
        }
    }

    deletePhoto = async (photo: Photo) => { // 205. adding delete photo functionality.
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id); // so far copying what we did for setMainPHoto.
            runInAction (() => { // update properties ... ?? 
                if (this.profile) {
                    this.profile.photos = this.profile.photos?.filter(p => p.id !== photo.id); // filter will return a new array that will filter out all photos that don't match the id. (ie removing the photo with id).
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction(() => this.loading = false);
            console.log(error);
        }
    }
}

// 195. 