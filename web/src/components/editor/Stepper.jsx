import React, {PropTypes} from 'react';
import style from './Toolbar.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import presentationActions from '../../redux/actions/presentationActions';
import {connect} from 'react-redux';
import keymap from 'browser-keymap';

class Stepper extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.toPercent = this.toPercent.bind(this);
        this.onAdjust = this.onAdjust.bind(this);
        this.update = this.update.bind(this);
    }

    toPercent(value, inc = 0) {
        var floatValue = parseFloat(value);

        var min = 0;
        var max = 0;
        switch (this.props.stepperType) {
            case 'text-scale':
                min = 0;
                max = 500;
                break;
            case 'opacity':
                min = 0;
                max = 100;
                break;
            default:
        }

        floatValue = Math.floor(floatValue + inc);
        floatValue = Math.min(max, floatValue);
        floatValue = Math.max(min, floatValue);

        return floatValue;
    }

    update(props) {
        var initialValue = parseFloat(this.props.initialValue);
        switch (this.props.stepperType) {
            case 'text-scale':
                initialValue = this.toPercent(initialValue);
                this.refs['stepper-value'].value = this.toPercent(initialValue) + '%';
                break;
            case 'opacity':
                initialValue = this.toPercent(initialValue * 100);
                var transform = `scaleX(${initialValue / 100})`;
                this.refs['stepper-progress'].style.transform = transform;
                this.refs['stepper-value'].value = this.toPercent(initialValue) + '%';
                break;
            default:
        }
    }

    componentDidMount() {
        this.update();
    }

    componentDidUpdate(prevProps, prevState) {
        this.update();
    }

    onChange() {
        var value = this.refs['stepper-value'].value;

        switch (this.props.stepperType) {
            case 'text-scale':
                //http://deerchao.net/tutorials/regex/regex.htm#howtouse
                if (value.match(/^((500)|([1-4]\d{0,2})|([1-9]\d{0,1})|([1-9]))%$/)) {
                    this.props.changeCallback(value);
                }
                break;
            case 'opacity':
                //http://deerchao.net/tutorials/regex/regex.htm#howtouse
                if (value.match(/^((100)|([1-9]\d{0,1})|([1-9]))%$/)) {
                    this.props.changeCallback(value);
                    var transform = `scaleX(${parseFloat(value) / 100})`;
                    this.refs['stepper-progress'].style.transform = transform;
                }
                break;
        }
    }

    //http://www.javascripter.net/faq/keycodes.htm
    onAdjust(event) {
        //TODO using keymap instead;
        if (event.keyCode === 38 || event.keyCode === 40) {
            event.preventDefault();

            var value = parseFloat(this.refs['stepper-value'].value);
            var result = this.toPercent(value, 39 - event.keyCode);

            this.refs['stepper-value'].value = result + '%';
            this.onChange();
        }
    }

    render() {
        var css = this.props.css;

        return <div className={cn(css['toolbar-option'], css['toolbar-stepper'])}>
            <h4 className={cn(css['toolbar-option-label'])}>
                {this.props.label}
            </h4>
            <div className={cn(css['stepper'])}>
                {this.props.stepperType === 'opacity'
                    ? <div ref="stepper-progress" className={cn(css['stepper-progress'])}></div>
                    : ''}
                <input onKeyDown={this.onAdjust} ref="stepper-value" type="text" onChange={this.onChange} className={cn(css['stepper-number'])}/>
            </div>
        </div>;
    }
}

Stepper.propTypes = {
    stepperType: React.PropTypes.string.isRequired,
    changeCallback: React.PropTypes.func.isRequired
};

var selector = function(state) {
    return {presentation: state.presentation};
};

export default connect(selector)(styleable(style)(Stepper));
