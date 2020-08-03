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
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#444444',
    marginTop: 3,
    marginRight: 5,
    marginLeft: 5,
  },
  category: {
    marginTop: 5,
    marginBottom: 5
  },
  scrollview:{
    height:600,
   
  },
  mainContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  
});

export default styles;
