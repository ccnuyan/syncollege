import React, {PropTypes} from 'react';
import style from './PresentationPage.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import {connect} from 'react-redux';
import presentationActions from '../../redux/actions/presentationActions';
import Presentation from './Presentation';
import NewPresentation from './NewPresentation';

class PresentationPage extends React.Component {
    constructor() {
        super();
        this.onShowCreateForm = this.onShowCreateForm.bind(this);
        this.onCancelSubmit = this.onCancelSubmit.bind(this);
        this.onCreateSubmit = this.onCreateSubmit.bind(this);
    }

    componentWillUpdate(nextProps, nextState) {
        this.context.loginStateCheck.bind(this)(nextProps);
    }

    onShowCreateForm(event) {
        this.props.dispatch(presentationActions.onShowCreateNewForm());
    }

    onCancelSubmit(event) {
        this.props.dispatch(presentationActions.onHideCreateNewForm());
    }

    onCreateSubmit(event) {
        var name = this.refs['presentationName'].value;
        if (!name) {
            name = '我的作品';
        }
        presentationActions.dispatchCreateNewPresentationAsync({name: name})(this.props.dispatch, function() {
            return this.props.presentation;
        }.bind(this));
    }

    componentDidMount() {
        presentationActions.dispatchGetPresentationListAsync()(this.props.dispatch, function() {
            return this.props.presentation;
        }.bind(this));
    }

    render() {
        var css = this.props.css;
        var presentations = this.props.presentation.get('presentations').toObject();
        var createFlag = this.props.presentation.get('createFlag');
        return (
            <div>
                {Object.keys(presentations).map(function(key) {
                    return (
                        <Presentation key={key} presentation={presentations[key].toObject()}></Presentation>
                    );
                }.bind(this))}
                <NewPresentation></NewPresentation>
            </div>
        );
    }
}

var selector = function(state) {
    return {user: state.user, presentation: state.presentation};
};

PresentationPage.contextTypes = {
    router: React.PropTypes.object.isRequired,
    loginStateCheck: React.PropTypes.func.isRequired
};

export default connect(selector)(styleable(style)(PresentationPage));
