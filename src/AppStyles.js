import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width < height ? width : height;

const GenreNumColums = 2;
const Genre_ITEM_HEIGHT = 150;
const Genre_ITEM_MARGIN = 20;

export const GenreCard = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Genre_ITEM_MARGIN,
    marginTop: 20,
    width: (SCREEN_WIDTH - (GenreNumColums + 1) * Genre_ITEM_MARGIN) / GenreNumColums,
    height: Genre_ITEM_HEIGHT + 75,
    borderColor: '#cccccc',
    borderWidth: 0.5,
    borderRadius: 15
  },
  photo: {
    width: (SCREEN_WIDTH - (GenreNumColums + 1) * Genre_ITEM_MARGIN) / GenreNumColums,
    height: Genre_ITEM_HEIGHT,
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
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
  Genre: {
    marginTop: 5,
    marginBottom: 5
  }
});
