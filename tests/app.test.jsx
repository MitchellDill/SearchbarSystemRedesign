import React from "react";
import renderer from "react-test-renderer";
import App from "../client/App";

it.skip("coninues to render App correctly", () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});
