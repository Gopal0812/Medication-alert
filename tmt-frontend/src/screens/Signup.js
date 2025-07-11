import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, SafeAreaView, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from '../utils/Size';
import { signup } from '../apis/authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = ({ navigation }) => {
    // State variables for input fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!email || !password || !name) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }


        setLoading(true);
        const token = await AsyncStorage.getItem('fcmToken')
        const newData = { username: name, email, password, fcmToken: token };

        try {
            await signup(newData);
            Alert.alert('Success', 'Account created successfully!');
            navigation.navigate('Login')
            setEmail('');
            setPassword('');
            setName('');
        } catch (err) {
            // already handled inside signup()
        } finally {
            setLoading(false);
        }
    };



    return (
        <SafeAreaView style={styles.Maincontainer}>
            <StatusBar
                barStyle="light-content"
            />
            <View style={styles.container}>
                <View style={styles.headercontainer}>
                    <Text style={styles.headertext}>SIGN UP</Text>
                </View>
                <View style={styles.fieldscontainer}>
                    <View style={styles.welcometextContainer}>
                        <Text style={styles.welcometext} >Welcome to Take Medicine On Time</Text>
                    </View>
                    <View style={styles.formCard}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Your Name"
                            placeholderTextColor="#888" // Adjust placeholder color for white background
                            keyboardType="default"
                            autoCapitalize="none"
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Your Email"
                            placeholderTextColor="#888" // Adjust placeholder color for white background
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Your Password"
                            placeholderTextColor="#888"
                            secureTextEntry
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                        />
                        <TouchableOpacity style={styles.button} onPress={handleSignup}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: responsiveScreenHeight(7) }}>
                            <View style={{ flex: 1, height: responsiveScreenHeight(0.1), backgroundColor: 'gray' }} />
                            <Text style={{ marginHorizontal: 8, color: 'gray', fontSize: responsiveScreenFontSize(1.7) }}>OR CONTINEU WITH</Text>
                            <View style={{ flex: 1, height: responsiveScreenHeight(0.1), backgroundColor: 'gray' }} />
                        </View>

                        <TouchableOpacity style={styles.googlebutton}>
                            <Text >Sign In with Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginText}>Already have an account? Log in</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </SafeAreaView>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    Maincontainer: {
        display: 'flex',
    },
    container: {
        flexDirection: 'column'
    },
    headercontainer: {
        height: responsiveScreenHeight(20),
        backgroundColor: '#64E2B7',
        padding: responsiveScreenWidth(10),
        justifyContent: "center"
    },
    headertext: {
        fontSize: responsiveScreenFontSize(3),
        fontWeight: 'bold',
        color: 'white'
    },
    fieldscontainer: {
        backgroundColor: 'white',
        height: responsiveScreenHeight(100),
        borderTopLeftRadius: responsiveScreenWidth(8),
        borderTopRightRadius: responsiveScreenWidth(8),
        marginTop: responsiveScreenHeight(-3),
        padding: responsiveScreenWidth(10),
        // justifyContent: "center"
    },
    welcometextContainer: {
        marginBottom: responsiveScreenHeight(2)
    },
    welcometext: {
        fontSize: responsiveScreenFontSize(2.1),
        fontWeight: '500'

    },
    formCard: {
        display: 'flex',
        width: responsiveScreenWidth(80),
        justifyContent: 'center',
        alignItems: "center"
    },
    input: {
        width: '100%',
        height: responsiveScreenHeight(6),
        backgroundColor: '#eee', // Input field background
        borderRadius: 5,
        paddingHorizontal: responsiveScreenWidth(3),
        fontSize: responsiveScreenFontSize(1.8),
        color: '#333', // Input text color
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        width: '100%',
        height: responsiveScreenHeight(6),
        backgroundColor: '#64E2B7', // Match header color for button
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: 'white',
        fontSize: responsiveScreenFontSize(2.2),
        fontWeight: 'bold',
    },
    googlebutton: {
        width: '100%',
        height: responsiveScreenHeight(5),
        backgroundColor: 'white', // Match header color for button
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: responsiveScreenHeight(5),
        marginBottom: responsiveScreenHeight(2),
        borderWidth: 1
    },
    loginText: {
        color: '#666',
        fontSize: responsiveScreenFontSize(1.7),
        textDecorationLine: 'underline',
        marginTop: responsiveScreenHeight(8),
    },

});
