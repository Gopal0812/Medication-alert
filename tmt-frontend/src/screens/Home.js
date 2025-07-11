import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { responsiveScreenHeight, responsiveScreenWidth } from '../utils/Size';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMedicineData, deleteMedicine } from '../apis/medicationsApis';
import { Swipeable } from 'react-native-gesture-handler';

const HomeScreen = () => {
    const [medications, setMedications] = useState([]);
    console.log(medications, 'this is from medications')
    const [nextMedication, setNextMedication] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [userId, setUserId] = useState(null);
    const [Id, setId] = useState(null)
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserIdAndMeds = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedUserId) {
                    setUserId(storedUserId);
                    const meds = await getMedicineData(storedUserId);
                    const id = meds.length > 0 ? meds[0]._id : null;
                    setId(id)
                    console.log(id)
                    console.log(meds, 'this is from home screen')
                    setMedications(meds);
                    if (meds.length > 0) setNextMedication(meds[0]);
                }
            } catch (error) {
                console.log('Error fetching medications:', error);
            }
        };
        fetchUserIdAndMeds();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            if (userId) {
                const meds = await getMedicineData(userId);
                setMedications(meds);
                meds.length > 0 ? setNextMedication(meds[0]) : 'no data unavaliable';
            }
        } catch (error) {
            console.log('Error refreshing medications:', error);
        }
        setRefreshing(false);
    };


    const renderMedication = ({ item }) => (
        <Swipeable
            renderRightActions={() => renderRightActions(item._id)}
        >
            <View style={styles.medCard}>
                <View>
                    <Text style={styles.medName}>{item.nameOfMedicine}</Text>
                    <Text style={styles.medDetails}>{item.time} - {item.dosage}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Editmedication')}>
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
            </View>
        </Swipeable>
    );

    const handleLogout = () => {
        AsyncStorage.removeItem('token');
        navigation.navigate('Login');
    };

    const handleDelete = async (Id) => {
        try {
            console.log('Deleting medication with ID:', Id);
            await deleteMedicine(Id);

            // Optimistically update UI by removing deleted item
            setMedications((prevMeds) => prevMeds.filter((med) => med._id !== id));

            // Optional: refresh from backend after short delay
            setTimeout(() => {
                onRefresh();
            }, 1000);

        } catch (error) {
            console.error('Error deleting medication:', error);
        }
    };



    const renderRightActions = (id) => (
        <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(id)}
        >
            <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
    );


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
            />
            <Text style={styles.greeting}>Good Morning, Sai 👋</Text>
            <Text style={styles.subHeading}>Here's your medication schedule for today:</Text>

            {nextMedication && (
                <View style={styles.nextMedCard}>
                    <Text style={styles.nextHeading}>Next Medication</Text>
                    <Text style={styles.medName}>{nextMedication.nameOfMedicine}</Text>
                    <Text style={styles.medDetails}>{nextMedication.time} - {nextMedication.dosage}</Text>
                </View>
            )}

            <Text style={styles.todayTitle}>Today's Medications</Text>
            <FlatList
                data={medications}
                keyExtractor={(item) => item._id}
                renderItem={renderMedication}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={{ paddingBottom: 100 }}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('Addmedication')}
            >
                <Text style={styles.addButtonText}>+ Add Medication</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Text style={styles.addButtonText}>Log out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: responsiveScreenWidth(6),
        backgroundColor: '#FDFAF6',
    },
    greeting: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: responsiveScreenHeight(1),
        marginTop: responsiveScreenHeight(4)
    },
    subHeading: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    nextMedCard: {
        backgroundColor: '#e0f2fe',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    nextHeading: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    medName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    medDetails: {
        fontSize: 14,
        color: '#333',
    },
    todayTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    medCard: {
        backgroundColor: '#fff',
        padding: 14,
        width: '95%',
        marginLeft: responsiveScreenWidth(1),
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    editText: {
        color: '#2563eb',
        fontWeight: '600',
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#2563eb',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 5,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#2563eb',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 30,
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: responsiveScreenHeight(1),
    },
    deleteButton: {
        backgroundColor: '#ef4444',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '90%',
        borderRadius: 5
    },
    deleteText: {
        color: '#fff',
        fontWeight: '600',
    },
});
