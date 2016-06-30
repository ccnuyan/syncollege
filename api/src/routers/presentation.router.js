var presentation = require('../controllers/presentation.controller');
var passport = require('passport');
var router = require('express').Router();

var bearer = passport.authenticate('bearer', {
    session: false
});

router.route('/')
    .all(bearer)
    .get(presentation.list)
    .post(presentation.create);

router.route('/:presentationId')
    .all(bearer)
    .get(presentation.ownerCheckMiddleware,
        presentation.read)
    .put(presentation.ownerCheckMiddleware,
        presentation.update)
    .delete(presentation.ownerCheckMiddleware,
        presentation.delete);

router.route('/request2play/:presentationId')
    .all(bearer)
    .post(presentation.ownerCheckMiddleware,
        presentation.request2play);

router.param('presentationId', presentation.presentationByID);

module.exports = router;
