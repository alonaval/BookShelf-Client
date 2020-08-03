import React from 'react'
import { StyleSheet, View, Text, FlatList, ScrollView, Dimensions, } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import MenuImage from '../src/components/MenuImage/MenuImage'
import { Rating } from 'react-native-recommendation'
import ChatIcon from '../src/components/ChatIcon/ChatIcon'
import ProfileIcon from '../src/components/ProfileIcon/ProfileIcon'

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
      RecId: '',
      UserID: '',
      HeadLine: '',
      Content: '',
      RecDate: '',
      BookName: '',
      isVisible: false,
      isModalVisible: false,
      value: false,
      Rec: '',
      ShowNewRec: false
    }
  }

  async componentDidMount() {
    let userId = await AsyncStorage.getItem('userId')
    console.log(userId)
    this.setState({
      id: userId
    })
    this.FetchRecs()
  }
  FetchRecs = () => {
 
    fetch(
      'http://proj.ruppin.ac.il/bgroup2/prod/api/Recommendation?bookTitle=' +
      this.props.navigation.state.params.title,
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
              Rating: response[i].Rating
            })
          }
          this.setState({ Recs: recs })
        },
        error => { }
      )
  }

  toggleNewRec = () => {
    this.setState({
      ShowNewRec: true
    })
  }
  setValue = text => {
    this.setState({ BookName: text })
  }

  RenderRecs = ({ item }) => {
    return (
      <View style={styles.infoRecContainer}>
        <Text style={styles.infoRecName}>{item.BookTitle}</Text>
        <Text style={styles.title}>{item.Headline}</Text>
        <Text style={styles.title}>{item.Content}</Text>

        <Rating selectedColor={'gold'} max={5} currentValue={item.Rating} />
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imageStack}>


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
    height: 300,
    width: width
  },
  title: {
    fontSize: 20,
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
})
