import React from 'react';
//import { View } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, Alert, Button, StyleSheet, StatusBar } from 'react-native';
import { AsyncStorage } from 'react-native';
import Modal from './Modal';
//import Button from './Button';
import Login from './Login'
import SignUp from './SignUp'
import base64 from 'base-64';
import Profile from './Profile'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'


class App extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      showModal: false,
      mode: "welcome",
      mode2: "view",
      token: ''
    }
  }

  async setToken(key) {
    this.setState({ token: key })
    //  console.log("key is " + key)
    //  console.log("token is " + this.state.token)
    const value = await AsyncStorage.getItem('token');
    const value1 = await AsyncStorage.getItem('username');
    const value2 = await AsyncStorage.getItem('password');
    //  console.log(value);
    //  console.log(value1);
    //  console.log(value2);

  }
  goToWelcome() {
    this.setState({ mode: 'welcome' })
  }
  goToProfile() {
    this.setState({ mode: 'profile' })
  }
  onLoginPress() {
    this.setState({ mode: 'login' })
  }
  onSignUpPress() {
    this.setState({ mode: 'signup' })
  }
  async load() {
    console.log("load call")
    const token = await AsyncStorage.getItem('token');
    const username = await AsyncStorage.getItem('username');
    const password = await AsyncStorage.getItem('password');
    this.setState({ user: username })
    this.setState({ pass: password })
    this.setState({ key: token })
    // this.setState({response : })
    console.log("load mid")
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", token);
    myHeaders.append("Authorization", "Basic " + base64.encode(username + ':' + password));

    var raw = "{\n\"username\" : \" " + username + "\",\n\"password\" : \" " + password + "\"\n}";
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    console.log("load low")
    let response = await fetch('https://mysqlcs639.cs.wisc.edu/users/' + username, requestOptions)
    let result = await response.json()
    console.log("this..")
    console.log(result);
   // if(JSON.stringify(result.goalDailyActivity === null)){}
   // else{
    await AsyncStorage.setItem('act', JSON.stringify(result.goalDailyActivity));
    await AsyncStorage.setItem('cal', JSON.stringify(result.goalDailyCalories));
    await AsyncStorage.setItem('carb', JSON.stringify(result.goalDailyCarbohydrates));
    await AsyncStorage.setItem('fat', JSON.stringify(result.goalDailyFat));
    await AsyncStorage.setItem('pro', JSON.stringify(result.goalDailyProtein));
    await AsyncStorage.setItem('first', JSON.stringify(result.firstName));
    await AsyncStorage.setItem('last', JSON.stringify(result.lastName));
    // this.setState({res : result})
    // this.setState({act: result.goalDailyActivity})
    //  this.setState({cal: result.goalDailyCalories})
    //  this.setState({carbs: result.goalDailyCarbohydrates})
    //  this.setState({fat: result.goalDailyFat})
    // this.setState({pro: result.goalDailyProtein})
    //constawait AsyncStorage.getItem('username')
   // }
    //const res = await AsyncStorage.getItem('res');
    //console.log(res) 
    // this.setState({res : result})
    // this.setState({act: result.goalDailyActivity})
    //  this.setState({cal: result.goalDailyCalories})
    //  this.setState({carbs: result.goalDailyCarbohydrates})
    //  this.setState({fat: result.goalDailyFat})
    // this.setState({pro: result.goalDailyProtein})



  }
  render() {
    if (this.state.mode === 'welcome') {
      return (
        <View>
          <View style={styles.space}></View>
          <Text style={styles.label}>
            Welcome!
             </Text>
          {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.onLoginPress()}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
          }
          {<TouchableOpacity style={styles.buttonContainerSign} onPress={() => this.onSignUpPress()}>
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>
          }

        </View>
      )

    }
    if (this.state.mode == 'login') {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {/*} <Button buttonStyle={{backgroundColor: '#aaaaaa', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10}} textStyle={{color: '#ffffff'}} text={'Show Modal'} onPress={() => this.showModal()}/>
        <Modal width={300} height={600} show={this.state.showModal} hide={() => this.hideModal()}/> */}
          <Login load={() => this.load()} setToken={() => this.setToken()} profile={() => this.goToProfile()} switch={() => this.onSignUpPress()}></Login>
        </View>
      );
    }
    if (this.state.mode === 'signup') {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {/*} <Button buttonStyle={{backgroundColor: '#aaaaaa', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10}} textStyle={{color: '#ffffff'}} text={'Show Modal'} onPress={() => this.showModal()}/>
        <Modal width={300} height={600} show={this.state.showModal} hide={() => this.hideModal()}/> */}
          <SignUp switch={() => this.onLoginPress()}></SignUp>
        </View>
      )
    }
    if (this.state.mode === 'profile') {

      return (
        <Profile goToWelcome={() => this.goToWelcome()} onEdit={() => this.onEdit()} onUpdate={() => this.onUpdate()}>
        </Profile>
      )
    }

  }
  onEdit() {
    this.setState({ mode2: 'edit' })
  }
  onUpdate() {
    this.setState({ mode2: 'view' })
  }
  showModal() {
    this.setState({ showModal: true });
  }

  hideModal() {
    this.setState({ showModal: false });
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  space: {
    padding: 80
  },
  label: {
    padding: 100,
    fontSize: 30,
    textAlign: 'center'
  },
  input: {
    height: 40,
    width: 335,
    backgroundColor: 'rgba(225,225,225,0.2)',
    marginBottom: 10,
    padding: 10,
    color: '#fff'
  },
  buttonContainer: {
    justifyContent: 'center',
    fontSize: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 100,
    backgroundColor: '#8b0000',
    paddingVertical: 15
  },
  buttonContainerSign: {
    justifyContent: 'center',
    fontSize: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 100,
    backgroundColor: '#e08d3c',
    paddingVertical: 15
  },
  buttonText: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700'
  },
  loginButton: {
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: '#2980b6',
    color: '#fff'
  }

});

export default App;
