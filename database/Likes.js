const { client } = require('./connect');
const Movies = require('./Movies');
const {
  MovieNotFoundError,
  AlreadyExistsError,
  LikeNotFoundError,
} = require('./error/index');

const transactionOptions = {
  readPreference: 'primary',
  readConcern: { level: 'local' },
  writeConcern: { w: 'majority' },
};

class Likes {
  constructor(DB, COLLECTION) {
    this.client = client.db(DB).collection(COLLECTION);
    this.#setup();
  }

  async #setup() {
    await this.client.createIndex(
      { user_id: 1, movie_id: 1 },
      { unique: true, sparse: true }
    );
  }

  async likeMovie(user, movie) {
    const session = client.startSession();
    session.startTransaction(transactionOptions);

    // objects
    const LikeObject = [
      { user_id: user, movie_id: movie, date: Date.now() },
      { session },
    ];

    const MovieObject = [
      { _id: movie },
      { $inc: { likes: 1 } },
      { returnDocument: 'after', session },
    ];

    try {
      await this.client.insertOne(...LikeObject);

      const { value } = await Movies.findOneAndUpdate(...MovieObject);
      if (!value) throw new MovieNotFoundError();

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();

      if (error.code === 11000) throw new AlreadyExistsError();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async unlikeMovie(user, movie) {
    const session = client.startSession();
    session.startTransaction(transactionOptions);

    // objects
    const LikeObject = [{ movie_id: movie, user_id: user }, { session }];

    const MovieObject = [
      { _id: movie, likes: { $gt: 0 } },
      { $inc: { likes: -1 } },
      { returnDocument: 'after', session },
    ];

    try {
      let { value: res1 } = await this.client.findOneAndDelete(...LikeObject);
      if (!res1) throw new LikeNotFoundError();

      let { value: res2 } = await Movies.findOneAndUpdate(...MovieObject);
      if (!res2) throw new MovieNotFoundError();

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}

module.exports = new Likes(process.env.MONGO_DB, 'likes');
