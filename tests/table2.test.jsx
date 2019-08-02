import React from "react";
import renderer from "react-test-renderer";
import Table2 from "../client/table2";

it.skip("continues to render Table2 component correctly", () => {
  const tree = renderer.create(<Table2 />).toJSON();
  expect(tree).toMatchSnapshot();
});
