import React from 'react'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import Modal from 'react-native-modal'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage'
import {
  Card,
  CardAction,
  CardButton,
} from 'react-native-material-cards'
import { Rating } from 'react-native-elements'
import MenuImage from '../src/components/MenuImage/MenuImage'
import ChatIcon from '../src/components/ChatIcon/ChatIcon'
import ProfileIcon from '../src/components/ProfileIcon/ProfileIcon'
import { showMessage } from 'react-native-flash-message'

export default class ModalTester extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
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
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      isModalVisible: true,
      picture: '',
      UserPoints: '',
      enoughPoints: true,
      bookPoints: ''
    }
  }
  async componentDidMount() {
    let userId = await AsyncStorage.getItem('userId')
    let user = JSON.parse(await AsyncStorage.getItem('user'))
    let userPoints = await AsyncStorage.getItem('userPoints')

    let bookPoints = 100
    if (this.props.book.average_rating < 4) {
      bookPoints = 125
    } else if (this.props.book.average_rating < 4.5) {
      bookPoints = 150
    } else if (this.props.book.average_rating >= 4.5) {
      bookPoints = 200
    }


    this.setState({
      id: userId,
      user: user,
      UserPoints: userPoints,
      bookPoints: bookPoints
    })
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.func()

    });
  }
  async func() {
    let userPoints = await AsyncStorage.getItem('userPoints')
    this.setState({ UserPoints: userPoints });
    checkPoints()

  }
  checkPoints = () => {
    if (this.state.UserPoints >= this.state.bookPoints) {
      this.props.navigation.navigate('RentBook', {
        Book: this.props.book
      }),
        this.toggleModal()
    } else {
      this.setState({ enoughPoints: false })

    }


  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible })
    this.setState({ picture: this.props.book.picture })
    this.props.toggleValue()
  }

  render() {
    return this.state.enoughPoints ? (
      <View style={styles.View}>
        {this.state.isModalVisible ? (
          <View>
            <Modal
              isVisible={this.state.isModalVisible}
              style={{ backgroundColor: 'white' }}
            >
              <Card>
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: 'bold',
                    color: '#444444',
                    marginTop: 15
                  }}
                >
                  {this.props.book.title}{' '}
                </Text>
                <Text
                  style={{
                    flex: 0.25,
                    fontSize: 18,
                    textAlign: 'center',
                    color: '#444444',
                    marginTop: 15,

                  }}
                >
                  {this.props.book.author}
                </Text>
                <Rating
                  imageSize={30}
                  readonly
                  startingValue={this.props.book.average_rating}
                />
                <ScrollView style={{ height: 300 }}>
                  <Text> {this.props.book.description} </Text>
                </ScrollView>
                <CardAction
                  style={{ backgroundColor: 'black' }}
                  separator={true}
                  inColumn={false}
                >
                  <CardButton
                    style={{
                      borderWidth: 2,
                      borderColor: 'white',
                      borderRadius: 4
                    }}
                    onPress={() => {
                      this.checkPoints()
                    }}
                    title='רוצה להשאיל'
                    color='white'
                  />

                  <CardButton
                    style={{
                      borderWidth: 2,
                      borderColor: 'white',
                      borderRadius: 4
                    }}
                    onPress={() => {
                      this.toggleModal(),
                        this.props.navigation.navigate('bookRecs', {
                          title: this.props.book.title
                        })
                    }}
                    title='המלצות'
                    color='white'
                  ></CardButton>

                  <CardButton
                    style={{
                      borderWidth: 2,
                      borderColor: 'white',
                      borderRadius: 4
                    }}
                    onPress={this.toggleModal}
                    title='סגור'
                    color='white'
                  />
                </CardAction>
              </Card>
            </Modal>
          </View>
        ) : null}
      </View>
    ) : (
        <View>
          {showMessage({
            message: 'אין ברשותך מספיק נקודות כדי להשאיל ספר זה',
            type: 'danger',
            duration: 3000,
          })}

          <TouchableOpacity
          >
            <Text style={styles.title}>יש לך {this.state.UserPoints} נקודות </Text>
            <Text style={styles.title}>
              עלות הספר {this.state.bookPoints} נקודות
          </Text>
            <Text style={styles.title1}>אפשרויות צבירת נקודות </Text>
          </TouchableOpacity>
          <View>

            <View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('NewRec')}
              >

                <Text style={styles.loremIpsum}>מתן המלצה</Text>
                <Text style={styles.points}>25 נקודות</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Home')}
              >

                <Text style={styles.loremIpsum}>הוספת ספר לספריה</Text>
                <Text style={styles.points}>20 נקודות</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
  }
}
const styles = StyleSheet.create({
  View: {
    backgroundColor: '#dedede',
    opacity: 0.9
  },

  image_imageStyle: {
    opacity: 0.6
  },

  points: {
    backgroundColor: 'white',
    color: '#121212',
    fontSize: 15,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    fontWeight: 'bold'
  },
  loremIpsum: {
    backgroundColor: 'white',
    color: '#121212',
    fontSize: 21,
    textAlign: 'center',
    marginTop: 80,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 5,
    fontWeight: 'bold',
    marginVertical: 20
  },
  image2: {
    width: 200,
    height: 200,
    marginLeft: 12,
    opacity: 0.85,
    borderRadius: 100,
    overflow: 'hidden',
    marginTop: 25,
    marginLeft: 75,
    borderWidth: 3,
    borderColor: 'white'
  },

  title: {
    color: '#121212',
    marginVertical: 4,
    fontSize: 17,
    textAlign: 'center',
    backgroundColor: 'white',
    color: '#121212'
  },
  title1: {
    color: '#121212',
    fontWeight: 'bold',
    marginVertical: 4,
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: 'white',
    color: '#121212'
  },

})
