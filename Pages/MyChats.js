import React from 'react'
import {  StyleSheet,  View,  Text,  ScrollView,  TouchableOpacity,} from 'react-native'
import ChatIcon from '../src/components/ChatIcon/ChatIcon'
import ProfileIcon from '../src/components/ProfileIcon/ProfileIcon'
import MenuImage from '../src/components/MenuImage/MenuImage'
import { ListItem } from 'react-native-elements'
import TouchableScale from 'react-native-touchable-scale'
import AsyncStorage from '@react-native-community/async-storage'

export default class Example extends React.Component {
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
          onPress={() =>{
          navigation.navigate('Profile')
          navigation.closeDrawer()
          }}
          />
      </View>
    )
  })
  constructor (props) {
    super(props)
    this.state = {
      Users: [],
      id: '',
      value: false
    }
  }

  async componentDidMount () {
    let userId = await AsyncStorage.getItem('userId')

    this.setState({
      id: userId
    })
    this.getChats()
  }


getChats=()=>{
   fetch('https://books-c89a5.firebaseio.com/.json', {
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
          let getUsers=[];
            for (var i = 0; i <Object.keys(response).length; i++) {
          let users=Object.keys(response)[i].split('_');
            if (users.includes(this.state.id)&&users[0]==this.state.id) {
               getUsers.push(users[1])
            }
             else if(users.includes(this.state.id)&&users[1]==this.state.id){
                getUsers.push(users[0])
            }

           }
           console.log('arr:',getUsers)
           for (let i = 0; i < getUsers.length; i++) {
             this.FetchUsers(getUsers[i]);
           } 
         
        },
        error => {
        }
      )
}
  FetchUsers = (id) => {
    fetch(
      'http://proj.ruppin.ac.il/bgroup2/prod/api/User?UserID=' + id,
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
          
            var user={
              UserID: response.UserID,
              Fullname: response.Fullname,
              Gender: response.Gender,
              UserCity: response.City,
              Token:response.Token
            }
          
          let Users=this.state.Users.push(user);
          this.setState({ value:true})
        },
        error => {}
      )
  }
  render () {
    return this.state.value ? (
      <ScrollView>
        <View>
          {this.state.Users.map((l, i) => (
            <TouchableOpacity>
              <ListItem
                Component={TouchableScale}
                friction={90}
                tension={100}
                activeScale={0.95}
                key={i}
                rightAvatar={{
                  source: {
                    uri:
                      'https://ui-avatars.com/api/?background=4cc6ea&color=FFF&name=' +
                      l.Fullname
                  }
                }}
                title={<Text style={styles.subtitleView}>{l.Fullname}</Text>}
                subtitle={
                  <View>
                    <Text style={styles.subtitleView}>{l.UserCity}</Text>
                  </View>
                }
                onPress={() =>
                  this.props.navigation.navigate('chat1', {
                    id: l.UserID,
                    Token:l.Token,
                    Gender: l.Gender,
                    Fullname: l.Fullname
                  })
                }
                bottomDivider
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    ) : null
  }
}

const styles = StyleSheet.create({
  subtitleView: {
    flexDirection: 'row',
    paddingRight: 10,
    paddingTop: 5,
    textAlign: 'right'
  },
  image: {
    top: -90,
    left: 0,
    height: 812,
    position: 'absolute',
    overflow: 'visible',
    right: 0
  },
  image_imageStyle: {
    opacity: 0.6
  }
})
