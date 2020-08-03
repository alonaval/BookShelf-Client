import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer'
import { createStackNavigator } from 'react-navigation-stack'

import DrawerContainer from '../../Pages/DrawerContainer/DrawerContainer'

import SignIn from '../../Pages/SignIn'
import MyChats from '../../Pages/MyChats'
import Book from '../../Pages/Book'
import Register from '../../Pages/Register'
import Genres from '../../Pages/Genres/GenresScreen'
import GenresList from '../../Pages/GenresList/GenresListScreen'
import RentBook from '../../Pages/RentBook'
import Home from '../../Pages/Home/HomeScreen'
import Profile from '../../Pages/Profile'
import MyRecommendations from '../../Pages/MyRecommendations'
import SearchScreen from '../../Pages/Search/SearchScreen'
import UserLibrary from '../../Pages/UserLibrary/UserLibrary'
import Push from '../../registerForPushNotificationsAsync'
import WaitingBooks from '../../Pages/WaitingBooks'
import bookRecs from '../../Pages/BookRecs'
import NewRec from '../../Pages/NewRec'
import Chat from '../components/Chat'


const MainNavigator = createStackNavigator(
  {
    Home: Home,
    SignIn: SignIn,
    Register: Register,
    Book: Book,
    Genres: Genres,
    GenresList: GenresList,
    RentBook: RentBook,
    Profile: Profile,
    MyRecommendations: MyRecommendations,
    SearchScreen: SearchScreen,
    UserLibrary: UserLibrary,
    MyChats: MyChats,
    push: Push,
    WaitingBooks: WaitingBooks,
    bookRecs: bookRecs,
    NewRec: NewRec,
    Chat: Chat,
  },
  {

    initialRouteName: 'SignIn',
    headerMode: 'float',
    navigationOptions: {

    },
    defaulfNavigationOptions: ({ navigation }) => ({
      headerTitleStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
        flex: 1
      }
    })
  }
)

const DrawerStack = createDrawerNavigator(
  {
    Main: MainNavigator
  },
  {
    drawerType: 'slide',
    drawerPosition: 'right',
    initialRouteName: 'Main',
    headerMode: 'float',
    drawerWidth: 250,
    contentComponent: DrawerContainer

  }
)

export default createAppContainer(DrawerStack)

console.disableYellowBox = true

