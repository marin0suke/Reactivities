import { Dimmer, Loader } from 'semantic-ui-react';

interface Props { // 63. adding loading indicators (this new tsx file)
    inverted?: boolean;
    content?: string;
}

export default function LoadingComponent({inverted = true, content = 'Loading...'}: Props) {
    return (
        <Dimmer active={true} inverted={inverted}>
            <Loader content={content} />
        </Dimmer>
    )
}