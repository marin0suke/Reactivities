import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import {v4 as uuid} from 'uuid';
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";
import { Pagination, PagingParams } from "../models/pagination";

export default class ActivityStore { // 69. setting up MobX
    // activities: Activity[] = []; 76. no longer needed - array. using map obj instead

    activityRegistry = new Map<string, Activity>(); // 76. instantiate new map obj, instead of using an array.
    selectedActivity: Activity | undefined = undefined;
    editMode: boolean = false; // 71. refactoring - EDITED AGAIN SEE BELOW:(had to add undefined here and for loading so the error went away)
    loading: boolean = false; // EDIT - this was false | undefined but changed to boolean - so it can be changed to true.
    loadingInitial = false; // 76. to get rid of flickering(but mine was ok before this change)
    pagination: Pagination | null = null; // 239. added.
    pagingParams = new PagingParams(); //  240. adding pagination parameters.
    predicate = new Map().set("all", true); // 244. client side filtering. add new prop. easier to manage by mkaing it a map. set inital prop for all our activities so we can highlight which is selected by default. 

    constructor() {
        makeAutoObservable(this) //70. this was makeObservable, changed to auto in this lesson (this is a separate thing to import) which allowed to take out properties that are now inherently observable

        reaction( // 244. good time to use reaction - when the predicate changed BUT not set the first time - we want something to happen - 
            () => this.predicate.keys(), // we want to observe the keys - ar they going to change?
            () => {
                this.pagingParams = new PagingParams(); // 
                this.activityRegistry.clear();
                this.loadActivities(); // taking axios params. and load next batch. 
            }
        )
    }
    
    setPagingParams = (pagingParams: PagingParams) => { // 240. adding pagination parameters. we want to be able to send these along with our request as a query string. 
        this.pagingParams = pagingParams;
    }

    setPredicate = (predicate: string, value: string | Date) => { // 244. method to set the predicate.
        const resetPredicate = () => {
            this.predicate.forEach((value, key) => {
                if (key !== "startDate") this.predicate.delete(key); // if key is not start date (ie if the user selects another date) then we reset the filter by deleting the key in the predicate.
            })
        }
        switch (predicate) {
            case "all": // 244. we want user to select filters one at a time. we also want to retain the date while able to filter. 
                resetPredicate();
                this.predicate.set("all", true); // 
                break;
            case "isGoing" :
                resetPredicate();
                this.predicate.set("isGoing", true);
                break;
            case "isHost" :
                resetPredicate();
                this.predicate.set("isHost", true);
                break;
            case "startDate" :
                this.predicate.delete("startDate"); // 244. deleting bc of the way we will react to changes in the predicate. if we just set the value, then will not trigger the change detection to update what we are going to when the pred changes.  
                this.predicate.set("startDate", value);

        }
    }

    get axiosParams() { // 240. adding pagination parameters. 
        const params = new URLSearchParams();
        params.append("pageNumber", this.pagingParams.pageNumber.toString()); // we can add query string parameters in this obj and pass this obj to axios.
        params.append("pageSize", this.pagingParams.pageSize.toString()); // 
        this.predicate.forEach((value, key) => {
            if (key === "startDate") { //  if key is startdate
                params.append(key, (value as Date).toISOString()); // then append it to params as a string.
            } else {
                params.append(key, value); // if not startdate, going to be a normal filter. so append normally. 
            }
        }) // 244. check what's inside out predicate and loop over the keys inside there. 
        return params;
    }

