import React, {PropTypes} from 'react';
import style from './Toolbar.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import presentationActions from '../../redux/actions/presentationActions';
import {connect} from 'react-redux';
import Stepper from './Stepper';
import ColorPicker from './ColorPicker';
import SelectableOptions from './SelectableOptions';

class TextBlockActions extends React.Component {
    constructor() {
        super();

        this.setFontScale = this.setFontScale.bind(this);
        this.setTextColor = this.setTextColor.bind(this);
        this.setFontOpacity = this.setFontOpacity.bind(this);
    }

    setFontScale(value) {
        RevealEditor.setFontScale(value);
    }

    setTextColor(color) {
        RevealEditor.setTextColor(color);
    }

    clearTextColor() {
        RevealEditor.setTextColor();
    }

    setTextBackground(color) {
        RevealEditor.setTextBackground(color);
    }

    clearTextBackground() {
        RevealEditor.setTextBackground();
    }

    setFontOpacity(value) {
        var float = parseFloat(value) / 100;
        RevealEditor.setOpacity(float);
    }

    setTextAlign(event) {
        var align = event.currentTarget.dataset.textAlign;
        RevealEditor.setTextAlign(align);
    }

    render() {
        var css = this.props.css;
        var block = this.props.presentation.getIn(['currentPresentation', 'currentBlock']).toObject();

        // var rgbColor = block.text.color;
        // var hexColor = chroma(rgbColor).css();
        //
        // var rgbBackground = block.text.Background;
        // var hexBackground= chroma(rgbColor).css();

        return <div>
            <div className={cn(css['toolbar-option'], css['toolbar-multi'])} data-number-of-items="4">
                <h4 className={cn(css['toolbar-option-label'])}>Text Alignment</h4>
                <div className={cn(css['toolbar-multi-inner'])}>
                    <div onClick={this.setTextAlign} className={cn(css['toolbar-multi-item'])} data-text-align="left">
                        <span className={cn(css['icon'], 'icon-paragraph-left')}></span>
                    </div>
                    <div onClick={this.setTextAlign} className={cn(css['toolbar-multi-item'])} data-text-align="center">
                        <span className={cn(css['icon'], 'icon-paragraph-center')}></span>
                    </div>
                    <div onClick={this.setTextAlign} className={cn(css['toolbar-multi-item'])} data-text-align="justify">
                        <span className={cn(css['icon'], 'icon-paragraph-justify')}></span>
                    </div>
                    <div onClick={this.setTextAlign} className={cn(css['toolbar-multi-item'])} data-text-align="right">
                        <span className={cn(css['icon'], 'icon-paragraph-right')}></span>
                    </div>
                </div>
            </div>

            <Stepper stepperType="text-scale" changeCallback={this.setFontScale} label="Text Scale" initialValue={block.text.fontSize}></Stepper>
            <Stepper stepperType="opacity" changeCallback={this.setFontOpacity} label="Opacity" initialValue={block.text.opacity}></Stepper>

            <ColorPicker initialColor={block.text.color} changeCallback={this.setTextColor} label="Color" clearCallback={this.clearTextColor}></ColorPicker>
            <ColorPicker initialColor={block.text.Background} changeCallback={this.setTextBackground} label="Background" clearCallback={this.clearTextBackground}></ColorPicker>
            <SelectableOptions label="Selectable"></SelectableOptions>
    </div>;
    }
}

var selector = function(state) {
    return {presentation: state.presentation};
};

export default connect(selector)(styleable(style)(TextBlockActions));
