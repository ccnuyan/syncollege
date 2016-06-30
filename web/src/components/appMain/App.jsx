import React, {PropTypes} from 'react';
import style from './App.scss';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import styleable from 'react-styleable';
import userActions from '../../redux/actions/userActions';
import {connect} from 'react-redux';
import cn from 'classnames';

class App extends React.Component {
    constructor() {
        super();
        this.onShowQrcode = this.onShowQrcode.bind(this);
        this.hideQrcode = this.hideQrcode.bind(this);
    }
    componentDidMount() {
        this.hideQrcode();
    }
    onShowQrcode(url) {
        if (!this.qrcode) {
            this.qrcode = new QRCode(this.refs['qrcode'], {
                text: url,
                width: '700',
                height: '700',
                correctLevel: QRCode.CorrectLevel.H
            });
        } else {
            this.qrcode.clear(); // clear the code.
            this.qrcode.makeCode(url);
        }

        _Y_.show(this.refs['qrcode']);
        _Y_.hide(this.refs['content']);

    }

    hideQrcode() {
        _Y_.hide(this.refs['qrcode']);
        _Y_.show(this.refs['content']);
    }

    static childContextTypes = {
        onShowQrcode: PropTypes.func.isRequired
    };

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    getChildContext() {
        return {onShowQrcode: this.onShowQrcode};
    };

    render() {
        var css = this.props.css;

        return (
            <div className={css.app}>
                <Header></Header>
                <div ref="content" className={css.pageContent}>
                    {this.props.children}
                </div>
                <Footer></Footer>
                {/*
                */}
                <div onClick={this.hideQrcode} className={cn(css.qrcodeOverlay, 'dead-center')} ref="qrcode"></div>
            </div>
        );
    }
}

var selector = function(state) {
    return {user: state.user};
};

App.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default connect(selector)(styleable(style)(App));
