import { Tab, TabPane } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import { Profile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import ProfileAbout from "./ProfileAbout";
import ProfileFollowings from "./ProfileFollowings";
import { useStore } from "../../app/stores/store";

interface Props {
    profile: Profile;
}

export default observer(function ProfileContent({profile}: Props) {
    const {profileStore} = useStore(); // 232. add profileStore so we can access in out Tab - adding this for onTabChange.

    const panes = [
        {menuItem: 'About', render: () => <ProfileAbout />}, // section 18 challenge - added ProfileAbout here.
        {menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} />}, // 197. replaced TabPane with comp with TabPane already in it.
        {menuItem: 'Events', render: () => <TabPane>Events Content</TabPane>},
        {menuItem: 'Followers', render: () => <ProfileFollowings />}, // 232. getting a list of followings - added profile followings component.
        {menuItem: 'Following', render: () => <ProfileFollowings />}, // 232. added profile followings component.
    ];

    return (
        <Tab 
            menu={{fluid: true, vertical: true}}
            menuPosition='right'
            panes={panes}
            onTabChange={(_, data) => profileStore.setActiveTab(data.activeIndex as number)} // 233. using mobx reactions. add functionality to set active tab. data param will give us active index of the tab that was clicked.
        />
    )
})

// 194. setting up Profile content.
// section 18 challenge - update profilecontent component. note since we are getting the profile directly from the store, we do not need to pass down the profile here.
