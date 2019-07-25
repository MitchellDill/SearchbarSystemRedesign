const path = require("path");

const SRC_DIR = path.join(__dirname, "/client");
const DIST_DIR = path.join(__dirname, "/dist");

module.exports = {
  entry: `${SRC_DIR}/index.js`,
  output: {
    filename: "bundle.js",
    path: DIST_DIR
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },

      {
        test: /\.js?/,
        include: SRC_DIR,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
};
