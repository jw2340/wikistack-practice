const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack1', {logging: false});
const marked = require('marked');

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
  tags: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    set: function(tags) {
      tags = tags || [];
      if (typeof tags === 'string') {
        tags = tags.split(',').map(tag => tag.trim());
      }

      this.setDataValue('tags', tags);
    }
  }
}, {
  getterMethods: {
    route: function() {return '/wiki/' + this.urlTitle;},
    renderedContent: function() {
      return marked(this.content);
    }
  },
  classMethods: {
    findByTag: function(tag) {
      // this is the constructor Page
      return this.findAll({
        where: {
          tags: {
            $overlap: [tag]
          }
        }
      })
    }
  },
  instanceMethods: {
    findSimilar: function() {
      return Page.findAll({
        where: {
          id: {
            $ne: this.id
          },
          tags: {
            $overlap: this.tags
          }
        }
      });
    }
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
