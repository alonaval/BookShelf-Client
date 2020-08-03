import { StyleSheet} from 'react-native';

const height=667;



const styles = StyleSheet.create({
  image: {
    top: -90,
    left: 0,
    height: 812,
    position: 'absolute',
    overflow: 'visible',
    right: 0
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10, 
    marginTop: 15,
    width: 160,
    height: 250,
   
  },
  divider: {
    width: '100%',
    height: 11,
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
  
  scrollview:{
    height:height-50,
  },
  leftIcon2: {
   backgroundColor: 'transparent',
    color: '#505152',
    fontSize: 30,
    height: 35,
    width: 33
  },
 
});

export default styles;
