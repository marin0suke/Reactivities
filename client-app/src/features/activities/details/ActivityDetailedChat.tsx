import { observer } from 'mobx-react-lite'
import { useEffect } from 'react';
import {Segment, Header, Comment, Loader} from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, FieldProps} from 'formik';
import * as Yup from 'yup'; // 218. adding validation.
import { formatDistanceToNow } from 'date-fns';

interface Props { // 216. connecting to the hub. before this section, whole file was boilerplate. added interface first with activityid type.
    activityId: string;
}

export default observer(function ActivityDetailedChat({activityId}: Props) {
    const {commentStore} = useStore(); // need to access commentStore.

    useEffect(() => {
        if (activityId) { // param will form the group id so need this id.
            commentStore.createHubConnection(activityId); // create conect with id.
        }
        return () => {
            commentStore.clearComments(); // clear comments and stop connect.
        }
    }, [commentStore, activityId]) // need to add dependencies to useEffect.
    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{border: 'none'}}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing> 
            <Formik
                        onSubmit={(values, {resetForm}) => 
                            commentStore.addComment(values).then(() => resetForm())}
                        initialValues={{body: ""}}
                        validationSchema={Yup.object({
                            body: Yup.string().required() //  218.making text required in comment body.
                        })}
                    >
                        {({isSubmitting, isValid, handleSubmit}) => ( // 218. redo form (not using MyTextArea). 
                            <Form className="ui form">
                                <Field name="body">
                                    {(props: FieldProps) => (
                                        <div style={{position: "relative"}}>
                                            <Loader active={isSubmitting} />
                                            <textarea 
                                                placeholder='Enter your comment (Enter to submit, SHIFT + enter for new line)'
                                                rows={2}
                                                {...props.field}
                                                onKeyDown={e => {
                                                    if (e.key === "Enter" && e.shiftKey) { // checks for enter and shift for new line.
                                                        return; // new line in text area.
                                                    }
                                                    if (e.key === "Enter" && !e.shiftKey) {
                                                        e.preventDefault(); // prevents default of new line when pressing enter.
                                                        isValid && handleSubmit(); // validates and submits.
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </Field>
                            </Form>
                        )}
                    </Formik>
                <Comment.Group>
                    {commentStore.comments.map(comment => (
                        <Comment key={comment.id}> 
                            <Comment.Avatar src={comment.image || '/assets/user.png'} />
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>
                                    {comment.displayName}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistanceToNow(comment.createdAt)}</div>
                                </Comment.Metadata>
                                <Comment.Text style={{whiteSpace: "pre-wrap"}}>{comment.body}</Comment.Text>                 
                          </Comment.Content>
                        </Comment>
                    ))}
                </Comment.Group>
            </Segment>
        </>

    )
})

// 216. connecting to the hub.
// 217. adding Formik form to add our sending comments functionality in client. needed to adjust in segment - aded clearing attribute so that the float works inside the browser.
// 218. added whitespace prewrap to comment.text so new line breaks are shown when comments are sent up. 
// 219. resolving UTC dates. added formatDistanceToNow from date fns in createdAt portion. also after adding this, app fails bc what we are getting from the API as a date is a string. 
// (cont) (invalid time value). we need to pass in a date OBJ not a string.