const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('mongoDB connected');
        return;
    } catch (err) {
        console.error('error while connecting to the database');
        console.log(err.message);
        process.exit(1);
    }


}
module.exports = connectDB;