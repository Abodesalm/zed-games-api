const mongoose = require("mongoose");
const allGenres = require("./../utils/genres");

const DLCSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
});

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "the game must have a name !"],
      trim: true,
      maxlength: [36, "game name must have less or equal then 36 characters"],
      minlength: [2, "game name must have more or equal then 2 characters"],
    },
    developer: {
      type: String,
      required: false,
      default: null,
      trim: true,
      maxlength: [32, "studio name must have less or equal then 32 characters"],
    },
    publisher: {
      type: String,
      required: false,
      default: null,
      trim: true,
      maxlength: [32, "studio name must have less or equal then 32 characters"],
    },
    release: {
      type: Number,
      default: null,
    },
    tags: {
      type: [String],
      required: [true, "the game must have at least 1 genre !"],
      enum: {
        values: allGenres,
        message: "all genres must be real genres",
      },
    },
    platforms: {
      type: [String],
      enum: {
        values: [
          "PC",
          "PS1",
          "PS2",
          "PS3",
          "PS4",
          "PS5",
          "XBOX 1",
          "XBOX 360",
          "XBOX SS",
          "XBOX SX",
          "mobile",
          "switch",
          "wii",
        ],
        message: "all platforms must be real platforms",
      },
    },
    series: {
      type: String,
      default: null,
      trim: true,
      maxlength: [32, "series name must have less or equal then 32 character"],
    },
    price: {
      type: Number,
      default: null,
      min: [0, "price cannot be below 0"],
    },
    cover: {
      type: String,
    },
    metacritic: {
      type: Number,
      default: null,
    },
    users_rate: {
      type: Number,
      default: null,
    },
    trailer: String,
    rank: {
      type: String,
      enum: { values: ["normal", "silver", "golden", "old"] },
    },
    descriptions: {
      en: {
        type: String,
        required: false,
        default: null,
        minlength: [5, "description must have more or equal then 5 characters"],
        maxlength: [
          500,
          "description must have less or equal then 500 characters",
        ],
      },
      ar: {
        type: String,
        required: false,
        default: null,
        minlength: [5, "description must have more or equal then 5 characters"],
        maxlength: [
          500,
          "description must have less or equal then 500 characters",
        ],
      },
      de: {
        type: String,
        required: false,
        default: null,
        minlength: [5, "description must have more or equal then 5 characters"],
        maxlength: [
          500,
          "description must have less or equal then 500 characters",
        ],
      },
      fr: {
        type: String,
        required: false,
        default: null,
        minlength: [5, "description must have more or equal then 5 characters"],
        maxlength: [
          500,
          "description must have less or equal then 500 characters",
        ],
      },
      es: {
        type: String,
        required: false,
        default: null,
        minlength: [5, "description must have more or equal then 5 characters"],
        maxlength: [
          500,
          "description must have less or equal then 500 characters",
        ],
      },
    },
    DLCs: {
      type: [DLCSchema],
      default: [],
    },

    req: {
      min: {
        CPU: {
          type: String,
          required: false,
          default: null,
        },
        RAM: {
          type: Number,
          required: false,
          default: null,
        },
        GPU: {
          type: String,
          required: false,
          default: null,
        },
        VRAM: {
          type: Number,
          required: false,
          default: null,
        },
        storage: {
          type: Number,
          required: false,
        },
      },
      rec: {
        CPU: {
          type: String,
          required: false,
          default: null,
        },
        RAM: {
          type: Number,
          required: false,
          default: null,
        },
        GPU: {
          type: String,
          required: false,
          default: null,
        },
        VRAM: {
          type: Number,
          required: false,
          default: null,
        },
        storage: {
          type: Number,
          required: false,
        },
      },
    },

    keywords: {
      type: [String],
    },

    created_at: {
      type: Date,
      default: Date.now,
    },
    slug: String,
    updated_at: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

gameSchema.pre("save", function (next) {
  this.cover = `${this.keywords[0].split(" ").join("-")}.jpg`;
  this.slug = `${this.keywords[0].split(" ").join("-")}`;
  next();
});

/* gameSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "game",
  localField: "_id",
}); */

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;

/*
{
    name: "",
    developer: "",
    publisher:"",
    release: "",
    tags: ["", "", ""],
    series: "",
    price: 50,
    metacritic: 91,
    descriptions:{
      en:"",
      ar:"",
      de:"",
      fr:"",
      sp:""
    },

  req:{
    min:{
      CPU:"",
      GPU:"",
      RAM:,
      VRAM:,
      storage:,
    },
    rec:{
      CPU:"",
      GPU:"",
      RAM:,
      VRAM:,
      storage:
    }
  }
}
*/
