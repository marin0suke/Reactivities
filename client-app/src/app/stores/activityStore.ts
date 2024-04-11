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
    loadingInitial = true; // 76. to get rid of flickering(but mine was ok before this change)

    constructor() {
        makeAutoObservable(this) //70. this was makeObservable, changed to auto in this lesson (this is a separate thing to import) which allowed to take out properties that are now inherently observable
    }

    get activitiesByDate() { //76. using map obj. uses map obj method.. now we have a computed property that will sort the activities in date order
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
        Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async () => { // 71. refactoring
        // this.setLoadingInitial(true); // SOLVING after 71. was missing this line. silly. 76. to solve flickering 
         try {
            const activities = await agent.Activities.list();
                runInAction(() => { 
                    activities.forEach(activity => {
                        activity.date = activity.date.split('T')[0]; // 62. [0] takes the first part of what is being split. indexing split by T.
                        this.activityRegistry.set(activity.id, activity); //76. instead of pushing to array, we add to map object, setting act id as key, and activity as value.
                        // this.activities.push(activity); // SOLVING after 71. was missing this in this line. silly.
                    });
                });
                this.setLoadingInitial(false);

        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    selectActivity = (id: string) => { // 73. select an activity with mobx
        this.selectedActivity = this.activityRegistry.get(id); // 76. map obj - this was a find method in array to get id if its exists - changed to get method in map obj.
    }

    cancelSelectedActivity = () => { // 73.
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => { // 73. 
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
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
                if (this.selectedActivity?.id === id) this.cancelSelectedActivity(); // 75. cancel viewing on right hand side after an activity has been deleted
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