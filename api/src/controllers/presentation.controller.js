var path = require('path');
var mongoose = require('mongoose');
var Presentation = mongoose.model('Presentation');
var Snapshot = mongoose.model('Snapshot');
var _ = require('lodash');
var reporter = require('../services/statusReporter');
var jsdom = require('jsdom');
var uuid = require('uuid');

exports.list = function(req, res, next) {
    Presentation.find({
        user: req.user._id
    }).exec(function(err, data) {
        if (err) {
            return next(err);
        }
        return res.status(200).json(data);
    });
};

exports.create = function(req, res, next) {

    var presentationToCreate = new Presentation({
        name: req.body.name,
        user: req.user._id
    });
    presentationToCreate.content = `<div class="slides" data-id="${uuid.v4()}">
                <section data-id="${uuid.v4()}">
                    <div data-id="${uuid.v4()}" class="sl-block" data-block-type="text" style="width: 800px; left: 80px; top: 270px; height: auto;">
                        <div class="sl-block-content" data-placeholder-tag="h1" data-placeholder-text="Title Text">
                            <h1>Title Text</h1>
                        </div>
                    </div>
                </section>
            </div>`;

    presentationToCreate.save(function(err, retPresentation) {
        if (err) {
            return next(err);
        }
        return res.status(201).json(retPresentation);
    });
};

exports.read = function(req, res) {
    var presObj = req.presentation.toObject();
    presObj.owner = true;
    return res.status(200).json(presObj);
};

exports.update = function(req, res, next) {
    var presentation = req.presentation;

    //https://github.com/tmpvar/jsdom
    var document = jsdom.jsdom(req.body.content);

    //set id - very important
    var slides = document.querySelector('.slides');
    var sections = document.querySelectorAll('section');
    var blocks = document.querySelectorAll('.sl-block');

    function setIdCallback(el) {
        if (!el.getAttribute('data-id')) {
            el.setAttribute('data-id', uuid.v4());
        }
    }

    Array.prototype.forEach.call(sections, setIdCallback);
    Array.prototype.forEach.call(blocks, setIdCallback);

    presentation.content = slides.outerHTML;
    presentation.save(function(err, retPresentation) {
        if (err) {
            return next(err);
        } else {
            // no need to populate here
            return res.status(200).json(retPresentation);
        }
    });
};

exports.delete = function(req, res, next) {
    req.presentation.remove(function(err, removed) {
        return res.status(200).json(removed);
    });
};

//request snapshot to play
//1 copy from presentation
//2 initialize the configuration
exports.request2play = function(req, res) {
    var presentation = req.presentation;

    var snapshot = new Snapshot({
        user: presentation.user,
        name: presentation.name,
        content: presentation.content,
        theme: presentation.theme,
        presentation: presentation.id,
        //configuration
        allowAnonymous: !!req.body.allowAnonymous,
        interactive: !!req.body.interactive,
    });

    snapshot.save(function(err, snapshot) {
        if (err) {
            return next(err);
        }
        return res.status(201).send(snapshot);
    });
};

//Middleware
exports.ownerCheckMiddleware = function(req, res, next) {
    if (req.presentation.user.equals(req.user._id)) {
        req.presentation.owner = true;
        return next();
    } else {
        return reporter.presetationOwnerValidationError;
    }
};

exports.presentationByID = function(req, res, next, id) {
    Presentation.findById(id)
        .exec(function(err, presentation) {
            if (err) {
                return next(err);
            }
            if (!presentation) {
                return next({
                    message: 'presentation specified does not exist'
                });
            }
            req.presentation = presentation;
            return next();
        });
};
