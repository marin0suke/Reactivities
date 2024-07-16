import { Tab, TabPane } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import { Profile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import ProfileAbout from "./ProfileAbout";

interface Props {
    profile: Profile;
}

export default observer(function ProfileContent({profile}: Props) {
    const panes = [
        {menuItem: 'About', render: () => <ProfileAbout />}, // section 18 challenge - added ProfileAbout here.
        {menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} />}, // 197. replaced TabPane with comp with TabPane already in it.
        {menuItem: 'Events', render: () => <TabPane>Events Content</TabPane>},
        {menuItem: 'Followers', render: () => <TabPane>Followers Content</TabPane>},
        {menuItem: 'Following', render: () => <TabPane>Following Content</TabPane>},
    ];

    return (
        <Tab 
            menu={{fluid: true, vertical: true}}
            menuPosition='right'
            panes={panes}
        />
    )
})

// 194. setting up Profile content.
// section 18 challenge - update profilecontent component. note since we are getting the profile directly from the store, we do not need to pass down the profile here.
