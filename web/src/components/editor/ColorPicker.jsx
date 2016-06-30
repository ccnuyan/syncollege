import React, {PropTypes} from 'react';
import style from './Toolbar.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import presentationActions from '../../redux/actions/presentationActions';
import {connect} from 'react-redux';
// import 'react-colors-picker/assets/index.css';
// import ReactColorPicker from 'react-colors-picker';

class ColorPicker extends React.Component {

    constructor(props) {
        super(props);
        this.onSwitch = this.onSwitch.bind(this);
    }

    onSwitch() {
        if (this.refs.content.getAttribute('data-status') === 'down') {
            Velocity(this.refs.content, 'slideDown', {duration: 200});
            this.refs.content.setAttribute('data-status', 'up');
        } else if (this.refs.content.getAttribute('data-status') === 'up') {
            Velocity(this.refs.content, 'slideUp', {duration: 200});
            this.refs.content.setAttribute('data-status', 'down');
        }
    }

    componentDidMount() {
        Velocity(this.refs.content, 'slideUp', {duration: 0});
        this.refs.content.setAttribute('data-status', 'down');

        var css = this.props.css;
        var thumbs = this.refs.content.querySelectorAll(`.${css['sp-thumb-el']}`);

        Array.prototype.forEach.call(thumbs, function(el) {
            el.addEventListener('click', function(event) {
                var color = el.dataset.color;
                console.log(color);
                this.props.changeCallback(color);
                this.refs.panel.style.background = color;
            }.bind(this));
        }.bind(this));

        this.refs.panel.style.background = this.props.initialColor;
    }

    componentDidUpdate(prevProps, prevState) {
        Velocity(this.refs.content, 'slideUp', {duration: 0});
        this.refs.content.setAttribute('data-status', 'down');
    }

