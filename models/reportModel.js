const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "report must have a title"],
    },
    content: {
      type: String,
      required: [true, "report must have content"],
    },
    image: String,
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reportSchema.pre("updateOne", function (next) {
  this.updated_at = Date.now;
  next();
});

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
