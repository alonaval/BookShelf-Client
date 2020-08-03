import React from 'react'
import { View, Image, FlatList, Text, TouchableHighlight, TouchableOpacity } from 'react-native'
import { Divider } from 'react-native-elements'
import EvilIconsIcon from 'react-native-vector-icons/EvilIcons'
import { ScrollView } from 'react-native-gesture-handler'
import MenuImage from '../../src/components/MenuImage/MenuImage'
import ChatIcon from '../../src/components/ChatIcon/ChatIcon'
import ProfileIcon from '../../src/components/ProfileIcon/ProfileIcon'
import AsyncStorage from '@react-native-community/async-storage'
import styles from './styles'
import AwesomeAlert from 'react-native-awesome-alerts'
import { showMessage } from 'react-native-flash-message'

export default class Library extends React.Component {
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
      isVisible: false,
      books: [],
      lockedBooks: '',
      showAlert: false,
      bookId: ''
    }
  }

  async componentDidMount() {
    let userId = await AsyncStorage.getItem('userId')
    this.setState({
      id: userId
    })

    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.UserLockedBooksGetFetch(userId)
      this.UserLibraryGetFetch(userId)
    });

  }


  UserLockedBooksGetFetch = id => {
    fetch(`http://proj.ruppin.ac.il/bgroup2/prod/api/BookStatus?userID=${id}`, {
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
          this.setState({ lockedBooks: response })
        },
        error => {

        }
      )
  }

  RenderBook = item => {
    var exists = false
    for (var i = 0; i < this.state.lockedBooks.length; i++) {
      if (this.state.lockedBooks[i] == item.item.Bookid) {
        exists = true
      }
    }
    return exists == false ? (
      <View>
        <TouchableHighlight >
          <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity>
                <EvilIconsIcon
                  name='trash'
                  style={styles.leftIcon2}
                  onPress={() => this.showAlert(item.item.Bookid)}
                ></EvilIconsIcon>
              </TouchableOpacity>
              <TouchableOpacity>
                <EvilIconsIcon
                  name='lock'
                  style={styles.leftIcon2}
                  onPress={() => this.LockBook(item.item.Bookid)}
                ></EvilIconsIcon>
              </TouchableOpacity>
            </View>
            <Image style={styles.photo} source={{ uri: item.item.Picture }} />
          </View>

        </TouchableHighlight>
        <Divider style={styles.divider} />
      </View>
    ) : (
        <View>
          <TouchableHighlight >
            <View style={styles.container}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity>
                  <EvilIconsIcon
                    name='trash'
                    style={styles.leftIcon2}
                    onPress={() => this.showAlert(item.item.Bookid)}
                  ></EvilIconsIcon>
                </TouchableOpacity>
                <TouchableOpacity>
                  <EvilIconsIcon
                    name='unlock'
                    style={styles.leftIcon2}
                    onPress={() => this.unLockBook(item.item.Bookid)}
                  ></EvilIconsIcon>
                </TouchableOpacity>
              </View>
              <Image
                style={styles.lockedphoto}
                source={{ uri: item.item.Picture }}
              />


            </View>
          </TouchableHighlight>
          <Divider style={styles.divider} />
        </View>
      )
  }
  LockBook = Bookid => {
    fetch(
      `http://proj.ruppin.ac.il/bgroup2/prod/api/BookStatus?userID=${this.state.id}&bookID=${Bookid}`,
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
          this.setState({ lockedBooks: response }),
            this.UserLibraryGetFetch(this.state.id)
          showMessage({
            message: 'ספר לא זמין להשאלה',
            type: 'info',
            duration: 1500,
            icon: 'auto'
          })
        },
        error => {
        }
      )
  }
  unLockBook = Bookid => {
    fetch(
      `http://proj.ruppin.ac.il/bgroup2/prod/api/BookStatus?userID=${this.state.id}&bookID=${Bookid}`,
      {
        method: 'DELETE',
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
          this.setState({ lockedBooks: response }),
            this.UserLibraryGetFetch(this.state.id)
          showMessage({
            message: 'ספר זמין להשאלה',
            type: 'info',
            duration: 1500,
            icon: 'auto'
          })
        },
        error => {

        }
      )
  }
  DeleteBook = Bookid => {
    fetch(
      `http://proj.ruppin.ac.il/bgroup2/prod/api/Library?userID=${this.state.id}&bookID=${Bookid}`,
      {
        method: 'DELETE',
        headers: new Headers({
          'Content-type': 'application/json; charset=UTF-8'
        })
      }
    )
      .then(res => {
        return res
      })
      .then(
        result => {
          this.UserLibraryGetFetch(this.state.id)
          showMessage({
            message: 'ספר נמחק מהספריה',
            type: 'info',
            duration: 1500,
            icon: 'auto'
          })
        },
        error => {

        }
      )
  }

  UserLibraryGetFetch = id => {
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
          var count = Object.keys(response).length

          let books = []
          for (var i = 0; i < count; i++) {
            books.push({
              Picture: response[i].Picture,
              Title: response[i].Title,
              Isbn: response[i].Isbn,
              Bookid: response[i].Bookid
            })
          }
          this.setState({ books: books })
        },
        error => {

        }
      )
  }

  showAlert = id => {
    this.setState({
      showAlert: true,
      bookId: id
    })
  }

  hideAlert = () => {
    this.setState({
      showAlert: false
    })
  }

  render() {
    const { showAlert } = this.state
    return showAlert == false ? (
      <View style={styles.mainContainer}>

        <TouchableOpacity><Text style={styles.title} onPress={() => this.props.navigation.navigate('SearchScreen')}> להוסיף ספר חדש</Text></TouchableOpacity>

        <ScrollView style={styles.scrollview}>
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={this.state.books}
            renderItem={this.RenderBook}
            keyExtractor={item => `${item.Isbn}`}
          />
        </ScrollView>
      </View>
    ) : (
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          message='למחוק את הספר מספריה?'
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText='לא'
          confirmText='כן'
          confirmButtonColor='#5597dd'
          onCancelPressed={() => {
            this.hideAlert()
            this.props.navigation.navigate('UserLibrary')
          }}
          onConfirmPressed={() => {
            this.hideAlert()
            this.DeleteBook(this.state.bookId)
          }}
        />
      )
  }
}
