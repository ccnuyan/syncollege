import React, {PropTypes} from 'react';
import style from './DiskPage.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import diskActions from '../../redux/actions/diskActions';
import {connect} from 'react-redux';
import DirectoryList from './DirectoryList';
import FileList from './FileList';
import Options from './Options';

class DiskPanel extends React.Component {
    constructor() {
        super();
    }
    componentWillMount() {
        diskActions.dispatchGetRootAsync()(this.props.dispatch, function() {
            return this.props.disk;
        }.bind(this));
    }

    render() {
        var css = this.props.css;
        var currentDirectory = this.props.disk.get('currentDirectory').toObject();
        return (
            <div className={cn('grid-parent')}>
                <div className={cn(css.diskContentContainer, 'grid-child')}>
                    <DirectoryList></DirectoryList>
                </div>
                <div className={cn(css.diskContentContainer, 'grid-child')}>
                    <FileList></FileList>
                </div>
            </div>
        );
    }
}

var selector = function(state) {
    return {user: state.user, disk: state.disk};
};
export default connect(selector)(styleable(style)(DiskPanel));
