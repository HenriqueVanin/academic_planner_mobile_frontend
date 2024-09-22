import React, {Component} from 'react';

import {styles} from '../Styles/index';

import {createProject} from '../Service/requests';

import {
  TouchableHighlight,
  SafeAreaView,
  View,
  Text,
  TextInput,
  Alert,
} from 'react-native';

export default class NewTask extends Component {
  state = {
    title: '',
  };

  onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    this.setState({openDate: false});
    this.setState({date: currentDate});
  };

  setOpen(openCategory) {
    this.setState({
      openCategory,
    });
  }

  setValue(callback) {
    this.setState(state => ({
      chosedCategory: callback(state.value),
    }));
  }

  setItems(callback) {
    this.setState(state => ({
      projects: callback(state.items),
    }));
  }

  createCategoryAction = () => {
    if (this.state.title !== '') {
      const projectInput = {
        title: this.state.title,
      };
      createProject(projectInput);
      this.props.close();
      Alert.alert('Categoria Criada');
    } else {
      Alert.alert('Dados faltantes.');
    }
  };
  render() {
    return (
      <SafeAreaView style={styles.editTask}>
        <View>
          <TextInput
            placeholder="Nome da Categoria"
            style={styles.input}
            placeholderTextColor="#484848"
            onChangeText={text => {
              this.setState({title: text});
            }}
          />
          <TouchableHighlight
            style={{
              alignItems: 'center',
            }}
            onPress={this.createCategoryAction}>
            <View style={styles.standardButton}>
              <Text style={{fontWeight: 'bold', color: '#fff'}}>
                Criar Categoria
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={{
              alignItems: 'center',
            }}
            onPress={() => this.props.close()}>
            <View>
              <Text style={{fontWeight: 'bold', color: '#fff'}}>Voltar</Text>
            </View>
          </TouchableHighlight>
        </View>
      </SafeAreaView>
    );
  }
}
