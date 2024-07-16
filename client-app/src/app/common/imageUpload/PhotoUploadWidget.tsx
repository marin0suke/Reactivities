import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import { useEffect, useState } from "react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface Props { // 203. uploading photo method. 
    loading: boolean;
    uploadPhoto: (file: Blob) => void;

}

export default function PhotoUploadWidget({loading, uploadPhoto}: Props) {
    const [files, setFiles] = useState<any>([]); // 201. (also added empty array inside useState, and gave useState any type, so type warning on files went away.)
    const [cropper, setCropper] = useState<Cropper>(); // 202.

    function onCrop() { // 202.
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!)); //  203. added uploadPhoto method here, and added ! operator to bypass type error for blob. (since blob could be null).
        }
    }

    useEffect(() => { // 202. this guarantees that we clean up after ourselves.
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview))
        }
    }, [files])


    return (
        <Grid>
            <Grid.Column width={4}>
                <Header sub color="teal" content='Step 1 - Add Photo' />
                <PhotoWidgetDropzone setFiles={setFiles} />
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color="teal" content='Step 2 - Resize Image' />
                {files && files.length > 0 && (
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
                )}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color="teal" content='Step 3 - Preview and Upload' />
                {files && files.length > 0 &&
                    <>
                        <div className="img-preview" style={{minHeight: 200, overflow: 'hidden'}} />
                        <Button.Group widths={2}>
                            <Button loading={loading} onClick={onCrop} positive icon='check' />
                            <Button disabled={loading} onClick={() => setFiles([])} icon='close' /> 
                        </Button.Group>
                    </>}
            </Grid.Column>
        </Grid>
    )
}

// 199. photo upload widget layout first. 
// semantic doesn't inherently give way to offset between columns so we add independent empty columns as padding.
// 200. added PhotoWidgetDropzone comp under step 1. 
// 201. styling dropzone.
// 202. replaced preview images in step two with the cropper. also added in step three - div with img preview and some styling.
// also created new fragment, put the div inside, added button.group and 2x buttons.  also added conditional for these buttons although i wasn't getting the same issue. 
// 203. added loading indicators and disabling buttons. 