import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import firebaseSvc from '../../FirebaseSvc';
import AsyncStorage from '@react-native-community/async-storage'
import { Text } from 'react-native'

class Chat extends React.Component {
  async componentDidMount() {
    let userId = await AsyncStorage.getItem('userId');
    let chatId = '';
    if (userId < this.props.navigation.state.params.id) {
      chatId = userId + '_' + this.state.user2Id;
    }
    else if (userId > this.props.navigation.state.params.id) {
      chatId = this.state.user2Id + '_' + userId;
    }

    let user = JSON.parse(await AsyncStorage.getItem('user'))
    let num = 20;
    this.setState({ userFullname: user.Fullname, userEmail: user.Email, userId: userId, chatId: chatId, num: num })
    firebaseSvc.refOn(num, chatId, message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );

  }
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      isLoadingEarlier: false,
      loadEarlier: true,
      userFullname: '',
      userEmail: '',
      userId: '',
      Token: '',
      user2Id: this.props.navigation.state.params.id,
      user2Name: this.props.navigation.state.params.Fullname,
      Token: this.props.navigation.state.params.Token,
      chatId: '',
      num: ''

    };
  }
  static navigationOptions = ({ navigation }) => ({
    title: <Text style={{
      textAlign: 'center', justifyContent: 'center',
      alignItems: 'center'
    }}>{navigation.state.params.Fullname}💬</Text>
  });


  onSend = (message) => {
    firebaseSvc.send(message, this.state.chatId)
    this.btnPushFromClient()

  }

  onLoadEarlier = () => {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
        messages: [],
      };
    }, () => {
      let num = this.state.num;
      firebaseSvc.refOn(this.state.num + 10, this.state.chatId, message =>
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, message), isLoadingEarlier: false, num: num + 10,
        }))

      );

    });
  }


  btnPushFromClient = () => {

    let per = {
      to: this.state.Token,
      title: 'התראה חדשה',
      body: 'הודעה מ' + this.state.userFullname,
      badge: 1,
      data: { name: 'name' }
    }

    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      body: JSON.stringify(per),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    }).then(response => response.json())

  }

  get user() {

    return {
      name: this.state.userFullname,
      email: this.state.userEmail,
      _id: this.state.userId,
      avatar:
        'https://ui-avatars.com/api/?background=707070&color=FFF&name=' +
        this.state.userFullname

    };
  }

  render() {
    let loadEarlier = false
    if (this.state.messages.length >= 20) {
      loadEarlier = true
    }
    return (
      <GiftedChat
        showUserAvatar={true}
        messages={this.state.messages}
        alwaysShowSend={true}
        onSend={newMessage => this.onSend(newMessage)}
        user={this.user}
        loadEarlier={loadEarlier}
        onLoadEarlier={this.onLoadEarlier}
        isLoadingEarlier={this.state.isLoadingEarlier}
        renderAvatarOnTop={true}
        isAnimated={true}

      />
    )
  }



}

export default Chat;
