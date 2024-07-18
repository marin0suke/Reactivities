import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../models/comment";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = []; 
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this); // now both comments and hub connections are marked as observables.
    }

    createHubConnection = (activityId: string) => { // to avoid timing issues when trying to create our hub and users loading the activity, load id as string.
        if (store.activityStore.selectedActivity) { // check first we have a selected activity in our store before attempting to make a connection.
            this.hubConnection = new HubConnectionBuilder() 
                .withUrl("http://localhost:5000/chat?activityId=" + activityId, { // this is our chat endpoint. - changed to 5000 from 3000 to match launchsettings and got rid of 404 error :)
                    accessTokenFactory: () => store.userStore.user?.token as string // as string added instead of bang operator to meet linting requirements.
                }) 
                .withAutomaticReconnect() // will attempt to reconnect client if they lose connection.
                .configureLogging(LogLevel.Information) // so we can see whats going on as we connect.
                .build(); // creates the connection.
            
            this.hubConnection.start().catch(error => console.log("Error establishing the connection", error)); // starts our connection. 
            // after we create connect to hub, we want to load all comments for that act. that theyre connected to.
            this.hubConnection.on("LoadComments", (comments: ChatComment[]) => { // string name must match exactly what we called this in signalR.
                runInAction(() => {
                    comments.forEach(comment => {
                        comment.createdAt = new Date(comment.createdAt + "Z"); // when loading, creating a new Date obj for each comment.
                    }) // 219. Z manually appended so already existing comments are loaded with the correct time.
                    this.comments = comments // sets all comments to be comments array.
                });  // runInAction is updating the observable inside our store.
            }); 
            // another method to receive a comment.
            this.hubConnection.on("ReceiveComment", (comment: ChatComment) => { // no need for array bc we only want to load singular comment.
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt); // when a comment is received, new Date obj created.
                    this.comments.unshift(comment) // comment gets pushed to comments array. 219. changed to unshift - new comments placed at the start of the array,
                }); // 219. comments added and not retrieved from the db are created with the correct Z suffix.
            })
        }
    }
    // we need another method to stop the hub connection.
    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log("Error stopping connection: ", error));
    }
    // we also want to be able to clear the comments when a user does disconnect from the activity that theyre looking at. another helper method:
    clearComments = () => {
        this.comments = [];
        this.stopHubConnection(); // only have to spec clearComments in activitydetails instead of both if we move away from an activity.
    } 

    addComment = async (values: {body: string, activityId?: string}) => { // 217. sending comments.
        values.activityId = store.activityStore.selectedActivity?.id;
        try {
            await this.hubConnection?.invoke("SendComment", values); // this string needs to match the name of the method that we want to invoke exactly. SendComment in ChatHub.cs.
        } catch (error) {
            console.log(error);
        }
    }

}

// 215. adding signalr to client.