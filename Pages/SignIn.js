import React from 'react'
import {
  ImageBackground, StyleSheet, Text, View, TextInput,
  TouchableOpacity, StatusBar, TouchableWithoutFeedback, Keyboard
} from 'react-native'

import AsyncStorage from '@react-native-community/async-storage'
import { showMessage, } from 'react-native-flash-message'

export default class SignIn extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: ''
  })

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  CheckLoginFetch = (email, password) => {
    if (password == '') {
      {
        showMessage({
          message: 'הכנס סיסמא',
          type: 'danger',
          duration: 3000
        })
      }
      return
    } else if (email == '') {
      {
        showMessage({
          message: 'הכנס אימייל',
          type: 'danger',
          duration: 3000
        })
      }
      return
    }
    const encodedValueEmail = encodeURIComponent("'" + email + "'")
    const encodedValuePass = encodeURIComponent("'" + password + "'")

    fetch(
      `http://proj.ruppin.ac.il/bgroup2/prod/api/Login?email=${encodedValueEmail}&password=${encodedValuePass}`,
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
        result => {
          if (result.UserID == 0) {
            {
              showMessage({
                message: 'האימייל או הסיסמא לא נכונים, אנא נסה שנית',
                type: 'danger',
                duration: 3000,
                icon: 'auto'
              })
            }
            return
          }
          AsyncStorage.setItem('userId', result.UserID.toString())
          AsyncStorage.setItem('userPoints', result.Points.toString())
          AsyncStorage.setItem('user', JSON.stringify(result), () => {
            this.props.navigation.navigate('Home', { id: result.UserID })
          })
        },
        error => {
        }
      )
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.group}>
            <View style={styles.backgroundImage}>
              <ImageBackground
                source={require('../assets/images/signin.jpg')}
                resizeMode='contain'
                style={styles.image}
                imageStyle={styles.image_imageStyle}
              >
                <TextInput
                  placeholder='אימייל'
                  placeholderTextColor="#6b6b6e"
                  textBreakStrategy='balanced'
                  keyboardAppearance='dark'
                  spellCheck={false}
                  style={styles.email}
                  onChangeText={text => this.setState({ email: text })}
                  value={this.state.email}
                ></TextInput>
                <TextInput
                  secureTextEntry={true}
                  placeholder='סיסמה'
                  placeholderTextColor="#6b6b6e"
                  secureTextEntry={true}
                  spellCheck={false}
                  style={styles.password}
                  onChangeText={text => this.setState({ password: text })}
                ></TextInput>
                <TouchableOpacity
                  style={[styles.container_button1]}
                  onPress={() =>
                    this.CheckLoginFetch(this.state.email, this.state.password)
                  }
                >
                  <Text style={styles.caption}> כניסה </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.container_Button2]}
                  onPress={() => {
                    this.props.navigation.navigate('Register')
                  }}
                >
                  <Text style={styles.caption_button2}> יצירת משתמש חדש </Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </View>
          <StatusBar animated={false}></StatusBar>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    alignItems: 'center'
  },
  group: {
    width: 375,
    height: 1068,
    marginTop: -320
  },
  backgroundImage: {
    marginLeft: 50,
    width: 275,
    height: 942
  },
  image: {
    backgroundColor: 'rgba(255,255,255,1)',
    flex: 1
  },

  email: {
    width: 223,
    height: 42,
    backgroundColor: 'rgba(15,15, 15,0.25)',
    color: 'rgba(0,0,0,1)',
    borderRadius: 5,
    borderColor: '#000000',
    borderWidth: 0,
    marginTop: 600,
    marginLeft: 26,
    textAlign: 'left'

  },
 password: {
    width: 223,
    height: 42,
    backgroundColor: 'rgba(15,15, 15,0.25)',
    color: 'rgba(0,0,0,1)',
    borderRadius: 5,
    borderColor: '#000000',
    borderWidth: 0,
    marginTop: 23,
    marginLeft: 26,
    textAlign: 'left'
  },
  container_button1: {
    width: 124,
    height: 50,
    marginTop: 44,
    marginLeft: 75,
    backgroundColor: '#3F51B5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 16,
    paddingLeft: 16,
    elevation: 2,
    minWidth: 88,
    borderRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    },
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 5
  },

  caption: {
    color: '#fff',
    fontSize: 14

  },
  
  container_Button2: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingRight: 16,
    paddingLeft: 16,
    minWidth: 88
  },
  caption_button2: {
    color: '#3F51B5',
    fontSize: 14
    
  }
})
