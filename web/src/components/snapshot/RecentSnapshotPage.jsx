import React, {PropTypes} from 'react';
import style from './SnapshotPage.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import {connect} from 'react-redux';
import presentationActions from '../../redux/actions/presentationActions';
import Snapshot from './Snapshot';

class RecentPresentationPage extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {
        presentationActions.dispatchGetSnapshotListAsync()(this.props.dispatch, function() {
            return this.props.presentation;
        }.bind(this));
    }

    render() {
        var css = this.props.css;
        var snapshots = this.props.presentation.get('recentSnapshots').toObject();
        return (
            <div>
                {Object.keys(snapshots).map(function(key) {
                    return (
                        <Snapshot key={key} snapshot={snapshots[key].toObject()}></Snapshot>
                    );
                }.bind(this))}
            </div>
        );
    }
}

var selector = function(state) {
    return {user: state.user, presentation: state.presentation};
};

RecentPresentationPage.contextTypes = {
    router: React.PropTypes.object.isRequired,
    loginStateCheck: React.PropTypes.func.isRequired
};

export default connect(selector)(styleable(style)(RecentPresentationPage));
