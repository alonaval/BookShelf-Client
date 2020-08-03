import React, { Fragment } from 'react'
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Picker,
  ImageBackground,
} from 'react-native'
import { Formik} from 'formik'
import * as Yup from 'yup'
import FormInput from '../src/components/FormInput'
import FormButton from '../src/components/FormButton'
import ErrorMessage from '../src/components/ErrorMessage'
import MultiSelect from 'react-native-multiple-select'
import AsyncStorage from '@react-native-community/async-storage'
import { City } from '../src/data/dataArrays'
import MenuImage from '../src/components/MenuImage/MenuImage'
import ChatIcon from '../src/components/ChatIcon/ChatIcon'
import ProfileIcon from '../src/components/ProfileIcon/ProfileIcon'
import { showMessage, hideMessage } from "react-native-flash-message"
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from 'react-native-simple-radio-button'


const validationSchema = Yup.object().shape({
  Fullname: Yup.string()
    .label('Fullname')
    .min(2, 'על השם להכיל לפחות 2 אותיות'),
  Email: Yup.string()
    .label('Email')
    .email('מייל לא תקין'),
  Password: Yup.string()
    .label('Password')
    .min(4, 'על הסיסמה להכיל לפחות 4 תווים')
})
var radio_props = [
  { label: 'זכר', value: 'male' },
  { label: 'נקבה', value: 'female' }
]
export default class Profile extends React.Component {
  componentDidMount () {
    this.FetchGetGenres()
  }

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
      selectedItems:[],
      drop_down_city: City,
      PickerValueHolder: '',
      Genres: '',
      Fullname: '',
      Email: '',
      Password: '',
      Gender: '',
      Location: '',
      PreferedGenres: '',
      Points: '',
      id: '',
      check: false,
      userGender:''
    }
  }

  async componentDidMount () {
    let userId = await AsyncStorage.getItem('userId')
    this.setState({
      id: userId
    })
    this.FetchGetGenres(), this.UserFetch()
  }

  UserFetch = () => {
    fetch(
      'http://proj.ruppin.ac.il/bgroup2/prod/api/user?userID=' + this.state.id,
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
          var GenresArr = result.PreferedGenres.split(',');
          var userGender=0;
          if( result.Gender=="female"){
             userGender=1;
          }
          
          if (this.state.id == result.UserID) {
            this.setState({
              Fullname: result.Fullname,
              Password: result.Password,
              Email: result.Email,
              Location: result.City,
              Points: result.Points,
              PreferedGenres: result.PreferedGenres,
              Gender: result.Gender,
              selectedItems: GenresArr,
              userGender:userGender
            })
          }
          var value = true
          this.setState({ check: value })
        },
        error => {
        }
      )
  }

  FetchGetGenres = () => {
    fetch('http://proj.ruppin.ac.il/bgroup2/prod/api/Genres', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(res => {
        return res.json()
      })
      .then(
        response => {
          var count = Object.keys(response).length

          let drop_down_data = []
          for (var i = 0; i < count; i++) {
            drop_down_data.push({ value: response[i] }) 
          }
          this.setState({ Genres: drop_down_data })
        },
        error => {
        }
      )
  }

  CityList = index => {
    var temp = this.state.drop_down_city[index].City
    this.state.drop_down_city.map((v, i) => {
      this.setState({
        Location: temp
      })
    })
  }

  UpdateProfile = values => {
    const newUser = {
      fullname: values.Fullname,
      email: values.Email,
      password: values.Password,
      gender: this.state.Gender,
      city: this.state.Location,
      preferedGenres: this.state.PreferedGenres,
      points: this.state.Points,
      userId: this.state.id
    }
    fetch('http://proj.ruppin.ac.il/bgroup2/prod/api/User', {
      method: 'PUT',
      body: JSON.stringify(newUser),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
      })
    }).then(
      result => {
showMessage({
              message: 'עדכנת את פרטייך!',
              type: "success",
                icon:'auto',
            });
        
        this.props.navigation.navigate('Home', { id: this.state.id })
      },
      error => {
      }
    )
  }

  handleSubmit = values => {
    this.UpdateProfile(values)
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems })
    this.setState({ PreferedGenres: selectedItems.toString() })
  }

  render () {
    return (
      <View style={styles.container}>
        <View>
          <SafeAreaView>
            {this.state.check == true ? (
              <Formik
                initialValues={{
                  Fullname: this.state.Fullname,
                  Email: this.state.Email,
                  Password: this.state.Password,
                  Gender: this.state.Gender,
                  City: this.state.Location,
                  PreferedGenres: this.state.PreferedGenres,
                  Points: this.state.Points,
                  Genres: this.state.Genres,
                  selectedItems: this.state.selectedItems
                }}
                onSubmit={values => {
                  this.handleSubmit(values)
                }}
                validationSchema={validationSchema}
              >
                {({
                  handleChange,
                  values,
                  handleSubmit,
                  errors,
                  isValid,
                  touched,
                  handleBlur,
                  isSubmitting
                }) => (
                  <Fragment>
                    <FormInput
                      name='Fullname'
                      value={values.Fullname}
                      onChangeText={handleChange('Fullname')}
                      placeholder={this.state.Fullname}
                      iconName='md-person'
                      iconColor='#2C384A'
                      onBlur={handleBlur('Fullname')}
                      autoFocus
                    />
                    <ErrorMessage
                      errorValue={touched.Fullname && errors.Fullname}
                    />
                    <FormInput
                      name='Email'
                      value={values.Email}
                      onChangeText={handleChange('Email')}
                      placeholder={this.state.Email}
                      autoCapitalize='none'
                      iconName='ios-mail'
                      iconColor='#2C384A'
                      onBlur={handleBlur('Email')}
                    />

                    <ErrorMessage errorValue={touched.Email && errors.Email} />
                    <FormInput
                      name='Password'
                      value={values.Password}
                      onChangeText={handleChange('Password')}
                      placeholder={this.state.Password}
                      iconName='ios-lock'
                      iconColor='#2C384A'
                      onBlur={handleBlur('Password')}
                    />
                    <ErrorMessage
                      errorValue={touched.Password && errors.Password}
                    />
                    <RadioForm
                      style={{ marginLeft: 120 }}
                      radio_props={radio_props}
                      initial={this.state.userGender}
                      labelStyle={{ marginRight: 20 }}
                      animation={true}
                      formHorizontal={true}
                      buttonSize={15}
                      buttonColor={'#00000'}
                      onPress={value => {
                        this.setState({ Gender: value })
                      }}
                    />

                    <Picker
                      style={{
                        height: 50,
                        width: '100%',
                        paddingBottom: 40
                      }}
                      name='Location'
                      selectedValue={this.state.Location}
                      onValueChange={(value, index) => this.CityList(index)}
                    >
                      {this.state.drop_down_city.map(v => {
                        return <Picker.Item label={v.City} value={v.City} />
                      })}
                    </Picker>

                    <ScrollView style={{ height: 225 }}>
                      <MultiSelect
                        name='Genres'
                        uniqueKey='value'
                        onSelectedItemsChange={this.onSelectedItemsChange}
                        onChangeText={handleChange('selectedItems')}
                        items={this.state.Genres}
                        selectedItems={this.state.selectedItems}
                        selectText="חיפוש ז'אנרים"
                        searchInputPlaceholderText="חיפוש ז'אנרים"
                        tagRemoveIconColor='#000000'
                        tagBorderColor='#68686e'
                        tagTextColor='black'
                        selectedItemTextColor='#CCC'
                        selectedItemIconColor='#68686e'
                        itemTextColor='black'
                        displayKey='value'
                        textAlign='right'
                        searchInputStyle={{ color: '#CCC' }}
                        submitButtonText='אישור'
                        hideSubmitButton={false}
                      />
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                      <FormButton
                        buttonType='outline'
                        onPress={handleSubmit}
                        title='עדכן'
                        buttonColor='black'
                        disabled={!isValid || isSubmitting}
                        loading={isSubmitting}
                      />
                    </View>
                  </Fragment>
                )}
              </Formik>
            ) : null}
          </SafeAreaView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    direction: 'rtl',
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  buttonContainer: {
    margin: 25
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
  },
  image_imageStyle: {
    opacity: 0.6
  },
})
