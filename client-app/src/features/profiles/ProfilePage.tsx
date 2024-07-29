import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default observer(function ProfilePage() {
    const {username} = useParams<{username: string}>(); // 196. <> after useParams is to specify the type.
    const {profileStore} = useStore(); // 196. 
    const {loadingProfile, loadProfile, profile, setActiveTab} = profileStore; // 196 destructure props. // 233. add setActiveTab method.

    useEffect(() => { // 196. 
        if (username) loadProfile(username); 
        return () => {
            setActiveTab(0); // 233. add callback function. use clean up function to reset active tab in profileStore. 
        }
    }, [loadProfile, username, setActiveTab])

    if (loadingProfile) return <LoadingComponent content="Loading profile..." /> // 196.

    return (
        <Grid>
            <Grid.Column width={16}>
                {profile &&
                    <>
                        <ProfileHeader profile={profile} />
                        <ProfileContent profile={profile} />
                    </>}
                
            </Grid.Column>
        </Grid>
    )
})

// 192. creating profile page. just created file and added h1. 
// 193. added Profile header that we created.
// 194. added profile content that we created.
// 196. made function an observer MobX. also added profile prop into ProfileHeader. also made Profile Header a conditional based on whether we have a profile. to get rid of linting error. 
