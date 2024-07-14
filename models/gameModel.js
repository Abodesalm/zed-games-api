const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "the game must have a name !"],
      trim: true,
      maxlength: [32, "game name must have less or equal then 32 characters"],
      minlength: [2, "game name must have more or equal then 2 characters"],
    },

    studio: {
      type: String,
      required: false,
      default: null,
      trim: true,
      maxlength: [32, "studio name must have less or equal then 32 characters"],
    },

    desc: {
      type: String,
      required: false,
      default: null,
      minlength: [10, "description must have more or equal then 10 characters"],
    },

    release: {
      type: Number,
      required: false /* [true, "the game must have a release date !"] */,
      default: null,
    },

    genres: {
      type: [String],
      required: [true, "the game must have at least 1 genre !"],
      enum: {
        values: [
          "action",
          "fps",
          "open-world",
          "battleroyal",
          "stealth",
          "RPG",
          "endie",
        ],
        message: "all genres must be real genres",
      },
    },

    series: {
      type: String,
      required: false,
      default: null,
      trim: true,
      maxlength: [32, "series name must have less or equal then 32 character"],
    },

    price: {
      type: Number,
      required: false,
      default: null,
      min: [0, "price cannot be below 0"],
    },

    rates: {
      myStory: {
        type: Number,
        required: false,
        default: null,
        max: [100, "story rate must be below 100"],
      },
      myBeauty: {
        type: Number,
        required: false,
        default: null,
        max: [100, "beauty rate must be below 100"],
      },
      myGameplay: {
        type: Number,
        required: false,
        default: null,
        max: [100, "gameplay rate must be below 100"],
      },
      myTotal: {
        type: Number,
        required: false,
        default: null,
        max: [100, "total rate must be below 100"],
      },
      myReview: {
        type: String,
        required: false,
        default: null,
        trim: true,
      },
    },

    requirements: {
      minCPU: {
        type: String,
        required: false,
        default: null,
      },
      minRAM: {
        type: Number,
        required: false,
        default: null,
      },
      minGPU: {
        type: String,
        required: false,
        default: null,
      },
      minVRAM: {
        type: Number,
        required: false,
        default: null,
      },
      recCPU: {
        type: String,
        required: false,
        default: null,
      },
      recRAM: {
        type: Number,
        required: false,
        default: null,
      },
      recGPU: {
        type: String,
        required: false,
        default: null,
      },
      recVRAM: {
        type: Number,
        required: false,
        default: null,
      },
      storage: {
        type: Number,
        required: [true, "the game must have a storage value !"],
      },
    },
    rank: {
      type: String,
      required: false,
      default: null,
      enum: ["bronze", "silver", "gold", "diamond"],
    },

    addTime: {
      type: Date,
      required: false,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* gameSchema.virtual("myRate").get(function () {
  return [this.myStory, this.myGraphic, this.myGameplay, this.myTotal];
}); */

gameSchema.pre("save", function (next) {
  console.log("\x1b[34m%s\x1b[0m", "Document Will Be Saved...");
  next();
});
/* 
gameSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

gameSchema.post(/^find/, function (next) {
  console.log(
    "\x1b[33m%s\x1b[0m",
    `Query took : ${Date.now() - this.start} ms`
  );
  //next();
}); */

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;

// Name , Desc , Studio , Release , Genres , Series , Price
// MyBeauty , MyGameplay , MyStory , MyTotal , MyReview , Rank
// minCPU , minGPU , minRAM , minVRAM , recCPU , recGPU , recRAM , recVRAM , storage

/*
{
  name: "",
  studio: "",
  desc: "",
  release: "",
  genres: ["", "", ""],
  series: "",
  price: 50,
  rank: "",
  rates: {
    myStory:
    myBeauty:
    myGameplay:
    myTotal:
    myReview:
  },
  requirements:{
    minCPU:"",
    minGPU:"",
    minRAM:,
    minVRAM:,
    recCPU:"",
    recGPU:"",
    recRAM:,
    recVRAM:,
    storage:
  }
}
*/
