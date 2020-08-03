import { StyleSheet } from 'react-native'

const BOOK_ITEM_MARGIN = 15

const styles = StyleSheet.create({
  
  container: {
    alignItems: 'center',
    marginLeft: BOOK_ITEM_MARGIN / 2,
    marginRight: BOOK_ITEM_MARGIN / 2,
    marginTop: 20,
    width: 155
  },

  divider: {
    width: '100%',
    height: 11,
    marginVertical: 3,
    opacity: 0.7,
    backgroundColor: '#523a1d',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5
  },
  photo: {
    width: 150,
    height: 210
  },
  lockedphoto: {
    width: 150,
    height: 210,
    opacity: 0.2
  },
  title: {
    fontWeight: 'bold',
    marginVertical: 4,
    fontSize: 20,
    textAlign: 'center',
    color: '#505152',
    textDecorationLine: 'underline',
    marginBottom: 14

  },
  scrollview: {
    height: 600
  },
  leftIcon2: {
    backgroundColor: 'transparent',
    color: '#505152',
    fontSize: 30,
    height: 35,
    width: 33
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
})

export default styles
