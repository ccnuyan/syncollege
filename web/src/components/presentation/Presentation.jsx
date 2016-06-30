import React, {PropTypes} from 'react';
import cn from 'classnames';
import styleable from 'react-styleable';
import style from './Presentation.scss';
import presentationActions from '../../redux/actions/presentationActions';
import {connect} from 'react-redux';
import _ from 'lodash';

class Presentation extends React.Component {
    constructor() {
        super();
        this.onRemove = this.onRemove.bind(this);
        this.getPresentUrl = this.getPresentUrl.bind(this);

        this.onPlay = this.onPlay.bind(this);
        this.onEdit = this.onEdit.bind(this);
    };

    getPresentUrl() {
        var snapshot = this.props.presentationState.get('currentSnapshot').toObject();

        return `play?id=${snapshot._id}`;
    }

    onRemove() {
        presentationActions.dispatchRemovePresentationAsync({id: this.props.presentation._id})(this.props.dispatch, function() {
            return this.props.presentationState;
        }.bind(this));
    }

    onEdit(event) {
        _Y_.navigateTo(event.target.dataset.target, true);
    }

    onPlay() {
        var snapshot = this.props.presentationState.get('currentSnapshot').toObject();
        if (_.isEmpty(snapshot) || snapshot.presentation !== this.props.presentation._id) {
            presentationActions.dispatchRequestPlayAsync({id: this.props.presentation._id, allowAnonymous: true, interactive: true})(this.props.dispatch, function() {
                return this.props.presentationState;
            }.bind(this));
        } else {
            var url = this.getPresentUrl();
            _Y_.navigateTo(`${__HOST}${url}`, true);
        }
    }

    render() {
        var css = this.props.css;
        return (
            <div className={cn('grid-child', css.presentationEach)}>
                <div className={css.presentation}>
                    <div className={cn('font-large', css.presentationName)}>
                        {this.props.presentation.name}
                    </div>
                    <button onClick={this.onRemove} className={cn('icon-bin', 'button-hollow')}/>
                    <div className={cn(css.options)}>
                        <button onClick={this.onPlay} className={cn('icon-play3', 'button-hollow')}></button>
                        <button onClick={this.onEdit} className={cn('icon-pencil2', 'button-hollow')} data-target={'/edit?id=' + this.props.presentation._id}></button>
                    </div>
                </div>
            </div>
        );
    }
}

var selector = function(state) {
    return {presentationState: state.presentation};
};

Presentation.contextTypes = {
    onShowQrcode: PropTypes.func.isRequired
};

export default connect(selector)(styleable(style)(Presentation));
