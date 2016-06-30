import config from './editorConf.js';
import css from './editor.scss';
import revealConf from '../../service/revealConf.js';
import SectionManipulator from './SectionManipulator.js';
import Axis from './Axis.js';
import templates from './templates.js';

(function() {

    //这是编辑器设置
    var _ec = config;

    //utilities
    var getEditor = function() {
        return document.querySelector('.reveal-editor');
    };

    function getWrapper() {
        return document.querySelector(_ec.selectors.wrapper);
    }

    function getBlockContent(block) {
        return block.querySelector(_ec.selectors.content);
    }

    //两种模式
    // editing RevealEditor.mode === 'editing';
    // previewing RevealEditor.mode === 'previewing';


    //Block的事件
    function linkBlockEvents(block) {
        var content = getBlockContent(block);

        var transform = block.querySelector(_ec.selectors.transform);

        if (!transform) {
            transform = createTransformForSlideBlock(block);
        }
        //linking events
        transform.addEventListener('click', function(event) {
            if (RevealEditor.mode !== 'editing') return;
            console.log('transform click');
            event.stopPropagation();
        });

        content.addEventListener('click', function(event) {
            if (RevealEditor.mode !== 'editing') return;
            switch (block.dataset.blockType) {
                case 'text':
                    if (content.contentEditable === 'true') {
                        event.stopPropagation();
                    }
                    break;
                default:
            }
        });

        block.addEventListener('click', function(event) {
            var wrapper = getWrapper();
            if (RevealEditor.mode !== 'editing') return;
            console.log('block click');
            RevealEditor.currentBlock = block;
            toManipulate();
            _Y_.each(_ec.selectors.block, function(blk) {
                blk !== block && toPreview(blk);
            });
            event.stopPropagation();

            var detail = {
                type: RevealEditor.currentBlock.dataset.blockType,
            };

            switch (RevealEditor.currentBlock.dataset.blockType) {
                case 'text':
                    var content = RevealEditor.currentBlock.querySelector(_ec.selectors.content);
                    var style = getComputedStyle(content);
                    var textDetail = {
                        //from getComputedStyle
                        color: style.color || '',
                        background: style.background || '',
                        opacity: style.opacity || 1,

                        //from style
                        fontSize: content.style.fontSize || '100%',

                        //dataset
                        selectable: RevealEditor.currentBlock.getAttribute('data-vote-selectable') || '',
                    };
                    detail.text = textDetail;
                    break;
                case 'image':
                    var content = RevealEditor.currentBlock.querySelector(_ec.selectors.content);
                    var style = getComputedStyle(content);

                    var imageDetail = {
                        opacity: style.opacity || 1,
                    };
                    detail.image = imageDetail;
                default:
            }

            var evt = new CustomEvent('blockClick', {
                detail: detail
            });
            getEditor().dispatchEvent(evt);
        });

        block.addEventListener('dblclick', function() {
            if (RevealEditor.mode !== 'editing') return;
            console.log('block double click');
            RevealEditor.currentBlock = block;
            toEdit();
            event.stopPropagation();
        });

        Array.prototype.forEach.call(transform.querySelectorAll('.anchor'),
            function(anchor) {
                anchor.setAttribute('draggable', true);

                anchor.addEventListener('dragstart', function(event) {
                    if (RevealEditor.mode !== 'editing') return;

                    RevealEditor.draggingBlock = block;
                    RevealEditor.draggingAnchor = anchor;

                    console.log('start dragging anchor');
                    event.stopPropagation();

                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setDragImage(_Y_.emptyDragImage, 0, 0);

                    var blockStyle = getComputedStyle(block);


                    block.setAttribute('data-drag-from', JSON.stringify({
                        blockType: block.dataset.blockType,
                        mode: 'resize',
                        x: event.clientX,
                        y: event.clientY,
                        top: blockStyle.top,
                        left: blockStyle.left,
                        width: blockStyle.width,
                        height: blockStyle.height,
                        right: blockStyle.right,
                        bottom: blockStyle.bottom,
                    }));
                    event.stopPropagation();
                });
            });

        block.addEventListener('dragstart', function(event) {
            if (RevealEditor.mode !== 'editing') return;
            console.log('start dragging block');

            RevealEditor.draggingBlock = block;
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setDragImage(_Y_.emptyDragImage, 0, 0);

            var blockStyle = getComputedStyle(block);

            block.setAttribute('data-drag-from', JSON.stringify({
                blockType: block.dataset.blockType,
                mode: 'move',
                x: event.clientX,
                y: event.clientY,
                top: blockStyle.top,
                left: blockStyle.left,
                width: blockStyle.width,
                height: blockStyle.height,
                right: blockStyle.right,
                bottom: blockStyle.bottom,
            }));
            event.stopPropagation();
        });
    };

    function linkWrapperEvents() {
        var wrapper = getWrapper();

        wrapper.setAttribute('draggable', true);

        wrapper.addEventListener('click', function(event) {
            console.log('wrapper click');
            RevealEditor.currentBlock = null;

            _Y_.each(_ec.selectors.block, function(block) {
                toPreview(block);
            });
            event.stopPropagation();

            var evt = new CustomEvent('wrapperClick');
            getEditor().dispatchEvent(evt);
        });

        wrapper.addEventListener('dragstart', function(event) {

            if (RevealEditor.selectRect) {
                RevealEditor.selectRect.style.width = '0px';
                RevealEditor.selectRect.style.height = '0px';

                _Y_.show(RevealEditor.selectRect);
            }
            console.log('start dragging wrapper');

            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setDragImage(_Y_.emptyDragImage, 0, 0);

            RevealEditor.draggingBlock = wrapper;

            wrapper.setAttribute('data-drag-from', JSON.stringify({
                mode: 'drag-select',
                x: event.clientX,
                y: event.clientY,
            }));
        });

        wrapper.addEventListener('dragend', function(event) {
            if (RevealEditor.selectRect) {
                _Y_.hide(RevealEditor.selectRect);
            }
        });

        wrapper.addEventListener('dragover', function(event) {
            event.preventDefault();

            event.dataTransfer.dropEffect = 'move';
            var org = JSON.parse(RevealEditor.draggingBlock.dataset.dragFrom);
            switch (org.mode) {
                case 'move':
                    RevealEditor.draggingBlock.style.left = (parseInt(org.left) + event.clientX - org.x) + 'px';
                    RevealEditor.draggingBlock.style.top = (parseInt(org.top) + event.clientY - org.y) + 'px';
                    break;
                case 'resize':
                    var absoluteResize = function(bstyle, dr, offsetX, offsetY) {
                        switch (dr) {
                            case 'e':
                                bstyle.left = (parseInt(org.left) + offsetX) + 'px';
                                bstyle.width = (parseInt(org.width) - offsetX) + 'px';
                                break;
                            case 'w':
                                bstyle.width = (parseInt(org.width) + offsetX) + 'px';
                                bstyle.right = (parseInt(org.right) - offsetX) + 'px';
                                break;
                            case 'n':
                                bstyle.top = (parseInt(org.top) + offsetY) + 'px';
                                bstyle.height = (parseInt(org.height) - offsetY) + 'px';
                                break;
                            case 's':
                                bstyle.bottom = (parseInt(org.bottom) - offsetY) + 'px';
                                bstyle.height = (parseInt(org.height) + offsetY) + 'px';
                                break;
                            case 'ne':
                                bstyle.top = (parseInt(org.top) + offsetY) + 'px';
                                bstyle.height = (parseInt(org.height) - offsetY) + 'px';
                                bstyle.left = (parseInt(org.left) + offsetX) + 'px';
                                bstyle.width = (parseInt(org.width) - offsetX) + 'px';
                                break;
                            case 'nw':
                                bstyle.top = (parseInt(org.top) + offsetY) + 'px';
                                bstyle.height = (parseInt(org.height) - offsetY) + 'px';
                                bstyle.width = (parseInt(org.width) + offsetX) + 'px';
                                bstyle.right = (parseInt(org.right) - offsetX) + 'px';
                                break;
                            case 'se':
                                bstyle.bottom = (parseInt(org.bottom) - offsetY) + 'px';
                                bstyle.height = (parseInt(org.height) + offsetY) + 'px';
                                bstyle.left = (parseInt(org.left) + offsetX) + 'px';
                                bstyle.width = (parseInt(org.width) - offsetX) + 'px';
                                break;
                            case 'sw':
                                bstyle.bottom = (parseInt(org.bottom) - offsetY) + 'px';
                                bstyle.height = (parseInt(org.height) + offsetY) + 'px';
                                bstyle.width = (parseInt(org.width) + offsetX) + 'px';
                                bstyle.right = (parseInt(org.right) - offsetX) + 'px';
                                break;
                            default:
                        }
                    };

                    var relativeResize = function(bstyle, dr, offsetX, offsetY, nWidth, nHeight) {
                        var deltaHeight = offsetX * nHeight / nWidth;
                        var deltaWidth = offsetY * nWidth / nHeight;

                        switch (dr) {
                            case 'e':
                                bstyle.left = (parseInt(org.left) + offsetX) + 'px';
                                bstyle.width = (parseInt(org.width) - offsetX) + 'px';
                                bstyle.top = (parseInt(org.top) + deltaHeight / 2) + 'px';
                                bstyle.height = (parseInt(org.height) - deltaHeight) + 'px';
                                break;
                            case 'w':
                                bstyle.width = (parseInt(org.width) + offsetX) + 'px';
                                bstyle.right = (parseInt(org.right) - offsetX) + 'px';
                                bstyle.top = (parseInt(org.top) - deltaHeight / 2) + 'px';
                                bstyle.height = (parseInt(org.height) + deltaHeight) + 'px';
                                break;
                            case 'n':
                                bstyle.top = (parseInt(org.top) + offsetY) + 'px';
                                bstyle.height = (parseInt(org.height) - offsetY) + 'px';
                                bstyle.left = (parseInt(org.left) + deltaWidth / 2) + 'px';
                                bstyle.width = (parseInt(org.width) - deltaWidth) + 'px';
                                break;
                            case 's':
                                bstyle.bottom = (parseInt(org.bottom) - offsetY) + 'px';
                                bstyle.height = (parseInt(org.height) + offsetY) + 'px';
                                bstyle.left = (parseInt(org.left) - deltaWidth / 2) + 'px';
                                bstyle.width = (parseInt(org.width) + deltaWidth) + 'px';
                                break;
                            case 'ne':
                                bstyle.top = (parseInt(org.top) + offsetY) + 'px';
                                bstyle.height = (parseInt(org.height) - offsetY) + 'px';
                                bstyle.left = (parseInt(org.left) + deltaWidth) + 'px';
                                bstyle.width = (parseInt(org.width) - deltaWidth) + 'px';
                                break;
                            case 'nw':
                                bstyle.top = (parseInt(org.top) + offsetY) + 'px';
                                bstyle.height = (parseInt(org.height) - offsetY) + 'px';
                                bstyle.width = (parseInt(org.width) - deltaWidth) + 'px';
                                break;
                            case 'se':
                                bstyle.bottom = (parseInt(org.bottom) - offsetY) + 'px';
                                bstyle.height = (parseInt(org.height) + offsetY) + 'px';
                                bstyle.left = (parseInt(org.left) - deltaWidth) + 'px';
                                bstyle.width = (parseInt(org.width) + deltaWidth) + 'px';
                                break;
                            case 'sw':
                                bstyle.bottom = (parseInt(org.bottom) - offsetY) + 'px';
                                bstyle.height = (parseInt(org.height) + offsetY) + 'px';
                                bstyle.width = (parseInt(org.width) + deltaWidth) + 'px';
                                bstyle.right = (parseInt(org.right) - deltaWidth) + 'px';
                                break;
                            default:
                        }
                    };

                    var offsetX = event.clientX - org.x;
                    var offsetY = event.clientY - org.y;

                    var dr = RevealEditor.draggingAnchor.dataset.direction.toString();
                    var bstyle = RevealEditor.draggingBlock.style;

                    switch (org.blockType) {
                        case 'text':
                            absoluteResize(bstyle, dr, offsetX, offsetY);
                            break;
                        case 'image':
                            var image = RevealEditor.draggingBlock.querySelector('.sl-block-content>img');
                            if (!image) {
                                absoluteResize(bstyle, dr, offsetX, offsetY);
                            } else {
                                var nWidth = image.dataset.naturalWidth;
                                var nHeight = image.dataset.naturalHeight;
                                if (nWidth && nHeight && nWidth !== 0 && nHeight != 0) {
                                    relativeResize(bstyle, dr, offsetX, offsetY, nWidth, nHeight);
                                } else {
                                    absoluteResize(bstyle, dr, offsetX, offsetY);
                                }
                            }
                            break;
                        default:
                    }

                    break;
                case 'drag-select':

                    var offsetX = event.clientX - org.x;
                    var offsetY = event.clientY - org.y;

                    var slides = document.querySelector('.slides');

                    if (!RevealEditor.selectRect) {
                        var rect = _Y_.create('div', 'editing-ui', _ec.styles.dragSelectRect);
                        RevealEditor.selectRect = rect;
                        slides.appendChild(rect);
                    }

                    var offset = _Y_.offset(slides);
                    var rect = RevealEditor.selectRect;

                    rect.style.left = ((offsetX >= 0 ? org.x : event.clientX) - offset.left) + 'px';
                    rect.style.top = ((offsetY >= 0 ? org.y : event.clientY) - offset.top) + 'px';
                    rect.style.width = Math.abs(offsetX) + 'px';
                    rect.style.height = Math.abs(offsetY) + 'px';

                    var rectStyle = getComputedStyle(rect);

                    _Y_.each(_ec.selectors.block, function(block) {

                        var blockStyle = getComputedStyle(block);

                        if (
                            parseInt(rectStyle.left) < parseInt(blockStyle.left) &&
                            parseInt(rectStyle.top) < parseInt(blockStyle.top) &&
                            parseInt(rectStyle.left) + parseInt(rectStyle.width) > parseInt(blockStyle.left) + parseInt(blockStyle.width) &&
                            parseInt(rectStyle.top) + parseInt(rectStyle.height) > parseInt(blockStyle.top) + parseInt(blockStyle.height)
                        ) {
                            toManipulate(block);
                        } else {
                            toPreview(block);
                        }
                    });
                    break;
                default:
            }
        });
    };

    function getAxis() {
        return getWrapper().querySelector('.axis');
    }

    function createManipulateAnchor(dr) {
        var anchor = _Y_.create('div', 'anchor', _ec.styles.anchor);
        anchor.setAttribute('data-direction', dr);
        return anchor;
    };

    function createTransformForSlideBlock(el) {
        if (!el.dataset.blockType) {
            return;
        }

        var transform = _Y_.create('div', [_ec.classnames.transform, 'editing-ui'], _ec.styles.transform);

        _Y_.hide(transform);
        el.appendChild(transform);

        switch (el.dataset.blockType) {
            case 'text':
                ['e', 'w'].forEach(function(dr) {
                    transform.appendChild(createManipulateAnchor(dr));
                });
                break;
            case 'image':
                ['e', 'w', 'n', 's', 'ne', 'nw', 'se', 'sw'].forEach(function(dr) {
                    transform.appendChild(createManipulateAnchor(dr));
                });
                break;
            default:
        }

        return transform;
    };

    function createBlock(type, content) {
        var slide = Reveal.getCurrentSlide();
        var blockDiv = _Y_.create('div', 'sl-block', _ec.styles[type + 'Block']);

        blockDiv.setAttribute('data-block-type', type);
        blockDiv.appendChild(content);

        slide.appendChild(blockDiv);
        linkBlockEvents(blockDiv);

        return blockDiv;
    }

    //To Preview a sl-block
    function toPreview(el) {
        el.setAttribute('draggable', false);

        var content = el.querySelector(_ec.selectors.content);
        var transform = el.querySelector(_ec.selectors.transform);

        // transform.style.pointerEvents = 'none';
        _Y_.hide(transform);

        switch (el.dataset.blockType) {
            case 'text':
                Object.keys(CKEDITOR.instances).forEach(function(key) {

                    var ce_instance = CKEDITOR.instances[key];

                    if (ce_instance && ce_instance.container.$ === content) {
                        ce_instance.destroy();
                    }
                });
                content.setAttribute('contenteditable', false);

                break;
            case 'image':
                var contentImage = content.querySelector('img');

                if (!contentImage) {} else if (!contentImage.src) {
                    _Y_.hide(contentImage);
                } else {
                    _Y_.show(contentImage);
                }

                break;
            default:

        }
    }

    //To Manipulate a sl-block
    function toManipulate(block) {
        var el;
        if (block) {
            RevealEditor.currentBlock = block;
        }
        el = RevealEditor.currentBlock;

        if (!el) {
            console.log('currentBlock null before toManipulate');
            return;
        }
        el.setAttribute('draggable', true);
        var content = el.querySelector(_ec.selectors.content);

        var elements = document.querySelectorAll('.sl-block');

        var transform = el.querySelector(_ec.selectors.transform);
        transform.style.display = 'block';
        // transform.style.pointerEvents = 'auto';

        switch (el.dataset.blockType) {
            case 'text':
                break;
            case 'image':
                break;
            default:

        }
    }

    //To Edit a sl-block
    function toEdit(block) {
        var el;
        if (block) {
            RevealEditor.currentBlock = block;
        }
        el = RevealEditor.currentBlock;
        if (!el) {
            console.log('currentBlock null before toEdit');
            return;
        }

        el.setAttribute('draggable', false);
        var content = el.querySelector(_ec.selectors.content);
        var transform = el.querySelector(_ec.selectors.transform);

        var hideTransfrom = function() {
            _Y_.hide(transform);
            transform.style.pointerEvents = 'none';
        };

        switch (el.dataset.blockType) {
            case 'text':
                content.setAttribute('contenteditable', 'true');
                for (name in CKEDITOR.instances) {
                    // console.log(CKEDITOR.instances[name]);
                    // console.log(CKEDITOR.instances[name].container);
                    // console.log(content);

                    //not perfect;
                    var ariaLabel = content.getAttribute('aria-label');
                    if (ariaLabel && ariaLabel.split(', ')[1] === name) {
                        CKEDITOR.instances[name].focus();
                        return;
                    }
                }
                var editor = CKEDITOR.inline(content, _ec.ckeditorConfig);
                _Y_.clearUserSelection();
                break;
            case 'image':
                var wrapper = getWrapper();
                var evt = new CustomEvent('requestDisk', {
                    type: 'image'
                });
                getEditor().dispatchEvent(evt);
                break;
            default:

        }
    }

    function remove(block) {

        _Y_.remove(RevealEditor.currentBlock);

        RevealEditor.currentBlock = null;
    }

    function switchToEditMode() {
        var wrapper = getWrapper();
        RevealEditor.mode = 'editing';
        wrapper.setAttribute('draggable', true);
        var evt = new CustomEvent('onEnterEditMode');
        getEditor().dispatchEvent(evt);
    };

    function switchToPreviewMode() {
        var wrapper = getWrapper();
        RevealEditor.mode = 'overviewing';
        wrapper.setAttribute('draggable', false);
        var evt = new CustomEvent('onEnterPreviewMode');
        getEditor().dispatchEvent(evt);
    };

    function addText(content) {
        if (!content) {
            content = _Y_.create('div', _ec.classnames.content);
            var paragraph = _Y_.create('p');
            paragraph.textContent = '输入内容';
            content.appendChild(paragraph);
        }
        var textBlock = createBlock('text', content);
        RevealEditor.currentBlock = textBlock;
        toManipulate();
        toEdit();
    };

    function addImage(content) {
        if (!content) {
            content = _Y_.create('div', _ec.classnames.content, _ec.styles.imageContent);
        }
        var imageblock = createBlock('image', content);
        RevealEditor.currentBlock = imageblock;
    };

    function duplicate() {

        var slide = Reveal.getCurrentSlide();
        var cloneBlock = _Y_.clone(RevealEditor.currentBlock);

        cloneBlock.setAttribute('data-id', '');

        cloneBlock.style.left = 0;
        cloneBlock.style.top = 0;

        slide.appendChild(cloneBlock);

        toPreview(RevealEditor.currentBlock);
        RevealEditor.currentBlock = cloneBlock;

        linkBlockEvents(cloneBlock);
    }

    function changeContentDepth(direction) {

        var content = RevealEditor.currentBlock.querySelector(_ec.selectors.content);
        var max = 0;
        var min = 255;

        _Y_.each(_ec.selectors.content, function(el) {
            if (el !== content && max < parseInt(el.style.zIndex)) {
                max = parseInt(el.style.zIndex);
            }
            if (el !== content && min > parseInt(el.style.zIndex)) {
                min = parseInt(el.style.zIndex);
            }
        });

        switch (direction) {
            case 'up':
                content.style.zIndex = max >= 255 ? 255 : (max + 1);
                break;
            default:
            case 'down':
                content.style.zIndex = min <= 0 ? 0 : (min - 1);
                break;
        }
    };

    function getHtml(wrapper) {
        if (!wrapper) {
            wrapper = getWrapper();
        }
        var rules = {
            slides: {
                classesAllowed: ['slides'],
                attributesAllowed: ['data-id']
            },
            section: {
                classesAllowed: [],
                attributesAllowed: ['data-id']
            },
            block: {
                classesAllowed: ['sl-block'],
                attributesAllowed: ['data-id', 'data-block-type', 'style', 'data-vote-selectable']
            }
        };

        var cwp = _Y_.clone(wrapper);
        var slides = cwp.querySelector('div.slides');

        //remove no use elements

        var removeSelectors = ['.editing-ui', '.overviewing-ui', 'div.slides>div'];

        Array.prototype.forEach.call(removeSelectors, function(selector) {
            var euis = slides.querySelectorAll(selector);
            Array.prototype.forEach.call(euis, function(el) {
                _Y_.remove(el);
            });
        });


        var sections = slides.querySelectorAll('section');
        var blocks = slides.querySelectorAll('div.sl-block');

        //class cleaner

        var removeClassNotExistedInArray = function(el, array) {
            var classToRemove = [];
            Array.prototype.forEach.call(el.classList, function(cn) {
                if (array.indexOf(cn) < 0) {
                    classToRemove.push(cn);
                };
            });
            classToRemove.forEach(function(cn) {
                el.classList.remove(cn);
            });
        };

        removeClassNotExistedInArray(slides, rules.slides.classesAllowed);

        Array.prototype.forEach.call(sections, function(el) {
            removeClassNotExistedInArray(el, rules.section.classesAllowed);
        });

        Array.prototype.forEach.call(blocks, function(el) {
            removeClassNotExistedInArray(el, rules.block.classesAllowed);
        });

        // attribute cleaner

        var removeAttrNotExistedInArray = function(el, array) {
            var attrsToRemove = [];
            Array.prototype.forEach.call(el.attributes, function(attr) {
                if (attr.name === 'class') {
                    if (el.classList.length === 0) {
                        attrsToRemove.push(attr.name);
                    }
                } else if (array.indexOf(attr.name) < 0) {
                    attrsToRemove.push(attr.name);
                };
            });

            attrsToRemove.forEach(function(attr) {
                el.removeAttribute(attr);
            });
        };

        removeAttrNotExistedInArray(slides, rules.slides.attributesAllowed);

        Array.prototype.forEach.call(sections, function(el) {
            removeAttrNotExistedInArray(el, rules.section.attributesAllowed);
        });

        Array.prototype.forEach.call(blocks, function(el) {
            removeAttrNotExistedInArray(el, rules.block.attributesAllowed);
        });

        var wrapperToStore = _Y_.create('div');
        wrapperToStore.appendChild(slides);

        return _Y_.getInnerHTML(wrapperToStore);
    };

    //this should be go right after the Reveal Setup
    function handleRevealEvents() {
        Reveal.addEventListener('overviewshown', function(event) {
            RevealEditor.mode = 'overviewing';
            getWrapper().setAttribute('draggable', false);
            // RevealEditor.getAxis().style.display = 'none';

            //ps: their is no .previewing-ui
            _Y_.each('.editing-ui', function(el) {
                el.style.pointerEvents = 'none';
            });
            _Y_.each('.overviewing-ui', function(el) {
                el.style.pointerEvents = 'auto';
                el.style.display = 'block';
            });
        });
        Reveal.addEventListener('overviewhidden', function(event) {
            RevealEditor.mode = 'editing';
            getWrapper().setAttribute('draggable', true);
            // RevealEditor.getAxis().style.display = 'block';

            _Y_.each('.editing-ui', function(el) {
                el.style.pointerEvents = 'none';
            });
            _Y_.each('.overviewing-ui', function(el) {
                el.style.pointerEvents = 'auto';
                el.style.display = 'none';
            });
        });
    }

    function setupUI() {
        _Y_.each('section', function(section) {
            new SectionManipulator(section);
        });

        new Axis(getWrapper());
    };

    //这个方法应该具备幂等性
    function initialize(html, toEditMode) {
        var wrapper = _Y_.create('div', 'reveal');
        var editor = getEditor();
        _Y_.empty(editor);
        _Y_.setHTML(wrapper, html);

        editor.appendChild(wrapper);
        if (!Reveal) {
            throw new Erorr('Reveal should go first');
        }

        Reveal.initialize(revealConf.editingConf);
        Reveal.navigateTo(Reveal.getIndices().h, Reveal.getIndices().v); //如果不紧跟这句 会出现乱码

        setupUI();
        linkWrapperEvents();

        _Y_.each(_ec.selectors.block, function(block) {
            linkBlockEvents(block);
        });

        if (toEditMode) {
            switchToEditMode();
        } else {
            switchToPreviewMode();
        }
    };

    function setOpacity(opacity) {
        var block = RevealEditor.currentBlock;
        if (!block) return false;
        var content = block.querySelector(_ec.selectors.content);
        content.style.opacity = opacity;
        return true;
    }

    function setFontScale(size) {
        var block = RevealEditor.currentBlock;
        if (!block || block.dataset.blockType !== 'text') return false;
        var content = block.querySelector(_ec.selectors.content);
        content.style.fontSize = size;
        return true;
    }

    function setTextColor(color) {
        var block = RevealEditor.currentBlock;
        if (!block || block.dataset.blockType !== 'text') return false;
        var content = block.querySelector(_ec.selectors.content);
        if (color) {
            content.style.color = color;
        } else {
            content.style.color = 'inherit';
        }
        return true;
    }


    function setTextBackground(color) {
        var block = RevealEditor.currentBlock;
        if (!block || block.dataset.blockType !== 'text') return false;
        var content = block.querySelector(_ec.selectors.content);
        if (color) {
            content.style.background = color;
        } else {
            content.style.background = 'transparent';
        }
        return true;
    }

    function setTextAlign(algn) {
        var block = RevealEditor.currentBlock;
        if (!block || block.dataset.blockType !== 'text') return false;
        var content = block.querySelector(_ec.selectors.content);
        content.style.textAlign = algn;
        return true;
    }

    function setImage(imageUrl) {
        var block = RevealEditor.currentBlock;
        if (!block || block.dataset.blockType !== 'image') return false;
        var content = block.querySelector(_ec.selectors.content);
        var contentImage = content.querySelector('img');
        if (!contentImage) {
            contentImage = _Y_.create('img');
            content.appendChild(contentImage);
        }
        contentImage.onload = function() {
            var nWidth = contentImage.naturalWidth;
            var nHeight = contentImage.naturalHeight;

            if (nWidth === 0 || nHeight === 0)
                return;

            contentImage.setAttribute('data-natural-width', nWidth);
            contentImage.setAttribute('data-natural-height', nHeight);

            block.style.width = nWidth + 'px';
            block.style.height = nHeight + 'px';
            _Y_.show(contentImage);
        };
        contentImage.src = imageUrl;
    }

    function setSelectable(selectable) {
        if (!selectable || (selectable !== 'single' && selectable !== 'multiple')) {
            block.remoteAttribute('data-vote-selectable');
        }
        var block = RevealEditor.currentBlock;
        if (!block || block.dataset.blockType !== 'text') return false;

        block.setAttribute('data-vote-selectable', selectable);
    }

    function addNewSection() {
        var slide = Reveal.getCurrentSlide();
        if (!slide) {
            debugger;
        }
        var section = _Y_.create('section');
        _Y_.setHTML(section, templates.sectionTemplates.title);
        var indicies = Reveal.getIndices();

        if (slide.parentNode.nodeName === 'DIV') {
            slide.parentNode.insertBefore(section, slide.nextSibling);
            var html = getHtml(getWrapper());
            initialize(html, true);
        } else if (slide.parentNode.nodeName === 'SECTION') {
            slide.parentNode.parentNode.insertBefore(section, slide.parentNode.nextSibling);
            var html = getHtml(getWrapper());
            initialize(html, true);
        }
        Reveal.navigateTo(indicies.h + 1, 0);
    }

    function addNewSubSection() {
        var slide = Reveal.getCurrentSlide();
        if (!slide) {
            debugger;
        }
        var section = _Y_.create('section');
        _Y_.setHTML(section, templates.sectionTemplates.titleAndSubtitle);
        var indicies = Reveal.getIndices();

        if (slide.parentNode.nodeName === 'DIV') {
            var containerSection = _Y_.create('section');
            containerSection.appendChild(_Y_.clone(slide));
            containerSection.appendChild(section);
            slide.parentNode.insertBefore(containerSection, slide);
            _Y_.remove(slide);
            var html = getHtml(getWrapper());
            initialize(html, true);
        } else if (slide.parentNode.nodeName === 'SECTION') {
            slide.parentNode.insertBefore(section, slide.nextSibling);
            var html = getHtml(getWrapper());
            initialize(html, true);
        };
        Reveal.navigateTo(indicies.h, indicies.v + 1);
    }


    function refresh() {
        initialize(getHtml(getWrapper()), true);
    }

    window.RevealEditor = {
        getWrapper,
        getAxis,
        addText,
        addImage,
        remove,
        duplicate,
        changeContentDepth,
        toManipulate,
        toEdit,
        toPreview,

        switchToEditMode,
        switchToPreviewMode,

        getHtml,
        initialize,

        setOpacity,

        setFontScale,
        setTextColor,
        setTextBackground,
        setTextAlign,
        setSelectable,

        setImage,

        addNewSection,
        addNewSubSection,
        handleRevealEvents,

        refresh,
    };
})();
