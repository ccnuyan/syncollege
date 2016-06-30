import React, {PropTypes} from 'react';
import cn from 'classnames';
import styleable from 'react-styleable';
import style from './Snapshot.scss';
import presentationActions from '../../redux/actions/presentationActions';
import {connect} from 'react-redux';
import _ from 'lodash';

class Snapshot extends React.Component {
    constructor() {
        super();
        this.onRemove = this.onRemove.bind(this);
        this.onShowQrcode = this.onShowQrcode.bind(this);
        this.getPresentUrl = this.getPresentUrl.bind(this);
        this.onPlay = this.onPlay.bind(this);
    };

    getPresentUrl() {
        return `play?id=${this.props.snapshot._id}`;
    }

    onRemove() {
        presentationActions.dispatchRemoveSnapshotAsync({id: this.props.snapshot._id})(this.props.dispatch, function() {
            return this.props.presentationState;
        }.bind(this));
    }

    onPlay() {
        var url = this.getPresentUrl();
        _Y_.navigateTo(`${__HOST}${url}`, true);
    }

    onShowQrcode() {
        this.context.onShowQrcode.call(null, `${__HOST}${this.getPresentUrl()}`);
    }

    render() {
        var css = this.props.css;
        return (
            <div className={cn('grid-child', css.presentationEach)}>
                <div className={css.presentation}>
                    <div className={cn('font-large', css.presentationName)}>
                        {this.props.snapshot.name}
                    </div>
                    <div className={cn('font-smallest', css.presentationName)}>
                        {this.props.snapshot.presented}
                    </div>
                    <button onClick={this.onRemove} className={cn('icon-bin', 'button-hollow')}/>
                    <div className={cn(css.options)}>
                        <button onClick={this.onShowQrcode} className={cn('icon-qrcode', 'button-hollow')} data-target={'/present?id=' + this.props.snapshot._id}></button>
                        <button onClick={this.onPlay} className={cn('icon-play3', 'button-hollow')}></button>
                    </div>
                </div>
            </div>
        );
    }
}

var selector = function(state) {
    return {presentationState: state.presentation};
};

Snapshot.contextTypes = {
    onShowQrcode: PropTypes.func.isRequired
};

export default connect(selector)(styleable(style)(Snapshot));
