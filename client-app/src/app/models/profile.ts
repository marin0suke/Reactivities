import { User } from "./user";

export interface IProfile {
    username: string;
    displayName : string;
    image?: string;
    bio?: string;
}

// 173. update - unsafe declaration merging between classes and interfaces. we had to differentiate the names. 

export class Profile implements IProfile {
    constructor(user: User) {
        this.username = user.username;
        this.displayName = user.displayName;
        this.image = user.image;
    }

    username: string;
    displayName : string;
    image?: string;
    bio?: string;
}

// 170. adding the attendees component (client side attendance) adding interface for user profile. 
// 173. creating class so in ctor - we can auto set the props based on currently logged in user. 