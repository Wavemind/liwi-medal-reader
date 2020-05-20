import React, { Component } from 'react';
import { Text } from 'native-base';
import { Collapse, CollapseBody, CollapseHeader } from 'accordion-collapse-react-native';
import { styles } from './FilterAccordion.style';

export default class FilterAccordion extends Component {
  static defaultProps = {
    title: 'Add a title',
    content: [
      {
        label: 'A small checkbox',
      },
      {
        label: 'A second checkbox',
      },
    ],
  };

  render() {
    const { title, content } = this.props;

    return (
      <Collapse>
        <CollapseHeader style={styles.filterButton}>
          <Text white>{title}</Text>
        </CollapseHeader>
        <CollapseBody style={styles.content}>
          {Object.keys(content).map((key) => (
            <Text>{content[key].label}</Text>
          ))}
        </CollapseBody>
      </Collapse>
    );
  }
}
