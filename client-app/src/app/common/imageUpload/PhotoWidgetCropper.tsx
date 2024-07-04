import { Cropper } from "react-cropper";
import 'cropperjs/dist/cropper.css'; // manually added

interface Props { // 202. 
    imagePreview: string;
    setCropper: (cropper: Cropper) => void;
}

export default function PhotoWidgetCropper({imagePreview, setCropper}: Props) {
    return (
        <Cropper
            src={imagePreview}
            style={{height: 200, width: '100%'}}
            initialAspectRatio={1}
            aspectRatio={1} // both initial and this one will force square images.
            preview='.img-preview'
            guides={false}
            viewMode={1}
            autoCropArea={1}
            background={false}
            onInitialized={cropper => setCropper(cropper)}
        />
    )
}

// 202. adding a cropper. goog react cropper and instal into client app. new file.
