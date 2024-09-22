import React, {Component} from 'react';

import {styles} from '../Styles/index';
const utfYellow = '#ffcc00';

import {
  TouchableHighlight,
  SafeAreaView,
  View,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Menu, MenuItem} from 'react-native-material-menu';

import {createTask} from '../Service/requests';

export default class NewTask extends Component {
  state = {
    title: '',
    openDate: false,
    openCategory: false,
    date: new Date(),
    projects: [],
    chosedCategory: null,
    dateText: 'Prazo',
    priority: '',
    openPriority: false,
  };

  onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    this.setState({openDate: false});
    this.setState({
      date: currentDate,
      dateText: `${currentDate.getDate()}/${currentDate.getMonth()}`,
    });
  };

  async componentDidMount() {
    const projects = JSON.parse(
      await AsyncStorage.getItem('@CodeApi:projects'),
    );

    // Verify login
    if (projects) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({projects: projects});
    }
  }

  hideMenu = () => {
    this.setState({openCategory: false});
  };
  showMenu = () => {
    this.setState({openCategory: true});
  };
  hidePriority = () => {
    this.setState({openPriority: false});
  };
  showPriority = () => {
    this.setState({openPriority: true});
  };

  createTaskAction = () => {
    if (
      this.state.title !== '' &&
      this.state.date &&
      this.state.chosedCategory !== null
    ) {
      const taskInput = {
        title: this.state.title,
        date: this.state.date,
        project: this.state.chosedCategory,
        priority: this.state.priority,
      };
      createTask(taskInput);
      this.props.close();
    } else {
      Alert.alert('Dados faltantes.');
    }
  };

  onChangeText = name => text => this.setState({[name]: text});
  render() {
    return (
      <SafeAreaView style={styles.editTask}>
        <View>
          <TextInput
            placeholder="Nome da Tarefa"
            style={styles.input}
            placeholderTextColor="#484848"
            onChangeText={text => {
              this.setState({title: text});
            }}
          />
          <View style={styles.horizontalAlignSpaceAround}>
            <TouchableHighlight
              style={{
                alignItems: 'center',
              }}
              onPress={() => this.setState({openDate: true})}>
              <View style={styles.outlinedButton}>
                <Text style={{color: utfYellow, fontWeight: 'bold'}}>
                  {this.state.dateText}
                </Text>
              </View>
            </TouchableHighlight>
            <Menu
              visible={this.state.openCategory}
              anchor={
                <View style={styles.outlinedButton}>
                  <Text
                    onPress={this.showMenu}
                    style={{color: utfYellow, fontWeight: 'bold'}}>
                    {this.state.chosedCategory
                      ? this.state.chosedCategory
                      : 'Categoria'}
                  </Text>
                </View>
              }
              onRequestClose={this.hideMenu}>
              {this.state.projects.map(key => (
                <MenuItem
                  key={key._id}
                  onPress={() => {
                    this.setState({chosedCategory: key.title});
                    this.setState({openCategory: false});
                  }}>
                  {key.title}
                </MenuItem>
              ))}
            </Menu>
            <Menu
              visible={this.state.openPriority}
              anchor={
                <View style={styles.outlinedButton}>
                  <Text
                    onPress={this.showPriority}
                    style={{color: utfYellow, fontWeight: 'bold'}}>
                    {this.state.priority !== ''
                      ? this.state.priority
                      : 'Prioridade'}
                  </Text>
                </View>
              }
              onRequestClose={this.hidePriority}>
              <MenuItem
                onPress={() => {
                  this.setState({priority: 'Alta'});
                  this.setState({openPriority: false});
                }}>
                Alta
              </MenuItem>
              <MenuItem
                onPress={() => {
                  this.setState({priority: 'Média'});
                  this.setState({openPriority: false});
                }}>
                Média
              </MenuItem>
              <MenuItem
                onPress={() => {
                  this.setState({priority: 'Baixa'});
                  this.setState({openPriority: false});
                }}>
                Baixa
              </MenuItem>
            </Menu>
          </View>
          <TouchableHighlight
            style={{
              alignItems: 'center',
            }}
            onPress={this.createTaskAction}>
            <View style={styles.standardButton}>
              <Text style={{fontWeight: 'bold', color: '#fff'}}>
                Criar Tarefa
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
          {this.state.openDate && (
            <RNDateTimePicker
              value={this.state.date}
              onChange={this.onChange}
              mode="date"
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
}
