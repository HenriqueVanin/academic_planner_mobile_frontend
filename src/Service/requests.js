import api from './api';

import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const signIn = async (userInput, setError, setLogin) => {
  try {
    const response = await api.post('/auth/authenticate', {
      username: userInput.username,
      password: userInput.password,
    });

    const {token, user} = response.data;

    await AsyncStorage.setItem('@CodeApi:token', token);
    await AsyncStorage.setItem('@CodeApi:user', JSON.stringify(user));
    setLogin(true);
  } catch (err) {
    Alert.alert(err.data.error);
  }
};

export const signUp = async (userInput, setError, setLogin) => {
  try {
    const response = await api.post('/auth/register', {
      username: userInput.username,
      password: userInput.password,
    });

    const {token, user} = response.data;

    await AsyncStorage.setItem('@CodeApi:token', token);
    await AsyncStorage.setItem('@CodeApi:user', JSON.stringify(user));
    setLogin(true);
  } catch (err) {
    Alert.alert(err.data.error);
  }
};

export const getTasksList = async () => {
  try {
    const response = await api.get('/tasks');

    const tasks = response.data.tasks;
    await AsyncStorage.setItem('@CodeApi:tasks', JSON.stringify(tasks));
  } catch (err) {
    Alert.alert(err.data.error);
  }
};

export const getProjectList = async () => {
  try {
    const response = await api.get('/tasks/projects');

    const project = response.data.project;
    await AsyncStorage.setItem('@CodeApi:projects', JSON.stringify(project));
  } catch (err) {
    Alert.alert(err.data.error);
  }
};

export const createTask = async taskInput => {
  try {
    await api.post('/tasks/create', {
      title: taskInput.title,
      date: taskInput.date,
      project: taskInput.project,
      completed: false,
      priority: taskInput.priority,
    });
  } catch (err) {
    Alert.alert(err.data.error);
  }
};

export const createProject = async projectInput => {
  try {
    await api.post('/tasks/createProject', {
      title: projectInput.title,
    });
  } catch (err) {
    Alert.alert(err.data.error);
  }
};

export const updateTask = async taskInput => {
  try {
    await api.put(`/tasks/${taskInput.id}`, {
      title: taskInput.title,
      date: taskInput.date,
      project: taskInput.project,
      completed: taskInput.completed,
      priority: taskInput.priority,
    });
  } catch (err) {
    Alert.alert(err.data.error);
  }
};

export const deleteTask = async taskId => {
  try {
    await api.delete(`/tasks/${taskId}`);
  } catch (err) {
    Alert.alert(err.data.error);
  }
};
