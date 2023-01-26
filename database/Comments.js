const { text } = require('body-parser');
const { client } = require('./connect');
const {
  MovieNotFoundError,
  AlreadyExistsError,
  CommentNotFoundError,
} = require('./error');
const Movies = require('./Movies');

const transactionOptions = {
  readPreference: 'primary',
  readConcern: { level: 'local' },
  writeConcern: { w: 'majority' },
};

class Comments {
  constructor(DB, COLLECTION) {
    this.client = client.db(DB).collection(COLLECTION);
    this.#setup();
  }

  async #setup() {
    await this.client.createIndex(
      { email: 1, movie_id: 1 },
      { unique: true, sparse: true }
    );
  }

  async postComment(movie, name, email, text) {
    const session = client.startSession();
    session.startTransaction(transactionOptions);

    // objects
    const CommentObject = [
      {
        name,
        email,
        movie_id: movie,
        text,
        date: Date.now(),
      },
      { session },
    ];

    const MovieObject = [
      { _id: movie },
      { $inc: { comments: 1 } },
      { returnDocument: 'after' },
    ];

    try {
      await this.client.insertOne(...CommentObject);

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

  async deleteComment(email, movie) {
    const session = client.startSession();
    session.startTransaction(transactionOptions);

    // objects
    const CommentObjects = [{ email, movie_id: movie }, { session }];

    const MovieObjects = [
      { _id: movie, comments: { $gt: 0 } },
      { $inc: { comments: -1 } },
      { returnDocument: 'after', session },
    ];

    try {
      const { value: rs1 } = await this.client.findOneAndDelete(
        ...CommentObjects
      );
      console.log(rs1);
      if (!rs1) throw new CommentNotFoundError();

      const { value: rs2 } = await Movies.findOneAndUpdate(...MovieObjects);
      if (!rs2) throw new MovieNotFoundError();

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}

module.exports = new Comments(process.env.MONGO_DB, 'comments');
