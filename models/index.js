const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack1', {logging: false});

var Page =  db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('open', 'closed')
  },
}, {
  getterMethods: {
    route: function() {return '/wiki/' + this.urlTitle;}
  },
  hooks: {
    beforeValidate: function(page) {
       page.urlTitle = page.title ? page.title.replace(/\s+/g, '_').replace(/\W/g, '').trim()
                : Math.random().toString(36).substr(2, 7);
    }
  }
});

var User =  db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  getterMethods: {
    route: function() {return '/users/' + this.id;}
  }
});

Page.belongsTo(User, {as: 'author'});

module.exports = {
  Page: Page,
  User: User
}
