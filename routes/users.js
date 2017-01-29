const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

module.exports = router;

router.get('/', function(req, res, next) {
  User.findAll({})
  .then(function(users) {
    res.render('users', {users: users});
  })
  .catch(next);
});

router.get('/:userId', function (req, res, next) {
  var userPromise = User.findById(req.params.userId);

  var pagesPromise = Page.findAll({
    where: {
      authorId: req.params.userId
    }
  });

  Promise.all([userPromise, pagesPromise])
  .then(function(values) {
    var user = values[0];
    var pages = values[1];

    res.render('userpages', {pages: pages, user: user});
  })
  .catch(next);

});
