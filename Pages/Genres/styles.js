import { StyleSheet } from 'react-native';


const BOOK_ITEM_MARGIN = 20;
const styles = StyleSheet.create({
  genresItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: BOOK_ITEM_MARGIN / 2,
    marginRight: BOOK_ITEM_MARGIN / 2,
    marginTop: 20,
    width: 200,
    height: 215,
    borderColor: '#cccccc',
    borderWidth: 0.5,
    borderRadius: 15
  },
  genresPhoto: {
    width: 200,
    height: 215,
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  genresName: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    marginTop: 8
  },
  scrollview: {
    height: 670,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  genresInfo: {
    marginTop: 3,
    marginBottom: 5
  }
});

export default styles;
