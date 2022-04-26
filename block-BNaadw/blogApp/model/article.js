var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title : {type : String, required: true},
    description : String,
    likes : Number,
    comments : [String],
    author : String,
    slug : String
},{timestamps : true})

var Article = mongoose.model('Article',articleSchema);

module.exports = Article;