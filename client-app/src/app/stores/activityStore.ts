import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import {v4 as uuid} from 'uuid';

export default class ActivityStore { // 69. setting up MobX
    // activities: Activity[] = []; 76. no longer needed - array. using map obj instead

    activityRegistry = new Map<string, Activity>(); // 76. instantiate new map obj, instead of using an array.
    selectedActivity: Activity | undefined = undefined;
    editMode: boolean = false; // 71. refactoring - EDITED AGAIN SEE BELOW:(had to add undefined here and for loading so the error went away)
    loading: boolean = false; // EDIT - this was false | undefined but changed to boolean - so it can be changed to true.
    loadingInitial = false; // 76. to get rid of flickering(but mine was ok before this change)

    constructor() {
        makeAutoObservable(this) //70. this was makeObservable, changed to auto in this lesson (this is a separate thing to import) which allowed to take out properties that are now inherently observable
    }

    get activitiesByDate() { //76. using map obj. uses map obj method.. now we have a computed property that will sort the activities in date order
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
        Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async () => { // 71. refactoring
        this.setLoadingInitial(true); // 84. have to set this back to true since after we load a single activity, it is set to false. so we don't get the loading indictor when returning to the full activities page
        // this.setLoadingInitial(true); // SOLVING after 71. was missing this line. silly. 76. to solve flickering 
         try {
            const activities = await agent.Activities.list();
                runInAction(() => { 
                    activities.forEach(activity => {
                        this.setActivity(activity); // 83. using private function now
                    });
                });
                this.setLoadingInitial(false);

        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    // 83. getting an individual activity. we want to check if activity is inside Registry. if it isn't we need to get it from API
    loadActivity = async (id: string) => {
        let activity = this.getActivity(id); // using let so it can be reassigned to activities details in agent.
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        } else { // if undefined and no activity in registry -
            this.setLoadingInitial(true); 
            try {   // try catch bc we will need to go to API
                activity = await agent.Activities.details(id); // attempt to get activity. if we do get it, we set it in registry.
                this.setActivity(activity); // after grabbed, set it using private function
                runInAction(() => this.selectedActivity = activity); // 84. had to add this since we were missing it - we do this above, but we were missing it in the try catch block 85. put this in a runInAction
                
                this.setLoadingInitial(false); //
            } catch (error) {
                console.log(error); // basic dealing with errors
                this.setLoadingInitial(false); 
            }
        }
    }

    // 83. below - private method to set an activity. CUT from loadActivities.
    //


    private setActivity = (activity: Activity) => { // 83. getting individual activity - block below was cut from loadActivities
        activity.date = activity.date.split('T')[0]; // 62. [0] takes the first part of what is being split. indexing split by T.
        this.activityRegistry.set(activity.id, activity); //76. instead of pushing to array, we add to map object, setting act id as key, and activity as value.
    }

    private getActivity = (id: string) => { // 83. will either return activity or undefined.
        return this.activityRegistry.get(id);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();
        try {
            await agent.Activities.create(activity)
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity); // 76. map obj - set instead of push to array
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => { // 74. create activity using mobx
        this.loading = true;
        try {   
            await agent.Activities.update(activity);
            runInAction(() => {
                // this.activities = [...this.activities.filter(a => a.id !== activity.id), activity]; 76. map obj instead of array
                this.activityRegistry.set(activity.id, activity); //76. map obj instead of array.
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error); 
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) => { // 75. delete activity using mobx
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                // this.activities = [...this.activities.filter(a => a.id !== id)]; // 75. deletes activity 76. map obj update instead of array
                this.activityRegistry.delete(id); // 76. map instead of array - id only when deleting.
                // if (this.selectedActivity?.id === id) this.cancelSelectedActivity(); // 75. cancel viewing on right hand side after an activity has been deleted // 83. 4x functions deleted now so not using selectedActivity
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }


}