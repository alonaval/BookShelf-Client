import React, { Fragment } from 'react';
import { Text, StyleSheet, SafeAreaView, View, Picker, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { Formik } from 'formik';

import * as Yup from 'yup';
import FormInput from '../src/components/FormInput';
import FormButton from '../src/components/FormButton';
import ErrorMessage from '../src/components/ErrorMessage';
import RadioForm from 'react-native-simple-radio-button'
import MultiSelect from 'react-native-multiple-select';
import { City } from '../src/data/dataArrays';
import MenuImage from '../src/components/MenuImage/MenuImage';
import { showMessage } from 'react-native-flash-message'
import AsyncStorage from '@react-native-community/async-storage'



const validationSchema = Yup.object().shape({
  Fullname: Yup.string()
    .label('Fullname')
    .required('שדה חובה')
    .min(2, 'על השם להכיל לפחות 2 אותיות'),
  Email: Yup.string()
    .label('Email')
    .email('מייל לא תקין')
    .required('שדה חובה'),
  Password: Yup.string()
    .label('Password')
    .required('שדה חובה')
    .min(6, 'על הסיסמה להכיל לפחות 6 תווים'),

})

var radio_props = [
  { label: 'זכר', value: 'male' },
  { label: 'נקבה', value: 'female' }
]

export default class Register extends React.Component {
  goToSignin = () => this.props.navigation.navigate('SignIn');
  componentDidMount() { this.FetchGetGenres() }

  static navigationOptions = ({ navigation }) => ({
    title: '',
    headerRight: (
      <MenuImage
        onPress={() => {
          navigation.openDrawer();
        }}
      />
    )
  });

  constructor(props) {

    super(props);
    let local = true;
    if (!local) {
      this.apiUrl = 'http://proj.ruppin.ac.il/bgroup2/prod/api/User';
    }
    this.Genres = {}
    this.state = {
      selectedItems: [],
      drop_down_data: [],
      drop_down_city: City,
      PickerValueHolder: '',
      Genres: [''],
      Fullname: '',
      Email: '',
      Password: '',
      Gender: '',
      PreferedGenres: '',
      Points: 100,
      Location: '',


    }

  }

  FetchGetGenres = () => {
    fetch("http://proj.ruppin.ac.il/bgroup2/prod/api/Genres", {
      method: "GET",
      headers: {
        'Content-type': 'application/json; charset=UTF-8',

      }
    })
      .then(res => {
        return res.json()
      })
      .then(
        (response) => {
          var count = Object.keys(response).length;

          let drop_down_data = [];
          for (var i = 0; i < count; i++) {
            drop_down_data.push({ value: response[i] });
          } this.setState({ drop_down_data });

        },
        (error) => {

        }
      );
  }


  FetchRegistration = (values) => {
    const newUser = {
      fullname: values.Fullname,
      email: values.Email,
      password: values.Password,
      gender: this.state.Gender,
      city: this.state.Location,
      preferedGenres: (this.state.PreferedGenres).toString(),
      points: 100,

    }
    fetch('http://proj.ruppin.ac.il/bgroup2/prod/api/User', {
      method: 'POST',
      body: JSON.stringify(newUser),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
      })
    })
      .then(res => {
        return res.json()
      })
      .then(
        result => {
          ;
          if (result.UserID == 0) {
            showMessage({
              message: 'כבר קיים משתמש עם מייל זה',
              type: 'danger',
              duration: 3000,
              icon: 'auto'
            })
            return
          } else {
            console.log(result);
            showMessage({
              message: 'נרשמת בהצלחה לאפליקציה!',
              type: 'success',
              duration: 2000,
              icon: 'auto'
            })
            AsyncStorage.setItem('userId', result.UserID.toString())
            AsyncStorage.setItem('userPoints', result.Points.toString())
            AsyncStorage.setItem('user', JSON.stringify(result), () => {
              this.props.navigation.navigate('Home', { id: result.UserID })
            })
          }

        },
        error => {
          alert('חלה שגיאה, אנא נסו שנית')
        }
      )

  }

  handleSubmit = values => {
    if (values.Email.length > 0 && values.Password.length > 0) {
      this.FetchRegistration(values);
    }
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
    this.setState({ PreferedGenres: selectedItems })
  }


  CityList = index => {
    this.state.drop_down_city.map((v, i) => {
      if (index === i) {
        var temp = this.state.drop_down_city[index].City
        this.setState(
          {
            Location: temp
          }
        )
      }
    })
  }



  render() {
    return (
      <View style={styles.container}>
        <View>

          <SafeAreaView>
            <Formik
              initialValues={{
                Fullname: '',
                Email: '',
                Password: '',
                Gender: '',
                PreferedGenres: '',
                Points: '',
                Genres: [''],
                selectedItems: [],
                drop_down_data: [],
                PickerValueHolder: '',
                drop_down_city: [],
                Location: '',

              }}
              onSubmit={values => {
                this.handleSubmit(values)
              }}
              validationSchema={validationSchema}>
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
                      placeholder='שם מלא'
                      iconName='md-person'
                      iconColor='#2C384A'
                      onBlur={handleBlur('Fullname')}
                      autoFocus
                    />

                    <ErrorMessage errorValue={touched.Fullname && errors.Fullname} />
                    <FormInput
                      name='Email'
                      value={values.Email}
                      onChangeText={handleChange('Email')}
                      placeholder='אימייל'
                      autoCapitalize='none'
                      iconName='ios-mail'
                      iconColor='#2C384A'
                      onBlur={handleBlur('Email')}
                    />

                    <ErrorMessage errorValue={touched.Email && errors.Email} />


                    <FormInput
                      textAlign="right"
                      name='Password'
                      value={values.Password}
                      onChangeText={handleChange('Password')}
                      placeholder='סיסמה'
                      secureTextEntry
                      iconName='ios-lock'
                      iconColor='#2C384A'
                      onBlur={handleBlur('Password')}
                    />
                    <ErrorMessage errorValue={touched.Password && errors.Password} />


                    <RadioForm
                      style={{ marginLeft: 120 }}
                      radio_props={radio_props}
                      initial={-1}
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
                        uniqueKey="value"
                        onSelectedItemsChange={this.onSelectedItemsChange}
                        onChangeText={handleChange('Genres')}
                        items={this.state.drop_down_data}
                        selectedItems={this.state.selectedItems}
                        selectText="בחר ז'אנרים אהובים"
                        onChangeInput={(text) => console.log(text)}
                        tagRemoveIconColor="#000000"
                        tagBorderColor="#68686e"
                        tagTextColor="black"
                        selectedItemTextColor="#CCC"
                        selectedItemIconColor="#68686e"
                        itemTextColor="black"
                        displayKey="value"
                        textAlign="right"
                        searchInputStyle={{ color: '#CCC' }}
                        submitButtonText="אישור"
                        hideSubmitButton={false}

                      />
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                      <FormButton
                        buttonType='outline'
                        onPress={handleSubmit}
                        title='הרשמה'
                        buttonColor='#F57C00'
                        disabled={!isValid}

                      />
                    </View>
                  </Fragment>
                )}
            </Formik>

            <Button
              title='משתמש רשום? התחבר'
              onPress={this.goToSignin}
              titleStyle={{
                color: '#039BE5'
              }}
              type='clear'
            />
          </SafeAreaView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    direction: "rtl",
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start'
  },
  buttonContainer: {
    margin: 25
  },
  radio: {
    fontFamily: "Tahoma"
  },

  button: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#59cbbd',

  },
})


