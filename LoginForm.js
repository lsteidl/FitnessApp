import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Button, StyleSheet, StatusBar } from 'react-native';
import base64 from 'base-64';
import { AsyncStorage } from 'react-native';



// create a component
class LoginForm extends Component {
  // user login
  async onButtonPress() {
    this.props.load()
    console.log("onButtonPress - Login Form")
    //Alert.alert('Username: ' + this.state.username + '..Password: ' + this.state.passWord);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Basic " + base64.encode(this.state.username + ':' + this.state.passWord));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    let response = await fetch('https://mysqlcs639.cs.wisc.edu/login', requestOptions)
    let result = await response.json()
    // console.log(result);
    //  console.log(result.token);

    // console.log("line 30")

    console.log("LOGIN")
    console.log(result)
    console.log(result.token)
    console.log(result.message)
    if (result.token === undefined) {
      Alert.alert('Username or Password is incorrect');
    }
    else if (result.message === "User does not exist!") {
      Alert.alert('User does not exist');
    }
    else if (result.message === "Could not verify") {
      Alert.alert('Sign-in failed. Try again.');
    }
    else {
      this.setState({ token: result.token })
      this.props.setToken(result.token)
      await AsyncStorage.setItem('token', result.token);
      await AsyncStorage.setItem('username', this.state.username);
      await AsyncStorage.setItem('password', this.state.passWord);
      this.props.profile();
    }
    // console.log("end")

  };
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      passWord: '',
      token: '',
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          Welcome Back!
             </Text>
        <StatusBar barStyle="light-content" />
        <TextInput style={styles.input}
          onChangeText={(data) => this.setState({ username: data })}
          autoCapitalize="none"
          //onSubmitEditing={() => this.passwordInput.focus()} 
          value={this.state.username}
          autoCorrect={false}
          keyboardType='email-address'
          returnKeyType="next"
          placeholder='Username'
          placeholderTextColor='rgba(225,225,225,0.7)' />

        <TextInput style={styles.input}
          onChangeText={(data) => this.setState({ passWord: data })}
          value={this.state.passWord}
          returnKeyType="go" ref={(input) => this.passwordInput = input}
          placeholder='Password'
          placeholderTextColor='rgba(225,225,225,0.7)'
          secureTextEntry />
        {/*   <Button onPress={onButtonPress} title = 'Login' style={styles.loginButton} /> */}
        {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.onButtonPress()}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
        }
        <View style={styles.container}>
          <Text style={styles.label}>
            New User?
                 </Text>
          {<TouchableOpacity style={styles.buttonContainerSign} onPress={() => this.props.switch()}>
            <Text style={styles.buttonText}>Create Account </Text>
          </TouchableOpacity>
          }
        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  label: {
    fontSize: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 20,
    color: '#fff'

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
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 100,
    backgroundColor: '#8b0000',
    paddingVertical: 15
  },
  buttonContainerSign: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    backgroundColor: '#e08d3c',
    paddingVertical: 15
  },
  buttonText: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
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

//make this component available to the app
export default LoginForm;