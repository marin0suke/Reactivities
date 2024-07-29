import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Photo, Profile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false; // 203. another flag in our store so we can mark if uploading.
    loading = false; // 204. another flag to indicate loading for setting main photo.
    followings: Profile[] = []; // 230. added. 
    loadingFollowings = false; // 232. added to use specifically to load followings. so not too many loading inicators at the same time.
    activeTab = 0; // 233. using MobX reactions.

    constructor() {
        makeAutoObservable(this);

        reaction( // 233. using MobX reactions. 
            () => this.activeTab, // add callback
            activeTab => { // 2nd param - what we want to do with this prop.
                if (activeTab === 3 || activeTab === 4) { // check if active tab is 3 or 4 (matches followers or followings)
                    const predicate = activeTab === 3 ? 'followers' : 'following'; // set var for predicate.
                    this.loadFollowings(predicate); // 
                } else {
                    this.followings = []; // if we dont do this and they click back to 3 or 4, danger they will see the previous list that doesn't match the tab they clicked on. 
                }
            }
        ) 
    }

    setActiveTab = (activeTab: number) => { // 233. add function to set active tab. pass in active tab as param. set type. 
        this.activeTab = activeTab;
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

    updateProfile = async (profile: Partial<Profile>) => { // Section 18 challenge.
        this.loading = true; // sets loading indicator on.
        try {
            await agent.Profiles.updateProfile(profile); // performs async operation updateProfile. method in the service layer that handles the HTTP request to update the profile on the server.
            runInAction(() => { // wraps changes to observables in batches. then notifies the observers once the action in complete.
                if (profile.displayName && profile.displayName !== store.userStore.user?.displayName) { // checks that displayName in profile update is different from the one already in the userStore.
                    store.userStore.setDisplayName(profile.displayName); // if cond is met then changes the displayName in the userStore.
                }
                    this.profile = {...this.profile, ...profile as Profile} // updates the local profile obj. merges existing and new profile properties. TS assertion used as Profile - to treat profile as a full Profile obj.
                    this.loading = false; // turning the loading flag off.
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false); // standard error handling for now.
        }
    }

    updateFollowing = async (username: string, following: boolean) => { // 230. method to update following status.
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);
            runInAction(() => {
                if (this.profile && this.profile.username !== store.userStore.user?.username && this.profile.username !== username) { // 233. added another && - prevent profile from updating when we are looking at a different users profile, but following someone on their list. 
                    following ? this.profile.followersCount++ : this.profile.followersCount--; // 
                    this.profile.following = !this.profile.following; // toggle following bool.
                    
                }
                
                if (this.profile && this.profile.username === store.userStore.user?.username) { // 233. if this and username match, and matches profilestore current.
                    following ? this.profile.followingCount++ : this.profile.followingCount--; // then we want to update the following count. 
                }

                this.followings.forEach(profile => {
                    if (profile.username === username) {
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following = !profile.following;
                    }
                })
                this.loading = false; // turn off loading flag (make sure inside runinaction)
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);   
        }
    }

    loadFollowings = async (predicate: string) => { // 232. getting a list of followings. here we don't need to put username as a param bc we will already have access to the profile inside profileStore at this stage already.
        this.loadingFollowings = true; // need different loading indicator otherwise too many loading indicators at the same time.
        try {
            const followings = await agent.Profiles.listFollowings(this.profile!.username, predicate); // bang operator for profile type.
            runInAction(() => {
                this.followings = followings;
                this.loadingFollowings = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingFollowings = false);
        }
    }
}

// 195. 