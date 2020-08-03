import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  btnClickContain: {
    flexDirection: 'row',
    padding: 5,
    marginTop: 5,
    marginBottom: 5
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0"
    
  },
  btnIcon: {
    height: 25,
    width: 25
  },
  btnText: {
    fontSize: 16,
    marginLeft: "auto",
  
  }
});

export default styles;
