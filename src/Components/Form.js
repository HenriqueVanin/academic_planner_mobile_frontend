import React from 'react';
import {Redirect} from 'react-router-native'; // Componentes for routers
import {
  TouchableHighlight,
  View,
  TextInput,
  Text,
  StyleSheet,
} from 'react-native';

import {styles} from '../Styles/index';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {Formik} from 'formik';

import {signIn, signUp} from '../Service/requests';

const utfYellow = '#ffcc00';
const backColor = '#1f1a17';

const Form = props => {
  const [login, setLogin] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const signUpSubmit = values => {
    const user = {
      username: values.username,
      password: values.password,
    };
    signUp(user, setErrorMessage, setLogin);
  };

  return (
    <Formik
      initialValues={{username: '', password: ''}}
      onSubmit={values => {
        const user = {
          username: values.username,
          password: values.password,
        };
        signIn(user, setErrorMessage, setLogin);
      }}>
      {({handleChange, handleBlur, handleSubmit, values, errors}) => (
        <View>
          {login ? <Redirect push to="/tasks" /> : undefined}
          <TextInput
            placeholder="Username"
            placeholderTextColor="#484848"
            onBlur={handleBlur('username')}
            value={values.username}
            style={styles.input}
            onChangeText={handleChange('username')}
            autoCapitalize="none"
            autoCompleteType="email"
            keyboardType="email-address"
            keyboardAppearance="dark"
            returnKeyType="next"
            returnKeyLabel="next"
          />
          <TextInput
            icon="key"
            value={values.password}
            placeholder="Password"
            placeholderTextColor="#484848"
            onBlur={handleBlur('password')}
            style={styles.input}
            secureTextEntry
            onChangeText={handleChange('password')}
            autoCompleteType="password"
            autoCapitalize="none"
            keyboardAppearance="dark"
            returnKeyType="go"
            returnKeyLabel="go"
          />
          <View style={styles.horizontalAlign}>
            <TouchableHighlight
              style={{
                alignItems: 'center',
              }}
              onPress={handleSubmit}>
              <View style={styles.loginButton}>
                <Text color="#1f1a17" style={{fontWeight: 'bold'}}>
                  LOGIN
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              style={{
                alignItems: 'center',
              }}
              onPress={() => signUpSubmit(values)}>
              <View style={styles.registerButton}>
                <Text style={{fontWeight: 'bold', color: utfYellow}}>
                  CADASTRE
                </Text>
              </View>
            </TouchableHighlight>
          </View>
          <Text style={{fontWeight: 'bold', color: utfYellow}}>
            {errorMessage}
          </Text>
        </View>
      )}
    </Formik>
  );
};
export default Form;
