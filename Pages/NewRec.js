import React from 'react'
import { StyleSheet, View, TextInput, Text, Dimensions } from 'react-native'
import MenuImage from '../src/components/MenuImage/MenuImage'
import { Rating } from 'react-native-recommendation'
import ChatIcon from '../src/components/ChatIcon/ChatIcon'
import ProfileIcon from '../src/components/ProfileIcon/ProfileIcon'
import AsyncStorage from '@react-native-community/async-storage'
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick'
import { showMessage } from "react-native-flash-message"

export default class NewRec extends React.Component {
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
      Recs: [''],
      RecId: '',
      UserID: '',
      HeadLine: '',
      Content: '',
      RecDate: '',
      BookName: '',
      Rating: '',
      isVisible: false,
      isModalVisible: false,
      value: false,
      Rec: '',
      valueRec: false,
      userPoints: ''
    }
  }
  async componentDidMount() {
    let userId = await AsyncStorage.getItem('userId')
    let userPoints = await AsyncStorage.getItem('userPoints')

    this.setState({
      id: userId, userPoints: userPoints
    })
  }

  FetchRecommendation = () => {
    var newRecommendation = {
      headline: this.state.HeadLine,
      bookname: this.state.BookName,
      content: this.state.Content,
      userid: this.state.id,
      rating: this.state.Rating
    }
    fetch('http://proj.ruppin.ac.il/bgroup2/prod/api/Recommendation', {
      method: 'POST',
      body: JSON.stringify(newRecommendation),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
      })
    }).then(
      result => {
        if (result) {
          showMessage({
            message: 'ההמלצה נוספה בהצלחה',
            type: "success",
            icon: 'auto',
          });
          let points = parseInt(this.state.userPoints) + 25;
          AsyncStorage.setItem('userPoints', points.toString())
        }
      },
      error => {
      }
    )
  }

  render() {
    return (
      <View style={styles.imageStack}>
        <Text style={styles.newRec}>הוספת המלצה חדשה</Text>
        <Text style={styles.bookName}>שם הספר</Text>
        <TextInput
          style={styles.bookNameinput}
          onChangeText={text => this.setState({ BookName: text })}
          defaultValue=''
        />

        <Text style={styles.headerText}>כותרת</Text>
        <TextInput
          style={styles.headerInput}
          onChangeText={text => this.setState({ HeadLine: text })}
          defaultValue=''
        />
        <Text style={styles.contentText}>תוכן ההמלצה</Text>
        <TextInput
          style={styles.contentInput}
          onChangeText={text => this.setState({ Content: text })}
          defaultValue=''
        />
        <View style={styles.Rating}>
          <Rating
            selectedColor={'gold'}
            max={5}
            currentValue={5}
            selectedValue={value => {
              this.setState({ Rating: value })
            }}
          />
        </View>

        <AwesomeButtonRick
          raiseLevel={3}
          style={styles.btn}
          onPress={this.FetchRecommendation}
          type='primary'
        >
          אישור
        </AwesomeButtonRick>
      </View>
    )
  }
}
const { width, height } = Dimensions.get('window')
const SCREEN_WIDTH = width < height ? width : height
const BOOK_ITEM_HEIGHT = 150
const BOOK_ITEM_MARGIN = 20

const styles = StyleSheet.create({
  Rating: {
    alignSelf: 'center',
    fontWeight: 'bold',
    top: 65,
    marginBottom: 20
  },
  image: {
    top: 0,
    left: 0,
    height: 812,
    position: 'absolute',
    overflow: 'visible',
    right: 0
  },
  image_imageStyle: {
    opacity: 0.6
  },

  newRec: {
    top: 50,
    left: 60,
    width: 252,
    height: 35,
    color: 'rgba(0,0,0,1)',
    position: 'absolute',
    fontSize: 24,
    textAlign: 'right',
    fontWeight: 'bold'
  },
  icon: {
    top: 90,
    left: 321,
    position: 'absolute',
    color: 'rgba(13,12,12,1)'
  },
  bookName: {
    top: 215,
    left: 265,
    width: 90,
    height: 50,
    color: 'rgba(0,0,0,1)',
    position: 'absolute',
    fontSize: 18,
    textAlign: 'right'
  },
  bookNameinput: {
    left: 30,
    width: 245,
    top: 215,
    height: 43,
    backgroundColor: 'rgba(230, 230, 230,0.5)',
    position: 'absolute',
    borderColor: 'black',
    borderRadius: 10
  },
  headerInput: {
    width: 245,
    left: 30,
    height: 43,
    top: 280,
    backgroundColor: 'rgba(230, 230, 230,0.51)',
    position: 'absolute',
    borderRadius: 10
  },
  contentInput: {
    top: 340,
    width: 245,
    left: 30,
    height: 179,
    backgroundColor: 'rgba(230, 230, 230,0.5)',
    position: 'absolute',
    borderRadius: 10
  },

  headerText: {
    top: 280,
    left: 265,
    width: 90,
    height: 43,
    color: 'rgba(0,0,0,1)',
    position: 'absolute',
    fontSize: 18,
    textAlign: 'right'
  },
  contentText: {
    top: 340,
    left: 265,
    width: 90,
    height: 68,
    color: 'rgba(0,0,0,1)',
    position: 'absolute',
    fontSize: 18,
    textAlign: 'right'
  },
  imageStack: {
    height: 812
  },
  btn: {
    marginTop: 440,
    marginLeft: 145
  }
})
