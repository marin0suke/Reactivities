import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Card, CardContent, Icon, Image } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import FollowButton from "./FollowButton";

interface Props {
    profile: Profile;
}

export default  observer(function ProfileCard({profile}: Props) {
    function truncate(str: string | undefined) {
        if (str) {
            return str.length > 40 ? str.substring(0, 37) + "..." : str;
        }
    }

    return (
        <Card as={Link} to={`/profiles/${profile.username}`}>
            <Image src={profile.image || "/assets/user.png"} />
            <CardContent>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>{truncate(profile.bio)}</Card.Description>
            </CardContent>
            <Card.Content extra>
                <Icon name="user" />
                {profile.followersCount} followers
            </Card.Content>
            <FollowButton profile={profile} />
        </Card>
    )
})


// 176. adding a popover for attendees. 
// section 18 challenge - added profile.bio in bio card.description
// also added truncate function and added it to card description.

// 229. added dynamic prop for followers count.

// 231. we're adding the follow button on the card too, but the card is also a link. we don't want to trigger the link as well as follow at the same time.
// so we will use prevent default to stop this from happnening. preventdefault is built into the button comp. then button is added her just under the card. 