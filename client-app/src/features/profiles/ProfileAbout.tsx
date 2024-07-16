import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Button, Grid, Header, TabPane } from "semantic-ui-react";
import ProfileEditForm from "./ProfileEditForm";
import { useStore } from "../../app/stores/store";

export default observer(function ProfileAbout() {
    const {profileStore} = useStore();
    const {isCurrentUser, profile} = profileStore;
    const [editMode, setEditMode] = useState(false);

    return (
        <TabPane>
            <Grid>
                <Grid.Column width="16">
                    <Header floated="left" icon="user" content={`About ${profile?.displayName}`} />
                    {isCurrentUser && (
                        <Button
                            floated="right"
                            basic
                            content={editMode ? "Cancel" : "Edit Profile"}
                            onClick={() => setEditMode(!editMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width="16">
                    {editMode ? <ProfileEditForm setEditMode={setEditMode} /> :
                    <span style={{
                        whiteSpace: 'pre-wrap', 
                        overflowWrap: 'break-word' 
                    }}>{profile?.bio}</span>}
                </Grid.Column>
            </Grid>
        </TabPane>
    )
})


// section 18 challenge. profile about component. this component will make use of the profileedit form we previously created.