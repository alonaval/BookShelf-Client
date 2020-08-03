import React from 'react'
import { StyleSheet, View, Text, FlatList, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import MenuImage from '../src/components/MenuImage/MenuImage'
import EvilIconsIcon from 'react-native-vector-icons/EvilIcons'
import { Rating } from 'react-native-recommendation'
import EditRec from './EditRec'
import ChatIcon from '../src/components/ChatIcon/ChatIcon'
import ProfileIcon from '../src/components/ProfileIcon/ProfileIcon'
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick'


export default class MyRecommendations extends React.Component {
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
      isVisible: false,
      isModalVisible: false,
      value: false,
      Rec: '',
      valueRec: false
    }
  }

  async componentDidMount() {
    let userId = await AsyncStorage.getItem('userId')

    this.setState({
      id: userId
    })
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.FetchRecs()

    });
    this.FetchRecs()
  }
  FetchRecs = () => {
    fetch(
      'http://proj.ruppin.ac.il/bgroup2/prod/api/Recommendation?UserID=' +
      this.state.id,
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
          var count = Object.keys(response).length

          let recs = []
          for (var i = 0; i < count; i++) {
            recs.push({
              BookTitle: response[i].BookName,
              Headline: response[i].Headline,
              Content: response[i].Content,
              UserId: this.state.id,
              RecId: response[i].RecID,
              Rating: response[i].Rating,
            })
          }
          this.setState({ Recs: recs })
        },
        error => { }
      )
  }
  DeleteRec = Rec => {
    fetch(
      'http://proj.ruppin.ac.il/bgroup2/prod/api/Recommendation?userId=' +
      this.state.id +
      '&recId=' +
      Rec.RecId,
      {
        method: 'DELETE',
        headers: new Headers({
          'Content-type': 'application/json; charset=UTF-8'
        })
      }
    ).then(
      result => {
        this.FetchRecs()
      },
      error => {
      }
    )
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
        if (result == 0) {
          return
        }

      },
      error => {
      }
    )
  }

  setValue = text => {
    this.setState({ BookName: text })
  }

  onPressRec = item => {
    this.setState({ Rec: item })
    this.setState({ value: true })

    {
      this.state.value == true ? (
        <EditRec Rec={this.state.Rec} navigation={this.props.navigation} />
      ) : null
    }
  }

  RenderRecs = ({ item }) => {
    return (
      <View style={styles.infoRecContainer}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity>
            <EvilIconsIcon
              name='pencil'
              style={styles.leftIcon2}
              onPress={() => this.onPressRec(item)}
            ></EvilIconsIcon>
          </TouchableOpacity>
          <TouchableOpacity>
            <EvilIconsIcon
              name='trash'
              style={styles.leftIcon2}
              onPress={() => this.DeleteRec(item)}
            ></EvilIconsIcon>
          </TouchableOpacity>
        </View>
        <Text style={styles.infoRecName}>{item.BookTitle}</Text>
        <Text style={styles.title}>{item.Headline}</Text>

        <Text style={styles.title}>{item.Content}</Text>

        <Rating selectedColor={'gold'} max={5} currentValue={item.Rating} />
      </View>
    )
  }
  navigation = () => {
    this.props.navigation.navigate('NewRec')
  }

  render() {
    return this.state.value == true ? (
      <EditRec Rec={this.state.Rec} navigation={this.props.navigation} />
    ) : (
        <View style={styles.container}>
          <View style={styles.imageStack}>
            <AwesomeButtonRick
              onPress={() => this.props.navigation.navigate('NewRec')}
              type='primary'
              raiseLevel={3}
              style={styles.btn}
            >
              הוספת המלצה
          </AwesomeButtonRick>

            <ScrollView style={styles.scrollview}>
              <FlatList
                horizontal={true}
                data={this.state.Recs}
                renderItem={this.RenderRecs}
                keyExtractor={item => `${item.BookTitle}`}
                style={styles.List}
              />
            </ScrollView>
          </View>
        </View>
      )
  }
}
const { width, height } = Dimensions.get('window')
const SCREEN_WIDTH = width < height ? width : height

const styles = StyleSheet.create({
  container: {
    width: 600,
    height: 812
  },
  List: {
    fontSize: 14,
    top: 20,
    left: 10,
    backgroundColor: "white"
  },
  imageStack: {
    height: 812
  },
  scrollview: {
    width: width - 10,
  },
  recs: {
    backgroundColor: "white"
  },
  title: {
    fontSize: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoRecContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    width: SCREEN_WIDTH - 20,
    height: 600,
    borderColor: '#72c2d4',
    borderWidth: 1.5,
    borderRadius: 15
  },
  infoRecName: {
    fontSize: 28,
    marginLeft: 15,
    margin: 10,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'
  },
  leftIcon2: {
    backgroundColor: 'transparent',
    color: '#000000',
    fontSize: 35,
    height: 40,
    width: 39
  },

  btn: {
    marginTop: 20,
    marginLeft: 125
  }
})
