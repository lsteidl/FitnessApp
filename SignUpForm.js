import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Button, StyleSheet, StatusBar } from 'react-native';
import base64 from 'base-64';


// create a component
class SignUpForm extends Component {
  // user login
  async onButtonPress() {
    //  Alert.alert('Username: ' + this.state.username + '..Password: ' + this.state.passWord);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Basic OTExOjkxMQ==");

    var raw = "{\n\"username\" : \"" + this.state.username + "\",\n\"password\" : \"" + this.state.passWord + "\"\n}";

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    let response = await fetch('https://mysqlcs639.cs.wisc.edu/users?911=911', requestOptions)
    let result = await response.json()
    //console.log(result);

    if (result.message === "User created!") {
      Alert.alert('Account Created!')
    }

  };
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      passWord: '',
      token: ''
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.label} >Register New Account</Text>
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
        {<TouchableOpacity style={styles.buttonContainerSign} onPress={() => this.onButtonPress()}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
        }
        <View style={styles.container}>
          <Text style={styles.label}>Already A User?</Text>
          {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.props.switch()}>
            <Text style={styles.buttonText}>Log In Page</Text>
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

//make this component available to the app
export default SignUpForm;