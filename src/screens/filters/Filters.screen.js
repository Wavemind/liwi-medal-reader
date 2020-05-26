import * as React from 'react';
import { ScrollView } from 'react-native';
import { Text, View, Button } from 'native-base';
import * as _ from 'lodash';

import { LiwiTitle2 } from '../../template/layout';
import { liwiColors } from '../../utils/constants';
import { styles } from './Filters.style';
import FilterAccordion from '../../components/FilterAccordion';
import { getItems } from '../../engine/api/LocalStorage';
import { categories } from '../../../frontend_service/constants';

export default class Filter extends React.Component<Props, State> {
  state = {
    filterableNodes: [],
  };

  async componentDidMount() {
    const { navigation } = this.props;

    const model = navigation.getParam('model');
    const algorithm = await getItems('algorithm');

    const filterableNodes = _.filter(algorithm.nodes, { category: categories.demographic });

    this.setState({ model, filterableNodes });
  }

  render() {
    const { navigation } = this.props;
    const { model, filterableNodes } = this.state;

    return (
      <View padding-auto style={{ flex: 1, marginTop: 50 }}>
        <ScrollView>
          <LiwiTitle2 noBorder>Filters</LiwiTitle2>

          {model === 'MedicalCase' ? (
            <FilterAccordion title="Status" />
          ) : (
            filterableNodes.map(node => (
              <FilterAccordion key={node.id} node={node} />
              ))
          )}
        </ScrollView>

        <View flex-container-row style={{ bottom: 0, left: 0, right: 0, height: 100, position: 'absolute' }}>
          <View w50>
            <Button
              style={{
                left: 0,
                paddingLeft: 0,
                marginLeft: 0,
                width: '95%',
                height: '100%',
                borderRight: 5,
                borderRightColor: liwiColors.darkerGreyColor,
              }}
            >
              <Text size-auto center>
                Clear all
              </Text>
            </Button>
          </View>
          <View w50>
            <Button style={{ width: '100%', height: '100%', marginLeft: 0 }} onPress={() => navigation.goBack()}>
              <Text size-auto center>
                Apply
              </Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
