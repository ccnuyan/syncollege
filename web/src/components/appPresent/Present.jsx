import React, {PropTypes} from 'react';
import cn from 'classnames';
import Presenter from '../presenter/Presenter.jsx';
import StoreProvider from '../StoreProvider';

class Present extends React.Component {

    render() {
        return (
            <StoreProvider>
                <Presenter></Presenter>
            </StoreProvider>
        );
    }
}

export default Present;
