import { Profile } from "./profile";

export interface IActivity {
    id: string;
    title: string;
    date: Date |  null;
    description: string;
    category: string;
    city: string;
    venue: string;
    hostUsername: string;
    isCancelled: boolean;
    isGoing: boolean; // 172.
    isHost: boolean; // 172. 
    host?: Profile; // 172.
    attendees: Profile[];
  }

  export class Activity implements IActivity { // 174. new class that will populate the activities. scaffold? 
    constructor(init: ActivityFormValues) { // 174. linting update - need to do this long form way (Object.assign won't work).
      this.id = init.id!
      this.title = init.title
      this.date = init.date
      this.description = init.description
      this.category = init.category
      this.venue = init.venue
      this.city = init.city

    }

    id: string;
    title: string;
    date: Date |  null;
    description: string;
    category: string;
    city: string;
    venue: string;
    hostUsername: string = "";
    isCancelled: boolean = false;
    isGoing: boolean = false; 
    isHost: boolean = false;
    host?: Profile; 
    attendees: Profile[] = []; // 174. had to set iniital values and match IActivity interface above to abide by linting rules. 
  }

  export class ActivityFormValues { // 174.
    id?: string = undefined;
    title: string = "";
    category: string = "";
    description: string = "";
    date: Date | null = null;
    city: string = "";
    venue: string = "";

    constructor(activity?: ActivityFormValues) { // 174.
      if (activity) {
        this.id = activity.id;
        this.title = activity.title;
        this.category = activity.category;
        this.description = activity.description;
        this.date = activity.date;
        this.city = activity.city;
        this.venue = activity.venue;
      }
    }
  }

  // 123. date strategy - changed type date to Date from string (after changing with react datepicker)
  // 123. also allowing for null type. addition
  // 170. adding the attendees component - added hostUsername, isCancelled, attendees. this is temporarily set to be optional so we don't run into problems. will come back to it. 
  // 174. removing optional ? from most properties. except for host.
  // 174. 