import React, {Component} from 'react';
import api from '../Service/api';

import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  AsyncStorage,
} from 'react-native';

export default class Home extends Component {
  state = {
    loggedInUser: null,
    errorMessage: '',
    projects: [],
  };

  signIn = async () => {
    try {
      const response = await api.post('/auth/authenticate', {
        username: 'RosadoRock',
        password: 'lindo',
      });

      const {token, user} = response.data;

      await AsyncStorage.multiSet([
        ['@CodeApi:token', token],
        ['@CodeApi:user', JSON.stringify(user)],
      ]);

      this.setState({loggedInUser: user});
    } catch (err) {
      this.setState({errorMessage: err.data.error});
    }
  };

  getProjectList = async () => {
    try {
      const response = await api.get('/projects');

      const {projects} = response.data;

      this.setState({projects});
    } catch (err) {
      this.setState({errorMessage: err.data.error});
    }
  };

  async componentDidMount() {
    await AsyncStorage.clear();

    const token = await AsyncStorage.getItem('@CodeApi:token');
    const user =
      JSON.parse(await AsyncStorage.getItem('@CodeApi:user')) || null;
  }

  render() {
    return (
      <View>
        {!!this.state.errorMessage && <Text>{this.state.errorMessage}</Text>}
        <Button onPress={this.getProjectList} title="Carregar projetos" />
        <Button onPress={this.signIn} title="Entrar" />

        {this.state.projects.map(project => (
          <View key={project._id} style={{marginTop: 15}}>
            <Text style={{fontWeight: 'bold'}}>{project.title}</Text>
            <Text>{project.description}</Text>
          </View>
        ))}
      </View>
    );
  }
}
