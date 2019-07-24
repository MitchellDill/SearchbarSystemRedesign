import React from "react";
import App from "../client/App.js";
import renderer from "react-test-renderer";

it("coninues to render App correctly", () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});
