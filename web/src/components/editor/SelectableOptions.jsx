import React, {PropTypes} from 'react';
import style from './Toolbar.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import presentationActions from '../../redux/actions/presentationActions';
import {connect} from 'react-redux';
import CheckBox from './CheckBox';

class SelectableOptions extends React.Component {

    constructor(props) {
        super(props);

        this.setSelectable = this.setSelectable.bind(this);
    }

    setSelectable(value) {
        if (value) {
            Velocity(this.refs.content, 'slideDown', {duration: 200});
        } else {
            Velocity(this.refs.content, 'slideUp', {duration: 200});
        }

        RevealEditor.setSelectable(value
            ? 'single'
            : 'false');
    }

    setMode(value) {
        RevealEditor.setSelectable(value
            ? 'multiple'
            : 'single');
    }

    componentDidMount() {
        var block = this.props.presentation.getIn(['currentPresentation', 'currentBlock']).toObject();
        Velocity(this.refs.content, block.text.selectable
            ? 'slideDown'
            : 'slideUp', {duration: 0});
    }

    componentDidUpdate(prevProps, prevState) {
        var block = this.props.presentation.getIn(['currentPresentation', 'currentBlock']).toObject();

        Velocity(this.refs.content, block.text.selectable
            ? 'slideDown'
            : 'slideUp', {duration: 0});
    }

    render() {
        var css = this.props.css;
        var block = this.props.presentation.getIn(['currentPresentation', 'currentBlock']).toObject();

        return <div className={cn(css['toolbar-option'], css['toolbar-color'])}>
            <h4 className={cn(css['toolbar-option-label'])}>
                {this.props.label}
            </h4>
            <CheckBox checkCallback={this.setSelectable} checked={block.text.selectable}></CheckBox>
            <div ref="content">
                <div className={cn(css['toolbar-option'], css['toolbar-color'])}>
                    <label className={cn(css['toolbar-option-label'])}>
                        Multiple
                    </label>
                    <CheckBox checkCallback={this.setMode} checked={block.text.selectable === 'multiple'}></CheckBox>
                </div>
            </div>
        </div>;
    }
}

var selector = function(state) {
    return {presentation: state.presentation};
};

export default connect(selector)(styleable(style)(SelectableOptions));
