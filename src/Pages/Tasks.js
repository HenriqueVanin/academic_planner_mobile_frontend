import React, {Component} from 'react';
import {Redirect} from 'react-router-native'; // Componentes for routers
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getTasksList,
  getProjectList,
  updateTask,
  deleteTask,
} from '../Service/requests';

import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import {styles} from '../Styles/index';

import NewTask from '../Components/NewTask';
import NewCategory from '../Components/NewCategory';

const redirectToLogin = () => {
  return <Redirect push to="/" />;
};

export default class Tasks extends Component {
  state = {
    tasks: [],
    projects: [],
    errorMessage: '',
    menuVisible: false,
    newTask: false,
    newCategory: false,
    signOut: false,
    filterVisible: false,
    filter: 'Todas',
    filterPriority: 'Nenhum',
  };

  handleClearStorage() {
    let keys = ['token', 'user'];
    // eslint-disable-next-line handle-callback-err
    AsyncStorage.multiRemove(keys, err => {});
    redirectToLogin();
  }

  openNewTask = () => {
    this.setState({newTask: true, menuVisible: false});
  };

  openNewCategory = () => {
    this.setState({newCategory: true, menuVisible: false});
  };

  signOutAction = () => {
    AsyncStorage.getAllKeys().then(keys => AsyncStorage.multiRemove(keys));
    this.setState({signOut: true});
  };

  showMenu = () => {
    this.setState({menuVisible: true});
  };

  hideMenu = () => {
    this.setState({menuVisible: false});
  };

  showFilter = () => {
    this.setState({filterVisible: true});
  };

  hideFilter = () => {
    this.setState({filterVisible: false});
  };

  async componentDidMount() {
    await getTasksList();
    await getProjectList();
    const tasks = await AsyncStorage.getItem('@CodeApi:tasks');
    // Verify login
    if (tasks) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({tasks: JSON.parse(tasks)});
    }
    const projects = JSON.parse(
      await AsyncStorage.getItem('@CodeApi:projects'),
    );

    // Verify login
    if (projects) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({projects: projects});
    }
  }

  async updateList() {
    await getTasksList();
    await getProjectList();
    const tasks = await AsyncStorage.getItem('@CodeApi:tasks');
    // Verify login
    if (tasks) {
      this.setState({tasks: JSON.parse(tasks)});
    }
    const projects = JSON.parse(
      await AsyncStorage.getItem('@CodeApi:projects'),
    );

    // Verify login
    if (projects) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({projects: projects});
    }
  }

  async concludeTask(input) {
    const inputTask = {
      id: input._id,
      title: input.title,
      date: new Date(input.date),
      project: input.project,
      completed: true,
      priority: 'Todas',
    };
    await updateTask(inputTask);
    await this.componentDidMount();
  }
  async deleteTaskAction(id) {
    await deleteTask(id);
    await this.componentDidMount();
  }

  changeFilterPriority = priority => {
    this.setState(
      this.state.filterPriority !== priority
        ? {filterPriority: priority}
        : {filterPriority: 'Nenhum'},
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.backgroundStyle}>
        <ScrollView>
          {!!this.state.errorMessage && <Text>{this.state.errorMessage}</Text>}
          <View style={styles.horizontalAlignSpaceBetween}>
            <Menu
              visible={this.state.menuVisible}
              anchor={
                <View style={styles.taskMenu}>
                  <Text onPress={this.showMenu}>Menu</Text>
                </View>
              }
              onRequestClose={this.hideMenu}>
              <MenuItem onPress={this.openNewTask}>Nova Tarefa</MenuItem>
              <MenuItem onPress={this.openNewCategory}>Nova Categoria</MenuItem>
              <MenuDivider />
              <MenuItem onPress={this.signOutAction}>Sair</MenuItem>
            </Menu>
            <Menu
              visible={this.state.filterVisible}
              anchor={
                <View style={styles.filterMenu}>
                  <Text style={{color: '#fff'}} onPress={this.showFilter}>
                    Filtrar por
                  </Text>
                </View>
              }
              onRequestClose={this.hideFilter}>
              <MenuItem
                onPress={() => {
                  this.setState({filter: 'Todas'});
                }}>
                Todas
              </MenuItem>
              <MenuItem
                onPress={() => {
                  this.setState({filter: 'Completadas'});
                }}>
                Completadas
              </MenuItem>
              {this.state.projects.map(key => (
                <MenuItem
                  key={key._id}
                  onPress={() => {
                    this.setState({filter: key.title});
                  }}>
                  {key.title}
                </MenuItem>
              ))}
            </Menu>
          </View>
          {this.state.newTask && (
            <NewTask
              close={() => {
                this.setState({newTask: false});
                this.componentDidMount();
              }}
            />
          )}
          {this.state.newCategory && (
            <NewCategory
              close={() => {
                this.setState({newCategory: false});
              }}
            />
          )}
          {this.state.tasks.map
            ? this.state.tasks.map(task => (
                // eslint-disable-next-line react-native/no-inline-styles
                <View key={task._id}>
                  {(((this.state.filter === 'Todas' ||
                    task.project === this.state.filter) &&
                    task.completed === false) ||
                    (this.state.filter === 'Completadas' &&
                      task.completed)) && (
                    <View style={{marginTop: 10}}>
                      <View style={styles.taskBackground}>
                        <View style={styles.horizontalAlignSpaceBetween}>
                          <TouchableOpacity
                            style={
                              task.completed
                                ? styles.buttonDisabled
                                : styles.button
                            }
                            onPress={() => this.concludeTask(task)}
                          />
                          <Text style={styles.taskText}>{task.title}</Text>
                        </View>
                        <View>
                          <View style={styles.horizontalAlignSpaceBetween}>
                            <Text style={styles.taskText}>
                              {task.date
                                ? `${task.date.slice(8, 10)}/${task.date.slice(
                                    5,
                                    7,
                                  )}`
                                : ''}
                            </Text>
                            <TouchableOpacity
                              style={
                                task.priority
                                  ? task.priority === 'Alta'
                                    ? styles.highPriority
                                    : task.priority === 'Média'
                                    ? styles.mediumPriority
                                    : task.priority === 'Baixa'
                                    ? styles.lowPriority
                                    : styles.deleteButton
                                  : styles.deleteButton
                              }
                            />
                            <TouchableOpacity
                              style={styles.deleteButton}
                              onPress={() => this.deleteTaskAction(task._id)}>
                              <Text>X</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              ))
            : undefined}
          {this.state.signOut && <Redirect to="/" />}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
