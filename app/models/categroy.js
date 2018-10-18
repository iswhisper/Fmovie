var mongoose = require('mongoose')
var CategroySchema = require('../schemas/categroy')
var Categroy = mongoose.model('Categroy', CategroySchema)

module.exports = Categroy