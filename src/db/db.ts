import { MongoClient } from "mongodb";

export let db: any;

export const connectDB = async (): Promise<void> => {
  try {
    const client = await MongoClient.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.sr44a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    db = client.db();
    console.log("We are connected to DB");
  } catch (err) {
    console.log(`Something went wrong. Connection to DB lost. Error: ${err}`);
  }
};
