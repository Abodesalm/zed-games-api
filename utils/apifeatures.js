const allGenres = require("./genres");

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //filtering
    const queryObj = { ...this.queryString };
    const excluded = ["page", "sort", "genres", "limit", "fields", "search"];
    excluded.forEach((el) => delete queryObj[el]);
    //advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let finalQuery = JSON.parse(queryStr);
    this.query = this.query.find(finalQuery);
    return this;
  }

  sort() {
    //Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("name");
    }
    return this;
  }

  limitFields() {
    // Field limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    // Pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 14;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  /*   genres() {
    let genres = this.queryString.genres || "all";
    if (genres === "all") {
      genres = [...allGenres];
    } else {
      genres = this.queryString.genres.split(",");
    }
    genres.forEach((en) => {
      return (this.query = this.query.filter((el) => {
        return el.genres.includes(en);
      }));
    });
  } */
}

module.exports = APIFeatures;
