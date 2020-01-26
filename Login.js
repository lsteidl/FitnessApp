import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, KeyboardAvoidingView } from 'react-native';
import LoginForm from './LoginForm';


class Login extends React.Component {
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.loginContainer} >
          {<Image resizeMode="contain" style={styles.logo} source={require('./TrackingPoint_logo.png')} />}
        </View>
        <View style={styles.formContainer}>
          <LoginForm load={() => this.props.load()} setToken={() => this.props.setToken()} profile={() => this.props.profile()} switch={() => this.props.switch()} />
        </View>
      </KeyboardAvoidingView>
    )

    return (
      <View>

        <TextInput
          style={{ width: 200, padding: 10, borderTopRightRadius: 5, borderTopLeftRadius: 5, borderBottomRightRadius: 5, borderBottomLeftRadius: 5, height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => onChangeText(text)}
          placeholder="USERNAME"
        />
        <TextInput
          style={{ width: 200, padding: 10, borderTopRightRadius: 5, borderTopLeftRadius: 5, borderBottomRightRadius: 5, borderBottomLeftRadius: 5, height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => onChangeText(text)}
          placeholder="PASSWORD"


        />
        <Button buttonStyle={{ backgroundColor: '#aaaaaa', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10 }} textStyle={{ color: '#ffffff' }} text={'Submit'} onPress={() => this.submitForms()}> </Button>
      </View>


    )
  }

}
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008b8b',
  },
  loginContainer: {

    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    //paddingVertical: 100
  },
  logo: {
    position: 'absolute',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    width: 300,
    height: 100
  },
  title: {
    color: "#FFF",
    marginTop: 120,
    width: 180,
    textAlign: 'center',
    opacity: 0.9
  }
});

export default Login;
