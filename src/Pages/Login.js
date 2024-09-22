import React, {Component} from 'react';
import Form from '../Components/Form';

import {SafeAreaView, ScrollView, Image, View} from 'react-native';

import {styles} from '../Styles/index';

export default class Login extends Component {
  state = {
    errorMessage: '',
    loggedInUser: '',
  };

  handleChangeErrorMessage(message) {
    this.setState({errorMessage: message});
  }

  render() {
    return (
      <SafeAreaView style={styles.backgroundStyle}>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View style={styles.nav} />
          <View>
            <Image
              style={styles.mainLogo}
              source={require('../Assets/app_logo.png')}
              resizeMethod="resize"
            />
            <Form login={true} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
