var snapshot = require('../controllers/snapshot.controller');
var passport = require('passport');
var router = require('express').Router();

var bearer = passport.authenticate('bearer', {
    session: false
});

var bearerAndAnonymous = passport.authenticate(['bearer', 'anonymous'], {
    session: false
});

router.route('/')
    .all(bearer)
    .get(snapshot.list);

router.route('/add2favorates/:snapshotId')
    .all(bearer)
    .post(snapshot.add2favorates);

router.route('/submissions/:snapshotId')
    // .all(bearer)
    .get(snapshot.getSubmissions);

router.route('/start2play/:snapshotId')
    .all(bearerAndAnonymous)
    .post(snapshot.ownerSetMiddleware,
        snapshot.start2play);

router.param('snapshotId', snapshot.snapshotByID);

module.exports = router;