    get activitiesByDate() { //76. using map obj. uses map obj method.. now we have a computed property that will sort the activities in date order
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
        a.date!.getTime() - b.date!.getTime());
    }

    //123. date strategy - activitiesByDate - changed a.date - b.date from parse to getTime method we have available on Date objects.

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, "dd MMM yyyy");
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key: string]: Activity[]})
        )
    }

    //123. date strategy - we want groupedActivities to stay a string. toISOstring() and split by T
    //124. date-fns : replaced above change with the date-fns formatting anyway. 

    loadActivities = async () => { // 71. refactoring
        this.setLoadingInitial(true); // 84. have to set this back to true since after we load a single activity, it is set to false. so we don't get the loading indictor when returning to the full activities page
        // this.setLoadingInitial(true); // SOLVING after 71. was missing this line. silly. 76. to solve flickering 
         try {
            const result = await agent.Activities.list(this.axiosParams); // 240. pass in this.axiosParams. 239. this list now expects to return a type of paginatedResult of type activity[].
                runInAction(() => { 
                    result.data.forEach(activity => { // 239. forEach has to be on activity array directly. so need to specify data within the paginatedResult here.
                        this.setActivity(activity); // 83. using private function now
                    });
                    this.setPagination(result.pagination); // 239. we have pagination data inside data now. so can pass into setPagination. 
                    this.setLoadingInitial(false); // 239. turn off loading indicator. 
                });
                this.setLoadingInitial(false);

        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    setPagination = (pagination: Pagination) => { // 239. helper method.
        this.pagination = pagination;
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
        const user = store.userStore.user; // 172.
        if (user) {
            activity.isGoing = activity.attendees!.some( // 172.
                a => a.username === user.username
            )
            activity.isHost = activity.hostUsername === user.username; // 172. 
            activity.host = activity.attendees!.find(x => x.username === activity.hostUsername); // 172.
        }
        activity.date = new Date(activity.date!) //123. date strategy - date format changed now so - no longer a string. // 62. [0] takes the first part of what is being split. indexing split by T.
        this.activityRegistry.set(activity.id, activity); //76. instead of pushing to array, we add to map object, setting act id as key, and activity as value.
    }

    private getActivity = (id: string) => { // 83. will either return activity or undefined.
        return this.activityRegistry.get(id);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user; // 174.
        const attendee = new Profile(user!); // 174. 
        activity.id = uuid(); // 174. this line of code isn't in neils vid. not sure why. 
        try {
            await agent.Activities.create(activity)
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(() => {
                this.selectedActivity = newActivity;
            })
        } catch (error) {
            console.log(error);
        }
    }

    // 174. updating create and edit - removed loading indicators, including one in runInAction. removed editmode. will use Formik isSubmitting instead of loading flag.

    updateActivity = async (activity: ActivityFormValues) => { // 74. create activity using mobx
        try {   
            await agent.Activities.update(activity);
            runInAction(() => {
                if (activity.id) {
                    const updatedActivity = {...this.getActivity(activity.id), ...activity}
                    this.activityRegistry.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }
            })
        } catch (error) {
            console.log(error); 
        }
    }
    // 174. removed loading indicators, removed what we did in vid 76. 

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

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id); // 173. override default activity. we know user is inside activity. if they are updating their attendance.
            runInAction(() => {
                if (this.selectedActivity?.isGoing) { // 173. if they've cancelled, remove user from list.
                    this.selectedActivity.attendees = 
                        this.selectedActivity.attendees?.filter(a => a.username != user?.username); // filters out current user out of attendees list.
                    this.selectedActivity.isGoing = false;
                } else { // 173. if they're joing, add user to list.
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!) // take opportunity to set activity object at the same time.
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    cancelActivityToggle = async () => { // 175. adding cancel activity method.
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity!.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    clearSelectedActivity = () => { // 219. adding this so when we switch between activities, we remove the previous to stop getting disconnection error. (minor - still works. same as react strict mode odd flow useEffect error with signalR)
        this.selectedActivity = undefined;
    }

    updateAttendeeFollowing = (username: string) => { // 230. helper method to update the attendees inside each activity that we have inside registry. since these are all displayed. 
        this.activityRegistry.forEach(activity => {
            activity.attendees.forEach(attendee => {
                if (attendee.username == username) {
                    attendee.following ? attendee.followersCount -- : attendee.followersCount++;
                    attendee.following = !attendee.following;
                }
            })
        })
    }
}