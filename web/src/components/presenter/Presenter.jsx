import React, {PropTypes} from 'react';
import style from './Presenter.scss';
import styleable from 'react-styleable';
import fetchHelper from '../../redux/actions/fetchHelper';
import cn from 'classnames';
import presentationActions from '../../redux/actions/presentationActions';
import revealConf from '../../service/revealConf.js';
import {connect} from 'react-redux';
import _ from 'lodash';

class Presenter extends React.Component {
    componentDidMount() {
        var presentationId = _Y_.searchToObject(window.location.search).id;

        presentationActions.dispatchGetPresentationAsync({id: presentationId, asOwner: false})(this.props.dispatch, function() {
            return this.props.presentation;
        }.bind(this));
        var token = window.localStorage.getItem('userToken');
    }

    componentDidUpdate(prevProps, prevState) {
        var current = this.props.presentation.get('currentPresentation');
        if (current.toObject()._id) {
            this.renderSlides(current.toObject());
        }
    }

    renderSlides(presentation) {
        var el = document.getElementById('reveal');
        _Y_.setHTML(el, presentation.content);
        var config = Reveal.getConfig();
        head.load(__ASSETS + '/' + presentation.theme + '.css');
        Reveal.initialize(_.assign(revealConf.presentationPreviewConf));
        el.style.display = '';
    }

    render() {
        var css = this.props.css;

        return <div className={css.container}>
            <div id="reveal" ref="reveal" className={cn(css.reveal, 'reveal')}></div>
        </div>;
    }
}

var selector = function(state) {
    return {presentation: state.presentation};
};

export default connect(selector)(styleable(style)(Presenter));
