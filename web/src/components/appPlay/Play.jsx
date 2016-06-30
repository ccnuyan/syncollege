import React, {PropTypes} from 'react';
import cn from 'classnames';
import Player from '../player/Player.jsx';
import StoreProvider from '../StoreProvider';

class Play extends React.Component {

    render() {
        return (
            <StoreProvider>
                <Player></Player>
            </StoreProvider>
        );
    }
}

export default Play;
