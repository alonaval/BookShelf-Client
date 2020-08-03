import React from 'react'
import { View, Image } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'
import MenuButton from '../../src/components/MenuButton/MenuButton'
import AsyncStorage from '@react-native-community/async-storage'

export default class DrawerContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Fullname: '',
      Email: '',
      Gender: '',
      Points: '',
      id: '',
      check: false,
      User: ''
    }
  }
  async componentDidMount() {
    let userId = await AsyncStorage.getItem('userId')
    this.setState({
      id: userId
    })
    this.UserFetch(userId)
  }
  UserFetch = id => {
    fetch('http://proj.ruppin.ac.il/bgroup2/prod/api/user?userID=' + id, {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
      })
    })
      .then(res => {
        return res.json()
      })
      .then(
        result => {
          let User = {
            Fullname: result.Fullname,
            Email: result.Email,
            Points: result.Points,
            Gender: result.Gender
          }
          this.setState({ User: User });
          this.setState({ check: true });

        },
        error => {
        }
      )
  }

  render() {
    const { navigation } = this.props
    return (
      <View style={styles.content}>
        <View style={styles.container}>
          <View>
            <Image
              source={require('../../assets/images/signin.jpg')}
              style={styles.profileImg}
            />

          </View>
          <MenuButton
            title='דף בית'
            optionSelectedStyle={{ backgroundColor: "#e3e5e8" }}
            onPress={() => {
              navigation.navigate('Home')
              navigation.closeDrawer()
            }}
          />
          <MenuButton
            title='הספרייה שלי'
            optionSelectedStyle={{ backgroundColor: "#e3e5e8" }}
            onPress={() => {
              navigation.navigate('UserLibrary')
              navigation.closeDrawer()
            }}
          />
          <MenuButton
            title='חיפוש ספר'
            optionSelectedStyle={{ backgroundColor: "#e3e5e8" }}
            onPress={() => {
              navigation.navigate('SearchScreen')
              navigation.closeDrawer()
            }}
          />
          <MenuButton
            title='ההמלצות שלי'
            optionSelectedStyle={{ backgroundColor: "#e3e5e8" }}
            onPress={() => {
              navigation.navigate('MyRecommendations')
              navigation.closeDrawer()
            }}
          />
          <MenuButton
            title='ספרים בהמתנה'
            optionSelectedStyle={{ backgroundColor: "#e3e5e8" }}
            onPress={() => {
              navigation.navigate('WaitingBooks')
              navigation.closeDrawer()
            }}
          />
        </View>
      </View>
    )
  }
}

DrawerContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  })
}
