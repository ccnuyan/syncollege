import React, {PropTypes} from 'react';
import style from './Toolbar.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import presentationActions from '../../redux/actions/presentationActions';
import {connect} from 'react-redux';

class CheckBox extends React.Component {

    constructor(props) {
        super(props);

        this.update = this.update.bind(this);
        this.set = this.set.bind(this);
    }

    componentDidMount() {
        this.update();
    }

    componentDidUpdate(prevProps, prevState) {
        this.update();
    }

    update() {
        if (this.props.checked) {
            _Y_.addClass(this.refs['container'], 'icon-checkmark');
            this.refs['container'].setAttribute('checked', true);
        } else {
            _Y_.removeClass(this.refs['container'], 'icon-checkmark');
            this.refs['container'].setAttribute('checked', false);
        }
    }

    set() {
        if (this.refs['container'].getAttribute('checked') === 'true') {
            this.refs['container'].setAttribute('checked', false);
            _Y_.removeClass(this.refs['container'], 'icon-checkmark');
            this.props.checkCallback(false);
        } else {
            this.refs['container'].setAttribute('checked', true);
            _Y_.addClass(this.refs['container'], 'icon-checkmark');
            this.props.checkCallback(true);
        }
    }

    render() {
        var css = this.props.css;
        return <button onClick={this.set} ref="container" className={cn(css['checkbox'])}></button>;
    }
}

CheckBox.propTypes = {
    checkCallback: React.PropTypes.func.isRequired,
};

export default styleable(style)(CheckBox);
