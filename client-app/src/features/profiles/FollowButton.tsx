import { observer } from "mobx-react-lite";
import { Reveal, Button } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { SyntheticEvent } from "react";
import { useStore } from "../../app/stores/store";


interface Props {
    profile: Profile;
}

export default observer(function FollowButton({ profile }: Props) {
    const {profileStore, userStore} = useStore();
    const {updateFollowing, loading} = profileStore;

    if (userStore.user.username === profile.username) return null; // if we are on our own profile, button is not there.

    function handleFollow(e: SyntheticEvent, username: string) { // allows the button to change following status. 
        e.preventDefault();
        profile.following ? updateFollowing(username, false) : updateFollowing(username, true);
    }

    return (
        <Reveal animated="move">
            <Reveal.Content visible style={{width: '100%'}}>
                <Button 
                    fluid 
                    color="teal" 
                    content={profile.following ? "Following" : "Not following"} />
            </Reveal.Content>
            <Reveal.Content hidden style={{width: '100%'}}>
                <Button 
                    fluid 
                    basic
                    color={profile.following ? 'red' : 'green'}
                    content={profile.following ? 'Unfollow' : 'Follow'}
                    loading={loading}
                    onClick={(e) => handleFollow(e, profile.username)}
                />
            </Reveal.Content>
        </Reveal>
    )
})

// 231. making the follow button a component. cut paste reveal element from profile header, and made it its own comp. 
// adding in the dynamic props we have now for the button conditionals. 
//