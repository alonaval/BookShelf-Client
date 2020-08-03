import React from 'react'
import { FlatList, View, Image, TouchableHighlight, ScrollView, TouchableOpacity } from 'react-native'
import Book from './../Book'
import styles from './styles'
import { SearchBar, Divider } from 'react-native-elements'
import MenuImage from '../../src/components/MenuImage/MenuImage'
import ChatIcon from '../../src/components/ChatIcon/ChatIcon'
import ProfileIcon from '../../src/components/ProfileIcon/ProfileIcon'
import EvilIconsIcon from 'react-native-vector-icons/EvilIcons'
import AsyncStorage from '@react-native-community/async-storage'
import AwesomeAlert from 'react-native-awesome-alerts'
import { showMessage } from 'react-native-flash-message'

export default class SearchScreen extends React.Component {
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
      value: '',
      data: [],
      book: '',
      Book: '',
      id: '',
      isVisible: false,
      search: '',
      showAlert: false,
      userPoints: ''
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    navigation.setParams({
      handleSearch: this.handleSearch,
      data: this.getValue
    })

  }
  async componentDidMount() {
    let userId = await AsyncStorage.getItem('userId')
    let userPoints = await AsyncStorage.getItem('userPoints')
    this.setState({
      id: userId, userPoints: userPoints
    })
  }
  handleSearch = search => {
    this.setState({ search })
    var url = new URL(
      'https://www.googleapis.com/books/v1/volumes?q=intitle:' + search
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
                picture: response.items[i].volumeInfo.imageLinks.thumbnail
              }
            } catch {
              i++
            }
            if (Book == undefined) {
                         return
            }

            Books.push({ Book })
          }
          if (search == '') {
            this.setState({
              books: []
            })
          } else {
            this.setState({ books: Books })
          }
        },
        error => {
          console.log('err get=', error)
        }
      )
  }

  AddBookToDB = Book => {
    var points
    if (Book.average_rating < 3.64) {
      points = 10
    } else if (Book.average_rating >= 3.64 && Book.average_rating < 4.25) {
      points = 15
    } else if (Book.average_rating >= 4.25 && Book.average_rating < 5) {
      points = 20
    } else {
      points = 5
    }
    Book.points = points

    if (Book.description.includes("'")) {
      Book.description = Book.description.replace(/'/g, '’')
    }
    if (Book.author.includes("'")) {
      Book.author = Book.author.replace(/'/g, '’')
    }
    if (Book.genre.includes("'")) {
      Book.genre = Book.genre.replace(/'/g, '’')
    }
    if (Book.title.includes("'")) {
      Book.title = Book.title.replace(/'/g, '’')
    }

    fetch('http://proj.ruppin.ac.il/bgroup2/prod/api/Book', {
      method: 'POST',
      body: JSON.stringify(Book),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
      })
    })
      .then(res => {
        return res.json()
      })
      .then(
        result => {
          this.UserLibraryGetFetch(this.state.id, result, Book.isbn, Book.title)
        },
        error => {
          console.log('err post=', error)
        }
      )
  }

  getValue = () => {
    return this.state.books
  }

  onPressBook = item => {
    this.setState({ book: item.Book })
    this.setState({ isVisible: true })
  }

  temp = ({ item }) => {
    if (item.Book != undefined) {
      return (
        <View>
          <TouchableHighlight
            underlayColor='rgba(73,182,77,1,0.9)'
            onPress={() => this.onPressBook(item)}
          >
            <View style={styles.container}>
              <TouchableOpacity>
                <EvilIconsIcon
                  style={styles.leftIcon2}
                  name='plus'
                  onPress={() => this.showAlert(item.Book)}
                ></EvilIconsIcon>
              </TouchableOpacity>
              <Image style={styles.photo} source={{ uri: item.Book.picture }} />
            </View>
          </TouchableHighlight>
          <Divider style={styles.divider} />
        </View>
      )
    }
  }

  AddBookToLibrary = (bookID, userID, isbn, title) => {
    fetch(
      `http://proj.ruppin.ac.il/bgroup2/prod/api/Library?userID=${userID}&bookID=${bookID}&isbn=${isbn}`,
      {
        method: 'PUT',
        headers: new Headers({
          'Content-type': 'application/json; charset=UTF-8'
        })
      }
    )
      .then(res => {
        return res.json()
      })
      .then(
        response => {
          showMessage({
            message: 'ספר התווסף לספריה',
            type: 'info',
            duration: 1500,
            icon: 'auto'
          })
          let points = parseInt(this.state.userPoints) + 20;
          AsyncStorage.setItem('userPoints', points.toString())
          for (var i = 0; i < Object.keys(response).length; i++) {
            this.btnPushFromClient(response[i].Token, title)
          }

        },
        error => {
         
        }
      )
  }

  btnPushFromClient = (token, title) => {
    let per = {
      to: token,
      title: 'התרעה חדשה',
      body: ' ספר' + title + 'זמין להשאלה ',
      badge: 1,
      data: { name: 'cute name' }
    }

    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      body: JSON.stringify(per),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
  }

  UserLibraryGetFetch = (id, bookID, isbn, title) => {
    fetch(`http://proj.ruppin.ac.il/bgroup2/prod/api/Library?userID=${id}`, {
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
          var exists = false
          for (var i = 0; i < Object.keys(response).length; i++) {
            if (response[i].Bookid == bookID) {
              exists = true
            }
          }
          if (exists == false) {
            this.AddBookToLibrary(bookID, id, isbn, title)
          } else {

            showMessage({
              message: 'הספר כבר נמצא בספריה',
              type: 'warning',
              duration: 1500,
              icon: 'auto'
            })
          }
        },
        error => {
              }
      )
  }

  toggleValue = () => {
    this.setState({ isVisible: !this.state.isVisible })
  }


  showAlert = item => {
    this.setState({
      showAlert: true,
      Book: item
    })
  }

  hideAlert = () => {
    this.setState({
      showAlert: false
    })
  }

  render() {
    const { search } = this.state
    const { showAlert } = this.state
    return this.state.isVisible ? (
      <Book
        book={this.state.book}
        toggleValue={this.toggleValue}
        navigation={this.props.navigation}
      />
    ) : !showAlert ? (
      <View>


        <SearchBar
          containerStyle={{
            backgroundColor: 'transparent',
            borderBottomColor: 'transparent',
            borderTopColor: 'transparent',
            flex: 1,
            marginBottom: 20
          }}
          inputContainerStyle={{
            backgroundColor: '#EDEDED'
          }}
          inputStyle={{
            backgroundColor: '#EDEDED',
            borderRadius: 10,
            color: 'black'
          }}
          searchIcond
          lightTheme
          round
          onChangeText={this.handleSearch}
          placeholder='שם הספר..'
          value={search}
        />

        <ScrollView style={styles.scrollview}>
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={this.state.books}
            renderItem={this.temp}
            keyExtractor={item => `${item}`}
          />
        </ScrollView>
      </View>
    ) : (
          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            message='להוסיף את הספר לספריה?'
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText='לא'
            confirmText='כן'
            confirmButtonColor='#5597dd'
            onCancelPressed={() => {
              this.hideAlert()
            }}
            onConfirmPressed={() => {
              this.hideAlert()
              this.AddBookToDB(this.state.Book)
            }}
          />
        )
  }
}
