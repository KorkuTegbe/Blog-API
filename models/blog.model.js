const mongoose = require('mongoose')
const slugify = require('slugify')

const objectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Your blog needs a title'],
        unique: true
    },
    slug: {
        type: String
    },
    description: {
        type: String,
        required: [true, 'Your blog needs a description'],
    },
    body: {
        type: String,
        required: [true, 'Your blog needs a body'],
    },
    tags: {
        type: Array
    },
    author: {
        type: objectId,
        ref: 'User'
    },
    state: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    read_count: {
        type: Number,
        default: 0
    },
    reading_time: {
        type: String
    }
},
{timestamps: true},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
)

blogSchema.pre('save', function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

blogSchema.pre(/^find/, function (next) {
    this.populate({
      path: 'author',
      select: '-__v -password -email',
    });
    next();
  });

blogSchema.pre(
    '/^find/', function(next){
        this.read_count = this.read_count + 1
        next()
    }
);

const blogModel = mongoose.model('Blog', blogSchema)

module.exports = blogModel