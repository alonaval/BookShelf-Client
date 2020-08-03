import React from 'react';
import { FlatList, Text, View, TouchableHighlight, Image, ScrollView, } from 'react-native';
import styles from './styles';
import Book from "./../Book";
import MenuImage from '../../src/components/MenuImage/MenuImage'
import ChatIcon from '../../src/components/ChatIcon/ChatIcon'
import ProfileIcon from '../../src/components/ProfileIcon/ProfileIcon'

export default class GenresListScreen extends React.Component {
  componentDidMount() { this.FetchGetGenres() }
  static navigationOptions = ({ navigation }) => ({
    title: '',
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
  })


  constructor(props) {
    super(props);
    this.state = {
      title: this.props.navigation.state.params.title,
      book: '',
      id: '',
      isVisible: false,

    }
  }

  FetchGetGenres = () => {
    fetch("https://www.googleapis.com/books/v1/volumes?q=subject:" + this.state.title, {
      method: "GET",
      headers: {
        'Content-type': 'application/json; charset=UTF-8',

      }
    })
      .then(res => {
        return res.json();
      })
      .then(
        (response) => {
          console.log("res=", response)
          var Books = [];
          var count = 10;
          for (var i = 0; i < count; i++) {
            try {

              var Book = {
                title: response.items[i].volumeInfo.title,
                isbn: Number(response.items[i].volumeInfo.industryIdentifiers[1].identifier),
                author: response.items[i].volumeInfo.authors[0],
                average_rating: response.items[i].volumeInfo.averageRating,
                description: response.items[i].volumeInfo.description,
                genre: response.items[i].volumeInfo.categories[0],
                picture: response.items[i].volumeInfo.imageLinks.thumbnail,
              };


            }
            catch{ i++ }
            if (Book == undefined) {
              return;
            }

            Books.push({ Book });

          }

          this.setState({ books: Books });

        },
        (error) => {

        }
      );
  }
  onPressRecipe = item => {
    this.setState({ book: item.Book })
    this.setState({ isVisible: true })
  };

  toggleValue = () => {
    this.setState({ isVisible: !this.state.isVisible });

  };
  temp = ({ item }) => {

    if (item.Book == undefined) {
    }
    else {
      return (<TouchableHighlight underlayColor='rgba(73,182,77,1,0.9)' onPress={() => this.onPressRecipe(item)}>
        <View style={styles.container}>
          <Image style={styles.photo} source={{ uri: item.Book.picture }} />
          <Text style={styles.title}>{item.Book.title}</Text>
        </View>
      </TouchableHighlight>)
    }
  }


  onPressGenre = item => {
    this.props.navigation.navigate('Genre', { item });
  };


  render() {

    const { navigation } = this.props;
    const item = navigation.getParam('Genre');
    return (
      this.state.isVisible == true ? <Book book={this.state.book} toggleValue={this.toggleValue} navigation={this.props.navigation} /> :
        <View style={styles.mainContainer}>
          <ScrollView style={styles.scrollview}>
            <FlatList
              vertical
              showsVerticalScrollIndicator={false}
              numColumns={2}
              data={this.state.books}
              renderItem={this.temp}
              keyExtractor={item => `${item.isbn}`}
            />
          </ScrollView>
        </View>

    );
  }
}

