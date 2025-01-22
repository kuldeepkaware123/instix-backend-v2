import mongoose from "mongoose";

const ConnectDb = async (MONGO_URL) => {
  try {
    await mongoose.connect(MONGO_URL);

    console.log("Connected to the database successfully !");
  } catch (error) {
    console.log(error, "Error while connecting to the database");
  }
};

export default ConnectDb;
