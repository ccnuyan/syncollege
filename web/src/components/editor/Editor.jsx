import React, {PropTypes} from 'react';
import style from './Editor.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import {connect} from 'react-redux';

import presentationActions from '../../redux/actions/presentationActions';

import PreviewControls from './PreviewControls';
import Projector from './Projector';
import Sidebar from './Sidebar';
import SidebarPanel from './SidebarPanel';
import ToolbarAdd from './ToolbarAdd';
import ToolbarEdit from './ToolbarEdit';
import Diskpanel from '../disk/DiskPanel';

import _ from 'lodash';

class Editor extends React.Component {

    constructor() {
        super();
        this.onSwitchToPreviewMode = this.onSwitchToPreviewMode.bind(this);
        this.onSwitchToEditMode = this.onSwitchToEditMode.bind(this);

        this.switchToAddPanel = this.switchToAddPanel.bind(this);
        this.switchToEditPanel = this.switchToEditPanel.bind(this);
        this.showDisk = this.showDisk.bind(this);
        this.hideDisk = this.hideDisk.bind(this);
        this.setImage = this.setImage.bind(this);

        this.state = {
            diskVisiblitiy: false
        };
    }

    getChildContext() {
        return {
            onSwitchToPreviewMode: this.onSwitchToPreviewMode,
            onSwitchToEditMode: this.onSwitchToEditMode,
            switchToAddPanel: this.switchToAddPanel,
            switchToEditPanel: this.switchToEditPanel,
            showDisk: this.showDisk,
            setImage: this.setImage
        };
    }

    componentDidMount() {
        var presentationId = _Y_.searchToObject(window.location.search).id;

        presentationActions.dispatchGetPresentationAsync({id: presentationId, asOwner: false})(this.props.dispatch, function() {
            return this.props.presentation;
        }.bind(this));

        Velocity(this.refs['panel-edit'], {
            translateX: ['100%', '0']
        }, {duration: 0});

        Velocity(this.refs['panel-edit'], {
            translateX: ['100%', '0']
        }, {duration: 0});

        Velocity(this.refs['panel-add'], {
            translateX: ['0', '-100%']
        }, {duration: 0});

        Velocity(this.refs['container'], {
            opacity: 1
        }, {
            duration: 500,
            delay: 500
        });
    }
    //modes
    onSwitchToPreviewMode() {
        RevealEditor.switchToPreviewMode();

        Velocity(this.refs['toolbars'], {
            translateX: '-240px'
        }, {duration: 50});
        Velocity(this.refs['sidebar'], {
            left: '-70px'
        }, {duration: 150});
        Velocity(this.refs['preview-controls'], {
            translateX: '0px'
        }, {duration: 200});
        this.refs['preview-controls'].style.visibility = 'visible';
        this.refs['preview-controls'].style.opacity = 1;
        this.refs['page-wrapper'].style.paddingLeft = '0px';
    }

    onSwitchToEditMode() {
        RevealEditor.switchToEditMode();

        Velocity(this.refs['toolbars'], {
            translateX: '0px'
        }, {duration: 150});
        Velocity(this.refs['sidebar'], {
            left: '0px'
        }, {duration: 50});
        Velocity(this.refs['preview-controls'], {
            translateX: '-100px'
        }, {duration: 200});

        this.refs['preview-controls'].style.visibility = 'hidden';
        this.refs['preview-controls'].style.opacity = 0;
        this.refs['page-wrapper'].style.paddingLeft = '240px';
    }

    //panels
    switchToAddPanel() {

        // Velocity(this.refs['panel-edit'], 'reverse');
        // Velocity(this.refs['panel-add'], 'reverse');

        Velocity(this.refs['panel-add'], {
            translateX: '0'
        }, {duration: 200});
        Velocity(this.refs['panel-edit'], {
            translateX: '100%'
        }, {duration: 200});
    }

    switchToEditPanel() {
        Velocity(this.refs['panel-add'], {
            translateX: '-100%'
        }, {duration: 200});
        Velocity(this.refs['panel-edit'], {
            translateX: '0'
        }, {duration: 200});
    }

    showDisk() {
        this.setState({diskVisiblitiy: true});
    }

    hideDisk() {
        this.setState({diskVisiblitiy: false});
    }

    setImage(url) {
        RevealEditor.setImage(url);
        this.hideDisk();
    }

    render() {
        var css = this.props.css;
        var user = this.props.user.get('payload').toObject();

        if (_.isEmpty(user)) {
            _Y_.navigateTo('/login');
        } else {
            return <div ref="container" style={{
                opacity: 0
            }} className={css.container}>
                <div ref="page-wrapper" className={css['page-wrapper']}>
                    <div ref="preview-controls" className={cn(css['preview-controls'])}>
                        <PreviewControls></PreviewControls>
                    </div>
                    <div ref="sidebar" className={cn(css['sidebar'])}>
                        <Sidebar></Sidebar>
                    </div>
                    <div ref="projector" className={cn(css['projector'])}>
                        <Projector ref="projector"></Projector>
                    </div>
                </div>
                <div ref="toolbars" className={cn(css['toolbars'])}>
                    <div className={cn(css['toolbars-inner'])}>
                        <div className={cn(css['toolbars-scroller'])}>
                            <div ref="panel-add" className={cn(css['toolbar'])} data-type="add">
                                <ToolbarAdd></ToolbarAdd>
                            </div>
                            <div ref="panel-edit" className={cn(css['toolbar'])} data-type="edit">
                                <ToolbarEdit></ToolbarEdit>
                            </div>
                        </div>
                    </div>
                    <div className={cn(css['toolbars-footer'])}></div>
                </div>
                {this.state.diskVisiblitiy
                    ? <div className={cn(css.diskContainer, 'dead-center')}>
                            <div style={{
                                width: '100%',
                                textAlign: 'right'
                            }}>
                                <button style={{
                                    color: '#777'
                                }} className="button-hollow icon-cross" onClick={this.hideDisk}></button>
                            </div>
                            <Diskpanel/>
                        </div>
                    : ''}
            </div>;
        }
    }
}
var selector = function(state) {
    return {user: state.user, presentation: state.presentation};
};

Editor.childContextTypes = {
    onSwitchToPreviewMode: PropTypes.func.isRequired,
    onSwitchToEditMode: PropTypes.func.isRequired,

    switchToAddPanel: PropTypes.func.isRequired,
    switchToEditPanel: PropTypes.func.isRequired,
    showDisk: PropTypes.func.isRequired,
    setImage: PropTypes.func.isRequired
};

export default connect(selector)(styleable(style)(Editor));
