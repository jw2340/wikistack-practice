const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

module.exports = router;

router.get('/', function(req, res, next) {

  Page.findAll({})
  .then(function(pages) {
    res.render('index', {pages: pages});
  })
  .catch(next);

});

router.post('/', function(req, res, next) {

  User.findOrCreate({
    where: {
      name: req.body.name,
      email: req.body.email
    }
  })
  .spread(function(user) {
    return Page.create({
      title: req.body.title,
      content: req.body.content,
      status: req.body.status,
      tags: req.body.tags
    })
    .then(function(page) {
      return page.setAuthor(user);
    });
  })
  .then(function (page) {
    res.redirect(page.route);
  })
  .catch(next);

});

router.get('/add/', function(req, res, next) {
  res.render('addpage');
});

router.get('/:urlTitle', function(req, res, next) {
  // ============ alternative using setAuthor, need to change variable names in wikipage.html
  // Page.findOne({
  //   where: {
  //     urlTitle: req.params.urlTitle
  //   }
  // })
  // .then(function(page) {
  //   return page.getAuthor()
  //   .then(function(user) {
  //     page.user = user;
  //     res.render('wikipage', {page: page});
  //   });
  // })
  // .catch(next);

  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    },
    include: [
      {model: User, as: 'author'}
    ]
  })
  .then(function(page) {
    if (page === null) {
      res.sendStatus(404);
    } else {
      res.render('wikipage', {page: page});
    }
  })
  .catch(next);

});