    render() {
        var css = this.props.css;
        return <div className={cn(css['toolbar-option'], css['toolbar-color'])}>
            <h4 onClick={this.onSwitch} className={cn(css['toolbar-option-label'])}>
                {this.props.label}
            </h4>

            <button onClick={this.props.clearCallback} className={cn(css['palette-anchor'], css['palette-anchor-button'],'icon-cog')}></button>
            <div ref='panel' onClick={this.onSwitch} className={cn(css['palette-panel'])}></div>
            <div ref='content' className={css['sp-palette']}>
                <div className={cn(css['sp-palette-row'], css['sp-palette-row-0'])}>
                    <div title="#000000" data-color="rgb(0, 0, 0)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(0, 0, 0)'
                        }}/>
                    </div>
                    <div title="#222222" data-color="rgb(34, 34, 34)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(34, 34, 34)'
                        }}/>
                    </div>
                    <div title="#444444" data-color="rgb(68, 68, 68)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(68, 68, 68)'
                        }}/>
                    </div>
                    <div title="#666666" data-color="rgb(102, 102, 102)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(102, 102, 102)'
                        }}/>
                    </div>
                    <div title="#888888" data-color="rgb(136, 136, 136)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(136, 136, 136)'
                        }}/>
                    </div>
                    <div title="#aaaaaa" data-color="rgb(170, 170, 170)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(170, 170, 170)'
                        }}/>
                    </div>
                    <div title="#cccccc" data-color="rgb(204, 204, 204)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(204, 204, 204)'
                        }}/>
                    </div>
                    <div title="#eeeeee" data-color="rgb(238, 238, 238)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(238, 238, 238)'
                        }}/>
                    </div>
                    <div title="#ffffff" data-color="rgb(255, 255, 255)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(255, 255, 255)'
                        }}/>
                    </div>
                    <div title="#000000" data-color="rgba(0, 0, 0, 0)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgba(0, 0, 0, 0)'
                        }}/>
                    </div>
                </div>
                <div className={cn(css['sp-palette-row'], css['sp-palette-row-1'])}>
                    <div title="#980000" data-color="rgb(152, 0, 0)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(152, 0, 0)'
                        }}/>
                    </div>
                    <div title="#ff0000" data-color="rgb(255, 0, 0)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(255, 0, 0)'
                        }}/>
                    </div>
                    <div title="#ff9900" data-color="rgb(255, 153, 0)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(255, 153, 0)'
                        }}/>
                    </div>
                    <div title="#ffff00" data-color="rgb(255, 255, 0)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(255, 255, 0)'
                        }}/>
                    </div>
                    <div title="#00ff00" data-color="rgb(0, 255, 0)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(0, 255, 0)'
                        }}/>
                    </div>
                    <div title="#00ffff" data-color="rgb(0, 255, 255)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(0, 255, 255)'
                        }}/>
                    </div>
                    <div title="#4a86e8" data-color="rgb(74, 134, 232)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(74, 134, 232)'
                        }}/>
                    </div>
                    <div title="#0000ff" data-color="rgb(0, 0, 255)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(0, 0, 255)'
                        }}/>
                    </div>
                    <div title="#9900ff" data-color="rgb(153, 0, 255)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(153, 0, 255)'
                        }}/>
                    </div>
                    <div title="#a8276b" data-color="rgb(168, 39, 107)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(168, 39, 107)'
                        }}/>
                    </div>
                </div>
                <div className={cn(css['sp-palette-row'], css['sp-palette-row-2'])}>
                    <div title="#e6b8af" data-color="rgb(230, 184, 175)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(230, 184, 175)'
                        }}/>
                    </div>
                    <div title="#f4cccc" data-color="rgb(244, 204, 204)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(244, 204, 204)'
                        }}/>
                    </div>
                    <div title="#fce5cd" data-color="rgb(252, 229, 205)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(252, 229, 205)'
                        }}/>
                    </div>
                    <div title="#fff2cc" data-color="rgb(255, 242, 204)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(255, 242, 204)'
                        }}/>
                    </div>
                    <div title="#d9ead3" data-color="rgb(217, 234, 211)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(217, 234, 211)'
                        }}/>
                    </div>
                    <div title="#d0e0e3" data-color="rgb(208, 224, 227)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(208, 224, 227)'
                        }}/>
                    </div>
                    <div title="#c9daf8" data-color="rgb(201, 218, 248)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(201, 218, 248)'
                        }}/>
                    </div>
                    <div title="#cfe2f3" data-color="rgb(207, 226, 243)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(207, 226, 243)'
                        }}/>
                    </div>
                    <div title="#d9d2e9" data-color="rgb(217, 210, 233)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(217, 210, 233)'
                        }}/>
                    </div>
                    <div title="#ead1dc" data-color="rgb(234, 209, 220)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(234, 209, 220)'
                        }}/>
                    </div>
                    <div title="#dd7e6b" data-color="rgb(221, 126, 107)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(221, 126, 107)'
                        }}/>
                    </div>
                    <div title="#ea9999" data-color="rgb(234, 153, 153)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(234, 153, 153)'
                        }}/>
                    </div>
                    <div title="#f9cb9c" data-color="rgb(249, 203, 156)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(249, 203, 156)'
                        }}/>
                    </div>
                    <div title="#ffe599" data-color="rgb(255, 229, 153)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(255, 229, 153)'
                        }}/>
                    </div>
                    <div title="#b6d7a8" data-color="rgb(182, 215, 168)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(182, 215, 168)'
                        }}/>
                    </div>
                    <div title="#a2c4c9" data-color="rgb(162, 196, 201)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(162, 196, 201)'
                        }}/>
                    </div>
                    <div title="#a4c2f4" data-color="rgb(164, 194, 244)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(164, 194, 244)'
                        }}/>
                    </div>
                    <div title="#9fc5e8" data-color="rgb(159, 197, 232)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(159, 197, 232)'
                        }}/>
                    </div>
                    <div title="#b4a7d6" data-color="rgb(180, 167, 214)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(180, 167, 214)'
                        }}/>
                    </div>
                    <div title="#d5a6bd" data-color="rgb(213, 166, 189)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(213, 166, 189)'
                        }}/>
                    </div>
                    <div title="#cc4125" data-color="rgb(204, 65, 37)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(204, 65, 37)'
                        }}/>
                    </div>
                    <div title="#e06666" data-color="rgb(224, 102, 102)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(224, 102, 102)'
                        }}/>
                    </div>
                    <div title="#f6b26b" data-color="rgb(246, 178, 107)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(246, 178, 107)'
                        }}/>
                    </div>
                    <div title="#ffd966" data-color="rgb(255, 217, 102)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(255, 217, 102)'
                        }}/>
                    </div>
                    <div title="#93c47d" data-color="rgb(147, 196, 125)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(147, 196, 125)'
                        }}/>
                    </div>
                    <div title="#76a5af" data-color="rgb(118, 165, 175)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(118, 165, 175)'
                        }}/>
                    </div>
                    <div title="#6d9eeb" data-color="rgb(109, 158, 235)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(109, 158, 235)'
                        }}/>
                    </div>
                    <div title="#6fa8dc" data-color="rgb(111, 168, 220)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(111, 168, 220)'
                        }}/>
                    </div>
                    <div title="#8e7cc3" data-color="rgb(142, 124, 195)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(142, 124, 195)'
                        }}/>
                    </div>
                    <div title="#c27ba0" data-color="rgb(194, 123, 160)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(194, 123, 160)'
                        }}/>
                    </div>
                    <div title="#a61c00" data-color="rgb(166, 28, 0)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(166, 28, 0)'
                        }}/>
                    </div>
                    <div title="#cc0000" data-color="rgb(204, 0, 0)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(204, 0, 0)'
                        }}/>
                    </div>
                    <div title="#e69138" data-color="rgb(230, 145, 56)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(230, 145, 56)'
                        }}/>
                    </div>
                    <div title="#f1c232" data-color="rgb(241, 194, 50)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(241, 194, 50)'
                        }}/>
                    </div>
                    <div title="#6aa84f" data-color="rgb(106, 168, 79)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(106, 168, 79)'
                        }}/>
                    </div>
                    <div title="#45818e" data-color="rgb(69, 129, 142)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(69, 129, 142)'
                        }}/>
                    </div>
                    <div title="#3c78d8" data-color="rgb(60, 120, 216)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(60, 120, 216)'
                        }}/>
                    </div>
                    <div title="#3d85c6" data-color="rgb(61, 133, 198)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(61, 133, 198)'
                        }}/>
                    </div>
                    <div title="#674ea7" data-color="rgb(103, 78, 167)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(103, 78, 167)'
                        }}/>
                    </div>
                    <div title="#a64d79" data-color="rgb(166, 77, 121)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(166, 77, 121)'
                        }}/>
                    </div>
                    <div title="#5b0f00" data-color="rgb(91, 15, 0)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(91, 15, 0)'
                        }}/>
                    </div>
                    <div title="#660000" data-color="rgb(102, 0, 0)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(102, 0, 0)'
                        }}/>
                    </div>
                    <div title="#783f04" data-color="rgb(120, 63, 4)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(120, 63, 4)'
                        }}/>
                    </div>
                    <div title="#7f6000" data-color="rgb(127, 96, 0)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(127, 96, 0)'
                        }}/>
                    </div>
                    <div title="#274e13" data-color="rgb(39, 78, 19)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(39, 78, 19)'
                        }}/>
                    </div>
                    <div title="#0c343d" data-color="rgb(12, 52, 61)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(12, 52, 61)'
                        }}/>
                    </div>
                    <div title="#1c4587" data-color="rgb(28, 69, 135)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(28, 69, 135)'
                        }}/>
                    </div>
                    <div title="#073763" data-color="rgb(7, 55, 99)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(7, 55, 99)'
                        }}/>
                    </div>
                    <div title="#20124d" data-color="rgb(32, 18, 77)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(32, 18, 77)'
                        }}/>
                    </div>
                    <div title="#4c1130" data-color="rgb(76, 17, 48)" className={css['sp-thumb-el']}>
                        <div className={css['sp-thumb-inner']} style={{
                            backgroundColor: 'rgb(76, 17, 48)'
                        }}/>
                    </div>
                </div>
                <div className="sp-palette-row sp-palette-row-selection"/>
            </div>
        </div>;
    }
}

ColorPicker.propTypes = {
    changeCallback: React.PropTypes.func.isRequired,
    clearCallback: React.PropTypes.func.isRequired
};

export default styleable(style)(ColorPicker);
