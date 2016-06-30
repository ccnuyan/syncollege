import React, {PropTypes} from 'react';
import style from './DiskPage.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import diskActions from '../../redux/actions/diskActions';
import {connect} from 'react-redux';
import DirectoryList from './DirectoryList';
import FileList from './FileList';
import Options from './Options';

class DiskPage extends React.Component {
    constructor() {
        super();
        this.onSwitchEditStatus = this.onSwitchEditStatus.bind(this);
    }

    componentWillMount() {
        diskActions.dispatchGetRootAsync()(this.props.dispatch, function() {
            return this.props.disk;
        }.bind(this));
    }

    componentWillUpdate(nextProps, nextState) {
        this.context.loginStateCheck.bind(this)(nextProps);
    }

    onSwitchEditStatus() {
        this.props.dispatch(diskActions.switchEditStatus());
    }

    render() {
        var css = this.props.css;
        var newDirectoryShown = this.props.disk.get('newDirectoryShown');
        var isMoving = !!this.props.disk.getIn(['fileToBeMoved', '_id']);
        var currentDirectory = this.props.disk.get('currentDirectory').toObject();
        var editStatus = this.props.disk.get('editStatus');
        return (
            <div className={cn('container-mid', css.module)}>
                <h1 className={cn('heading-primary')} style={{
                    borderBottom: '1px solid #555'
                }}>
                <div onClick={this.onSwitchEditStatus} className={cn('empty-button')}>
                    {editStatus
                        ? <i className="icon-toggle-on"/>
                        : <i className="icon-toggle-off"/>}
                </div>
                </h1>
                <div className={cn(css.diskContainer, 'grid-parent')}>
                    <div className={cn(css.diskContentContainer, 'grid-child')}>
                        <DirectoryList></DirectoryList>
                    </div>
                    <div className={cn(css.diskContentContainer, 'grid-child')}>
                        <FileList></FileList>
                    </div>
                </div>
                {isMoving
                    ? <div className={css.movingOverlay}></div>
                    : ''}
            </div>
        );
    }
}

var selector = function(state) {
    return {user: state.user, disk: state.disk};
};

DiskPage.contextTypes = {
    router: React.PropTypes.object.isRequired,
    loginStateCheck: React.PropTypes.func.isRequired
};

export default connect(selector)(styleable(style)(DiskPage));
