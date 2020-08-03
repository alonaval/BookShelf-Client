import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, TouchableHighlight,TouchableOpacity, ScrollView } from 'react-native'
import { Avatar } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'
import EvilIconsIcon from 'react-native-vector-icons/EvilIcons'
import AwesomeAlert from 'react-native-awesome-alerts'
import MenuImage from '../src/components/MenuImage/MenuImage'
import ChatIcon from '../src/components/ChatIcon/ChatIcon'
import ProfileIcon from '../src/components/ProfileIcon/ProfileIcon'
import { showMessage } from 'react-native-flash-message'

export default class ModalTester extends Component {
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
      id: '',
      BookIsbn: this.props.navigation.state.params.Book.isbn,
      Book: this.props.navigation.state.params.Book,
      Users: [],
      lockedBooks: [],
      value: false,
      lockedValue: false,
      showAlert: false
    }
  }

  async componentDidMount() {
    let userId = await AsyncStorage.getItem('userId')
    this.setState({
      id: userId
    })
    this.FetchGetUsers()
  }

  FetchGetUsers = () => {
    fetch(
      'http://proj.ruppin.ac.il/bgroup2/prod/api/BookSearch?BookIsbn=' +
      this.state.BookIsbn,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      }
    )
      .then(res => {
        return res.json()
      })
      .then(
        response => {
          if (response.length == 0) {
            this.showAlert()
            return
          }
          var Users = []
          var count = Object.keys(response).length
          for (var i = 0; i < count; i++) {
            if (response[i].UserID == this.state.id && count == 1) {
              this.showAlert()
              return
            }
            response[i].UserID == this.state.id ? i++ : i
            var User = {
              Fullname: '',
              City: '',
              UserId: '',
              avatar_url: ''
            }

            if (response[i].Gender == 'female') {
              User.avatar_url = 'https://lh4.googleusercontent.com/proxy/fCo5VE7viMfU0FiMnyGAWIAJns7Wjr5HoShMxmiideSHtZkW95Py-uWHzDVFRPG7WrBSXB2KbqUkTA305SPfMvr6PGYb_I-99hOjaL1iVaqu';
            } else if ((response[i].Gender == 'male')) {
              User.avatar_url = 'https://galileoenrichment.com/wp-content/uploads/2020/03/man.png';
            }

            Users.push({
              Fullname: response[i].Fullname,
              UserId: response[i].UserID,
              City: response[i].City,
              avatar_url: User.avatar_url
            })

            if (i != count - 1) {
              this.UserLockedBookGetFetch(response[i].UserID)
            } else {
              this.UserLockedBookGetFetch(response[i].UserID, Users)
            }
          }
        },
        error => {
        }
      )
  }

  addToList = bookId => {
    fetch(
      `http://proj.ruppin.ac.il/bgroup2/prod/api/WaitingBooks?userId=${this.state.id}&bookId=${bookId}`,
      {
        method: 'POST',
        headers: new Headers({
          'Content-type': 'application/json; charset=UTF-8'
        })
      }
    )
    return
  }
  AddBookToDB = () => {

    let Book = this.state.Book
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
          this.addToList(result)
        },
        error => {

        }
      )
  }
  UserLockedBookGetFetch(id, Users) {
    fetch(
      `http://proj.ruppin.ac.il/bgroup2/prod/api/BookStatus?userID=${id}&bookIsbn=${this.state.BookIsbn}`,
      {
        method: 'GET',
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
          var joined = this.state.lockedBooks.concat(id)
          if (response) {
            this.setState({ lockedBooks: joined })
          }

          if (Users != undefined) {
            this.setState({
              Users: Users
            })
          }
        },
        error => {
        }
      )
    return
  }

  showAlert = () => {
    this.setState({
      showAlert: true
    })
  }
  hideAlert = () => {
    this.setState({
      showAlert: false
    })
  }
  Temp = item => {
    return (
      <Text>
        {item.City} <br />
        {item.Fullname}
      </Text>
    )
  }

  RenderBook = item => {
    return !this.state.lockedBooks.includes(item.item.UserId) ? (
      <TouchableHighlight underlayColor='rgba(73,182,77,1,0.9)'>
        <View style={styles.container}>
          <Avatar

            rounded
            size="medium"
            source={{
              uri: item.item.avatar_url
            }}
          />
          <Text style={styles.title}>{item.item.Fullname}</Text>
          <Text style={styles.category}>{item.item.City}</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity>
              <EvilIconsIcon
                name='envelope'
                style={styles.leftIcon2}
                onPress={() =>
                  this.props.navigation.navigate('chat1', {
                    id: item.item.UserId,
                    Gender: item.item.Gender,
                    Fullname: item.item.Fullname
                  })
                }
              ></EvilIconsIcon>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableHighlight>
    ) : (
        <TouchableHighlight underlayColor='rgba(73,182,77,1,0.9)'>
          <View style={styles.container}>
            <View style={{ opacity: 0.2 }}>
              <Avatar
                rounded
                size="medium"
                source={{
                  uri: item.item.avatar_url
                }}
              />
            </View>
            <Text style={styles.title}>{item.item.Fullname}</Text>
            <Text style={styles.category}>{item.item.City}</Text>
            <Text style={styles.title}>הספר לא זמין כרגע</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity>
                <EvilIconsIcon
                  name='envelope'
                  style={styles.leftIcon2}
                  onPress={() =>
                    this.props.navigation.navigate('Chat', {
                      id: item.item.UserId,
                      Gender: item.item.Gender,
                      Fullname: item.item.Fullname
                    })
                  }
                ></EvilIconsIcon>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableHighlight>
      )
  }
  render() {
    const { showAlert } = this.state

    return this.state.Users.length != 0 ? (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.scrollview}>
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            numColumns={1}
            data={this.state.Users}
            renderItem={this.RenderBook}
            keyExtractor={item => `${item.UserId}`}
          />
        </ScrollView>
      </View>
    ) : (
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          message='הספר לא קיים להשאלה עדיין'
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText='סגור'
          confirmText='תעדכנו אותי כשיהיה'
          confirmButtonColor='#5597dd'
          onCancelPressed={() => {
            this.hideAlert()
            this.props.navigation.navigate('Home')
          }}
          onConfirmPressed={() => {
            this.hideAlert(),
              this.AddBookToDB()
            {
              showMessage({
                message: 'הספר התווסף ל"ספרים בהמתנה"',
                type: "success",
                duration: 2500,
              })
            }
            this.props.navigation.navigate('Home')
          }}

        />
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderColor: '#cccccc',
    borderWidth: 0.5,
    borderRadius: 15
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#444444',
    marginTop: 3,
    marginRight: 5,
    marginLeft: 5
  },
  category: {
    marginTop: 5,
    marginBottom: 5
  },

  leftIcon2: {
    backgroundColor: 'transparent',
    color: '#000000',
    fontSize: 35,
    height: 40,
    width: 39
  },
  scrollview: {
    height: 600
  },
})
