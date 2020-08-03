import React from 'react'
import { FlatList, View, TouchableHighlight, Image, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import styles from './styles'
import MenuImage from '../../src/components/MenuImage/MenuImage'
import ChatIcon from '../../src/components/ChatIcon/ChatIcon'
import { genres } from '../../src/data/dataArrays'
import RandomWords from 'random-words'
import Book from './../Book'
import AsyncStorage from '@react-native-community/async-storage'
import { Notifications } from 'expo'
import registerForPushNotificationsAsync from '../../registerForPushNotificationsAsync'
import ProfileIcon from '../../src/components/ProfileIcon/ProfileIcon'
import { ListItem, Divider } from 'react-native-elements'
import { Title } from 'react-native-paper'


export default class HomeScreen extends React.Component {
  async componentDidMount() {
    let userId = await AsyncStorage.getItem('userId')
    let user = JSON.parse(await AsyncStorage.getItem('user'))

    this.setState({
      id: userId,
      user: user,
      UserGenres: user.PreferedGenres.split(',')
    }),
      this.fetchFuncs()

    registerForPushNotificationsAsync().then(token => {

      this.setState({ token }), this.FetchPostToken(token)
    })

    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    )
  }

  _handleNotification = notification => {
    this.setState({ notification: notification })
  }

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
            navigation.navigate('MyChats')
            navigation.closeDrawer()
          }}
        />
        <ProfileIcon
          onPress={() => {
            navigation.navigate('Profile')
            navigation.closeDrawer()
          }}
        />
      </View>
    )
  })

  constructor(props) {
    super(props)
    this.state = {
      book: '',
      id: '',
      isVisible: false,
      notification: {},
      refreshing: false
    }
  }

  FetchPostToken = token => {
    fetch(
      'http://proj.ruppin.ac.il/bgroup2/prod/api/User?userId=' +
      this.state.id +
      '&token=' +
      token,
      {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      }
    )
  }

  FetchBooks = () => {
    this.setState({ refreshing: true })
    var url = new URL(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:` +
      "'" +
      RandomWords() +
      "'"
    )

    fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
      })
    })
      .then(res => {
        return res.json()
      })
      .then(
        response => {
          var Books = []
          var count = 10
          for (var i = 0; i < count; i++) {
            let imageTemp = response.items[
              i
            ].volumeInfo.imageLinks.thumbnail.split('zoom=1')
            let newImage = '' + imageTemp[0] + 'zoom=2' + imageTemp[1] + ''

            try {
              var Book = {
                title: response.items[i].volumeInfo.title,
                isbn: Number(
                  response.items[i].volumeInfo.industryIdentifiers[1].identifier
                ),
                author: response.items[i].volumeInfo.authors[0],
                average_rating: response.items[i].volumeInfo.averageRating,
                description: response.items[i].volumeInfo.description,
                genre: response.items[i].volumeInfo.categories[0],
                picture: newImage
              }
            } catch {
              continue
            }
            if (Book == undefined) {
              i++
            }
            Books.push({ Book })
          }

          this.setState({ books: Books, refreshing: false })
        },
        error => {

        }
      )
  }

  FetchBooksByGenre = () => {
    var rand = Math.floor(Math.random() * this.state.UserGenres.length) + 1
    var url = new URL(
      'https://www.googleapis.com/books/v1/volumes?q=subject:' +
      this.state.UserGenres[rand]
    )

    fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
      })
    })
      .then(res => {
        return res.json()
      })
      .then(
        response => {
          var Books = []
          var count = 10

          for (var i = 0; i < count; i++) {
            let imageTemp = response.items[i].volumeInfo.imageLinks.thumbnail.split('zoom=1')
            let newImage = '' + imageTemp[0] + 'zoom=2' + imageTemp[1] + ''

            try {
              var Book = {
                title: response.items[i].volumeInfo.title,
                isbn: Number(
                  response.items[i].volumeInfo.industryIdentifiers[1].identifier
                ),
                author: response.items[i].volumeInfo.authors[0],
                average_rating: response.items[i].volumeInfo.averageRating,
                description: response.items[i].volumeInfo.description,
                genre: response.items[i].volumeInfo.categories[0],
                picture: newImage
              }
            } catch {
              continue
            }
            if (Book == undefined) {
              i++
            }
            Books.push({ Book })
          }

          this.setState({ booksGenre: Books })
        },
        error => {
        }
      )
  }

  toggleValue = () => {
    this.setState({ isVisible: !this.state.isVisible })
  }
  onPressGenre = item => {
    const title = item.name
    const genre = item
    this.props.navigation.navigate('GenresList', { genre, title })
  }

  ShowBookInfo = book => {
    this.setState({ book: book })
    this.setState({ value: true })
  }

  temp = ({ item }) => {
    if (item.Book == undefined) {
      return
    } else {
      return (
        <TouchableHighlight
          style={styles.item}
          onPress={() => this.onPressBook(item)}
        >
          <View style={styles.container}>
            <Image style={styles.photo} source={{ uri: item.Book.picture }} />
          </View>
        </TouchableHighlight>
      )
    }
  }
  onPressBook = item => {
    this.setState({ book: item.Book })
    this.setState({ isVisible: true })
  }

  fetchFuncs = () => {
    this.FetchBooks()
    this.FetchBooksByGenre()
  }

  render() {
    return this.state.isVisible == true ? (
      <Book
        book={this.state.book}
        toggleValue={this.toggleValue}
        navigation={this.props.navigation}
      />
    ) : (
        <View style={styles.background}>
          <View>
            <ScrollView
              style={styles.scrollview}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.fetchFuncs}
                />
              }
            >

              <Title style={styles.title}>זאנרים מומלצים</Title>
              <FlatList
                numColumns={2}
                data={genres}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.genresContainer}
                    onPress={() => this.onPressGenre(item)}
                  >
                    <ListItem
                      containerStyle={styles.genresContainer}
                      contentContainerStyle={styles.genresItem}
                      title={item.title}
                      rightAvatar={{
                        rounded: true,
                        source: { uri: item.photo_url },
                      }}
                      bottomDivider
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={item => `${item.id}`}
              ></FlatList>
              <Divider style={styles.divider} />

              <Title style={styles.title}>במיוחד בשבילך</Title>
              <FlatList
                showsVerticalScrollIndicator={false}
                horizontal={true}
                data={this.state.booksGenre}
                renderItem={this.temp}
                keyExtractor={item => `${item.Book.picture}`}
              />
              <Divider style={styles.divider} />
              <Title style={styles.title}>אולי יעניין אותך גם</Title>
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={this.state.books}
                renderItem={this.temp}
                keyExtractor={item => `${item.Book.picture}`}
              />
            </ScrollView>
          </View>
        </View>
      )
  }
}
