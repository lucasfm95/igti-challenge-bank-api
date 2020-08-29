import express from "express";
import { db } from "./models/database.js";
import router from "./routes/accountsRouter.js"

const app = express();

app.use(express.json());
app.use("/accounts", router);

app.listen("7000", () => {
    console.log("API started");
});

(async () => {
    try {
        await db.mongoose.connect(db.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log(`Error to conect MongoDB. Error: ${error}`);
    }
})();
