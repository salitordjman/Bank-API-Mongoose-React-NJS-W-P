const mongoose = require("mongoose");
const keys = require("../config/keys");
mongoose.connect(
  process.env.MONGO_URL ||
    `mongodb+srv://salitor:${keys.password}@salitur.xfafu.mongodb.net/saliproject?retryWrites=true&w=majority`,
  {}
);
// mongoose.connect(
//   `mongodb+srv://salitor:${keys.password}@salitur.xfafu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
//   {}
// );
// mongoose.connect("mongodb://127.0.0.1:27017/bank-api-mongoose-react-w-p", {
//   useNewUrlParser: true,
// });
