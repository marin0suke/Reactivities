import { observer } from "mobx-react-lite";
import { Button, Card, Grid, Header, Image, TabPane } from "semantic-ui-react";
import { Photo, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import { SyntheticEvent, useState } from "react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";

interface Props { // 197. adding prof obj as prop. 
    profile: Profile;
}

export default observer(function ProfilePhotos({profile}: Props) {
    const {profileStore: { isCurrentUser, uploadPhoto, uploading, // 198. // 203 adding uploadPhoto from store. also the uploading flag so we can add it to our uploading widget.
            loading, setMainPhoto, deletePhoto}} = useStore(); // 204. added loading and setMainPhoto function. // 205 deletePhoto. 
    const [addPhotoMode, setAddPhotoMode] = useState(false); // 198.
    const [target, setTarget] = useState(''); // 204. setting main photo and deleting photos. adding localstate. string bc we want to target the name of the button.

    function handlePhotoUpload(file: Blob) { // 203. add photo upload functionality to this comp. 
        uploadPhoto(file).then(() => setAddPhotoMode(false));

    }

    function handleSetMainPhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) { // 204. function to target the button name for loading indicator. (?)
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }

    function handleDeletePhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) { // 205. delete photo.
        setTarget(e.currentTarget.name);
        deletePhoto(photo);
    }

    return (
        <TabPane>
            <Grid> 
                <Grid.Column width={16}>
                <Header floated="left" icon="image" content="Photos" />
                {isCurrentUser && (
                    <Button floated="right" basic content={addPhotoMode ? "Cancel" : "Add Photo"} 
                    onClick={() => setAddPhotoMode(!addPhotoMode)}
                    />
                )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading} />
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {profile.photos?.map(photo => (
                                <Card key={photo.id}>
                                    <Image src={photo.url} />
                                    {isCurrentUser && (
                                        <Button.Group fluid widths={2}>
                                            <Button 
                                                basic
                                                color="green"
                                                content='Main'
                                                name={'main' + photo.id}
                                                disabled={photo.isMain}
                                                loading={target === 'main' + photo.id && loading}
                                                onClick={e => handleSetMainPhoto(photo, e)}
                                            />
                                            <Button 
                                                basic
                                                color="red"
                                                icon='trash'
                                                onClick={e => handleDeletePhoto(photo, e)}
                                                loading={target === photo.id && loading}
                                                disabled={photo.isMain}
                                                name={photo.id}
                                            />
                                        </Button.Group>
                                    )}
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
            
            
        </TabPane>
    )
})

// 197. displaying photos.
// 198. adding grid for formatting, then making button conditional on whether current user. currentuser info brought in from profileStore.
// 199. added PhotoUploadWidget.
// 203 added both handlePhotoUpload and uploading flag props down to PhotoUploadWidget. 
// 205. delete photo. already had the method to delete in agent from prev lesson. so just had to add methods in the profileStore.
// which was same with few changes to setMainPhoto, explanation of this in Notion. 
// then added the store in useStore, added another handler for the onClick event. the loading indicator needed some tweaking so as to differentiate from the other button so they weren't both set off 
// (did this by adding string to the name and made the buttons different)