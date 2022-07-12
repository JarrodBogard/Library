const mongoose = require("mongoose");
// const path = require("path") -- not used with FilePond

// const coverImageBasePath = "uploads/bookCovers" -- not used with FilePond

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publishDate: {
    type: Date,
    required: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  coverImage: { // coverImageName -- not used with FilePond
    type: Buffer,
    required: true,
  },
  coverImageType: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author"
  },
});

bookSchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) { // this.coverImageName -- not used with FilePond
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString("base64")}`
    // return path.join('/', coverImageBasePath, this.coverImageName) -- not used with FilePond
  }
})

// have to use standard function syntax for "this" keyword - can't use arrow function//

module.exports = mongoose.model("Book", bookSchema);
// module.exports.coverImageBasePath = coverImageBasePath -- not used with FilePond
