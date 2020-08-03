import React from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  TouchableScale
} from 'react-native'
import {
  ListItem
} from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'
import MenuImage from '../src/components/MenuImage/MenuImage'
import AsyncStorage from '@react-native-community/async-storage'
import ChatIcon from '../src/components/ChatIcon/ChatIcon'
import ProfileIcon from '../src/components/ProfileIcon/ProfileIcon'

export default class WaitingBooks extends React.Component {
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
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this)
    this.state = {
      id: '',
      isVisible: false,
      books: [],
      showAlert: false,
      bookId: ''
    }
  }

  async componentDidMount() {
    let userId = await AsyncStorage.getItem('userId')
    this.setState({
      id: userId
    })
    this.UserBooksGetFetch(userId)
  }

  forceUpdateHandler() {
    this.forceUpdate()
  }
  DeleteBook = id => {
    console.log("id:", id);
    fetch(
      `http://proj.ruppin.ac.il/bgroup2/prod/api/WaitingBooks?userId=${this.state.id}&bookId=${id}`,
      {
        method: 'DELETE',
        headers: new Headers({
          'Content-type': 'application/json; charset=UTF-8'
        })
      }
    )
      .then(res => {

      })
      .then(
        response => {

          this.UserBooksGetFetch(this.state.id)
        },
        error => {
          console.log("err get=", error);
        }
      )
    return
  }

  UserBooksGetFetch = id => {
    fetch(
      `http://proj.ruppin.ac.il/bgroup2/prod/api/WaitingBooks?userId=${id}`,
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
          var count = Object.keys(response).length
          let books = []
          for (var i = 0; i < count; i++) {
            books.push({
              title: response[i].Title,
              isbn: response[i].Isbn,
              author: response[i].Author,
              description: response[i].Description,
              picture: response[i].Picture,
              id: response[i].Bookid
            })
          }
          this.setState({ books: books })
        },
        error => {
        }
      )
    return
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

    return (

      <ScrollView>
        <View>
          {this.state.books.map((l, i) => (
            <ListItem
              Component={TouchableScale}
              friction={90}
              tension={100}
              activeScale={0.95}
              key={l.id}
              rightTitle={
                <View><Text style={styles.title}>{l.title}</Text>
                  <Text style={styles.subtitleView}>{l.author}</Text>
                  <TouchableOpacity><Text style={styles.title1} onPress={() => this.DeleteBook(l.id)}> להסיר</Text></TouchableOpacity></View>}

              subtitle={
                <View>
                  <Image style={styles.photo} source={{ uri: l.picture }} />

                </View>
              }
              bottomDivider
            />
          ))}
        </View>
      </ScrollView>
    )
  }
}



const styles = StyleSheet.create({

  photo: {
    width: 150,
    height: 240
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#444444',
    marginTop: 3,
    marginRight: 5,
    marginLeft: 5,
    textDecorationLine: 'underline'
  },
  title1: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#444444',
    marginTop: 153,
    marginRight: 5,
    marginLeft: 5,
    textDecorationLine: 'underline'
  },
})
