class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    let queryParams = { ...this.queryString };
    // if (queryParams.firstName) {
    //   this.query = this.query.where('firstName', new RegExp(queryParams.firstName, 'i'));
    // }
    // if (queryParams.lastName) {
    //   this.query = this.query.where('lastName', new RegExp(queryParams.lastName, 'i'));
    // }
    if (queryParams.email) {
      this.query.where('email', new RegExp(queryParams.email, 'i'));
    }
    if (queryParams.name) {
      // search by the space seprated string with first name and last name
      const words = queryParams.name.trim().split(/\s+/);
      const conditions = words.map((word) => ({
        $or: [
          // includes search
          // { firstName: new RegExp(word, 'i') },
          // { lastName: new RegExp(word, 'i') },
          // exact search
          { firstName: new RegExp(`^${word}$`, 'i') },
          { lastName: new RegExp(`^${word}$`, 'i') },
        ],
      }));
      this.query.find({ $and: conditions });
    }
    if (queryParams.search) {
      const searchTerm = queryParams.search.trim();
      const searchRegex = new RegExp(searchTerm, 'i');
      this.query.find({
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
          { panNumber: searchRegex },
        ],
      });
    }
    if (queryParams.pan) {
      this.query.find({
        panNumber: new RegExp(queryParams.pan, 'i'),
      });
      // const conditions = {
      //   $or: [
      //     { panNumber: queryParams.pan.toLowerCase() },
      //     { panNumber: queryParams.pan.toUpperCase() },
      //   ],
      // };
      // query = query.find(conditions);
      // query = query.where('panNumber', queryParams.name);
    }

    // return this so methods can be chained
    return this;
  }
  sort() {
    let queryParams = { ...this.queryString };
    if (queryParams?.sort) {
      const sortFields = queryParams.sort
        .split(',')
        .map((field) => {
          const [key, order] = field.split(':');
          return order === 'desc' ? `-${key}` : key;
        })
        .join(' ');
      this.query.sort(sortFields);
    }

    return this;
  }
  limitFields() {
    let queryParams = { ...this.queryString };
    if (queryParams.fields) {
      const fields = queryParams.fields
        .split(',')
        .filter((field) => field.trim() !== 'password');
      this.query.select(fields);
    } else {
      // query = query.select('-image -password');
      this.query.select({ password: 0, image: 0 });
    }

    return this;
  }
  paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);

    return this;
  }

  // getTotalCount() {
  //   return this.query.countDocuments();
  // }
}

module.exports = APIfeatures;
