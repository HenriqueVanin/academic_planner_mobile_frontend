import React, {Component} from 'react';

import {NativeRouter, Redirect, Route} from 'react-router-native'; // Componentes for routers

import Login from './src/Pages/Login';
import Tasks from './src/Pages/Tasks';

import {styles} from './src/Styles/index';

// React Native interface componentes
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Main class : contains router structure
export default class App extends Component {
  state = {
    loggedInUser: null,
    errorMessage: '',
    projects: [],
  };

  // React function called when application opens
  async componentDidMount() {
    await AsyncStorage.clear();

    const token = await AsyncStorage.getItem('@CodeApi:token');
    const user =
      JSON.parse(await AsyncStorage.getItem('@CodeApi:user')) || null;

    // Verify login
    if (token && user) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({loggedInUser: user});
    }
  }

  render() {
    return (
      <NativeRouter>
        <View style={styles.container}>
          {this.state.loggedInUser && <Redirect to="/tasks" />}
          <Route exact path="/" component={Login} />
          <Route exact path="/tasks" component={Tasks} />
        </View>
      </NativeRouter>
    );
  }
}
