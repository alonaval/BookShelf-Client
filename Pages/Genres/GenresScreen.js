import React from 'react';
import {
  FlatList, View, Image, TouchableHighlight, StyleSheet,
} from 'react-native';
import styles from './styles';
import { genres } from '../../src/data/dataArrays';
import MenuImage from '../../src/components/MenuImage/MenuImage';
import ChatIcon from '../../src/components/ChatIcon/ChatIcon'
import ProfileIcon from '../../src/components/ProfileIcon/ProfileIcon'
import { ScrollView } from 'react-native-gesture-handler';


export default class GenresScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerRight: (
        <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
          <MenuImage
            onPress={() => {
              navigation.openDrawer()
            }}
          />
          <ChatIcon
            onPress={() => {
              navigation.navigate('MyChats');
              navigation.closeDrawer();
            }}
          />
          <ProfileIcon
            onPress={() => {
              navigation.navigate('Profile')
              navigation.closeDrawer()
            }}
          />
        </View>
      ),
    }
  }

  static navigationOptions = {
    title: 'Genres'
  };

  constructor(props) {
    super(props);
  }

  onPressGenre = item => {
    const title = item.name;
    const genre = item;
    this.props.navigation.navigate('GenresList', { genre, title });
  };

  renderGenre = ({ item }) => (

    <TouchableHighlight underlayColor='rgba(73,182,77,1,0.9)' onPress={() => this.onPressGenre(item)}>
      <View style={design.container}>
        <Image style={styles.genresPhoto} source={{ uri: item.photo_url }} />

      </View>
    </TouchableHighlight>
  );

  render() {
    return (
      <View style={styles.mainContainer} >
        <ScrollView style={styles.scrollview}>
          <FlatList
            vertical
            numColumns={2}
            data={genres}
            renderItem={this.renderGenre}
            keyExtractor={item => `${item.id}`}
          />
        </ScrollView>
      </View>
    );
  }
}

const design = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
    marginHorizontal: 4,
    borderRadius: 7,
  },

});