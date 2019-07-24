import React from 'react';
import Table2 from '../client/table2.js';
import renderer from 'react-test-renderer';

it('continues to render Table2 component correctly', () => {
    const tree = renderer
      .create(<Table2 />)
      .toJSON();
    expect(tree).toMatchSnapshot();
});