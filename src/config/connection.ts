import mongoose from "mongoose";

/**
 * This function is used to connect the database
 */
export default (db: string) => {
  const connect = () => {
    mongoose
      .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
          // tslint:disable-next-line:no-console
        return console.log(`Successfully connected to ${db}`);
      })
      .catch(error => {
          // tslint:disable-next-line:no-console
        console.log("Error connecting to database: ", error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on("disconnected", connect);
};