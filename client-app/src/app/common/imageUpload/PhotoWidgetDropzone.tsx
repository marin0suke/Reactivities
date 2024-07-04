import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { Header, Icon } from 'semantic-ui-react';

interface Props { // 201.
    setFiles: (files: any) => void;
}

export default function PhotoWidgetDropzone({setFiles}: Props) {
    const dzStyles = { // 201.
        border: 'dashed 3px #eee',
        borderColor: '#eee',
        borderRadius: '5px',
        paddingTop: '30px',
        textAlign: 'center', 
        height: 200
    }

    const dzActive = { // 201.
        borderColor: 'green'
    }

    const onDrop = useCallback(acceptedFiles => {
        setFiles(acceptedFiles.map((file: any) => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })))
    }, [setFiles]) // 201. 
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div {...getRootProps()} style={isDragActive ? {...dzStyles, ...dzActive} : dzStyles}>
            <input {...getInputProps()} />
            <Icon name='upload' size='huge' />
            <Header content='Drop image here' />
        </div>
    )
}

// 200. installed react dropzone and copypasted this hook from the website. 
// 201. added style attribute to getRootProps. textAlign center as string had an error, not yet fixed. 
// 