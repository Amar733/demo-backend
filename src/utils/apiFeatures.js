class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Search by name or description
  search() {
    const keyword = this.queryString.keyword
      ? {
          $or: [
            { name: { $regex: this.queryString.keyword, $options: 'i' } },
            { description: { $regex: this.queryString.keyword, $options: 'i' } }
          ]
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // Filter by fields
  filter() {
    const queryCopy = { ...this.queryString };

    // Remove fields from query
    const removeFields = ['keyword', 'page', 'limit', 'sort', 'fields'];
    removeFields.forEach(field => delete queryCopy[field]);

    // Advanced filtering for price range, etc.
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // Sort results
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // Limit fields
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  // Pagination
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 20;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    this.pagination = {
      page,
      limit,
      skip
    };

    return this;
  }
}

module.exports = APIFeatures;
