import React, { Fragment } from 'react'
import { Text, View, StyleSheet, SafeAreaView } from 'react-native'
import MenuImage from '../src/components/MenuImage/MenuImage'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../src/components/FormInput'
import FormButton from '../src/components/FormButton'
import { Rating } from 'react-native-recommendation'
import ChatIcon from '../src/components/ChatIcon/ChatIcon'
import ProfileIcon from '../src/components/ProfileIcon/ProfileIcon'
import { showMessage } from "react-native-flash-message";


const validationSchema = Yup.object().shape({
  BookName: Yup.string()
    .label('BookName')
    .min(2, 'על השם להכיל לפחות 2 אותיות'),

  Content: Yup.string().label('Content'),

  HeadLine: Yup.string().label('HeadLine')
})

export default class EditRec extends React.Component {
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
          onPress={() => {
            navigation.navigate('Profile')
            navigation.closeDrawer()
          }}
        />
      </View>
    )
  })

  constructor(props) {
    super(props)

    this.state = {
      id: '',
      Recs: [''],
      RecId: '',
      UserID: '',
      HeadLine: '',
      Content: '',
      RecDate: '',
      BookName: '',
      Rating: '',
      check: true,
      Rec: ''
    }
  }

  UpdateRec = values => {
    const newRec = {
      headline: values.Headline,
      content: values.Content,
      userid: this.props.Rec.UserId,
      bookname: values.BookName,
      recid: this.props.Rec.RecId,
      rating: this.state.Rating
    }

    fetch('http://proj.ruppin.ac.il/bgroup2/prod/api/Recommendation', {
      method: 'PUT',
      body: JSON.stringify(newRec),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
      })
    }).then(
      result => {
        showMessage({
          message: "עדכנת את ההמלצה!",
          type: "success",
          icon: 'auto',
        });
        this.props.navigation.navigate('MyRecommendations')
      },
      error => {
      }
    )
  }

  handleSubmit = values => {
    this.UpdateRec(values)
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <SafeAreaView>
            {this.state.check == true ? (
              <Formik
                initialValues={{
                  Headline: this.props.Rec.Headline,
                  BookName: this.props.Rec.BookTitle,
                  Content: this.props.Rec.Content,
                  Rating: this.props.Rec.Rating
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
                      <View style={styles.container}>
                        <Text style={styles.bookName}>{values.BookName}</Text>
                      </View>
                      <FormInput
                        name='Headline'
                        value={values.Headline}
                        onChangeText={handleChange('Headline')}
                        placeholder={this.props.Rec.Headline}
                        autoCapitalize='none'
                        onBlur={handleBlur('Headline')}
                      />

                      <FormInput
                        name='Content'
                        value={values.Content}
                        onChangeText={handleChange('Content')}
                        placeholder={this.props.Rec.Content}
                        autoCapitalize='none'
                        onBlur={handleBlur('Content')}
                      />

                      <Rating
                        selectedColor={'gold'}
                        max={5}
                        currentValue={this.props.Rec.Rating}
                        selectedValue={value => {
                          this.setState({ Rating: value })
                        }}
                      />
                      <View style={styles.buttonContainer}>
                        <FormButton
                          buttonType='outline'
                          onPress={handleSubmit}
                          title='עדכן'
                          buttonColor='#72c2d4'
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  bookName: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
    fontWeight: 'bold'
  },
  buttonContainer: {
    margin: 25
  },
})
