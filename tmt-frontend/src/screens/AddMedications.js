import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addMedicine } from '../apis/medicationsApis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const frequencies = ['once', 'daily', 'custom'];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AddMedicationScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [frequency, setFrequency] = useState('daily');
    const [selectedDays, setSelectedDays] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter((d) => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleSubmit = async () => {
        if (!name || !dosage) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }

        const userId = await AsyncStorage.getItem('userId');

        let daysOfWeek = [];
        if (frequency === 'custom') {
            daysOfWeek = selectedDays;
        } else if (frequency === 'daily') {
            daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        } else if (frequency === 'once') {
            // Use the startDate's day as the only day
            daysOfWeek = [startDate.toLocaleString('en-US', { weekday: 'short' })];
        }

        const payload = {
            nameOfMedicine: name,
            dosage,
            time: time.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }),
            frequency,
            daysOfWeek,
            startDate,
            endDate,
            userId: userId,
        };

        try {
            const res = await addMedicine(payload);
            console.log(res._id)
            console.log('Add medicine response:', res);

            Alert.alert('Success', 'Medication added!');
            navigation.navigate('Home');
        } catch (error) {
            console.error('Add medicine error:', error);
            Alert.alert('Error', 'Failed to add medication. Please try again.');
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add Medication</Text>

            <Text style={styles.label}>Medication Name *</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. Paracetamol"
                placeholderTextColor={'gray'}
                value={name}
                onChangeText={(text) => setName(text)}
            />

            <Text style={styles.label}>Dosage *</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. 500mg"
                value={dosage}
                placeholderTextColor={'gray'}
                onChangeText={(text) => setDosage(text)}
            />

            <Text style={styles.label}>Time *</Text>
            <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowTimePicker(true)}
            >
                <Text style={styles.timeText}>
                    {time.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    })}
                </Text>
            </TouchableOpacity>
            {showTimePicker && (
                <DateTimePicker
                    mode="time"
                    value={time}
                    onChange={(e, selectedTime) => {
                        setShowTimePicker(false);
                        if (selectedTime) setTime(selectedTime);
                    }}
                />
            )}

            <Text style={styles.label}>Frequency *</Text>
            <View style={styles.freqRow}>
                {frequencies.map((f) => (
                    <TouchableOpacity
                        key={f}
                        onPress={() => setFrequency(f)}
                        style={[
                            styles.freqOption,
                            frequency === f && styles.freqOptionSelected,
                        ]}
                    >
                        <Text style={{ color: frequency === f ? '#fff' : '#333' }}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {frequency === 'custom' && (
                <>
                    <Text style={styles.label}>Days of the Week</Text>
                    <View style={styles.daysRow}>
                        {days.map((day) => (
                            <TouchableOpacity
                                key={day}
                                style={[
                                    styles.dayBox,
                                    selectedDays.includes(day) && styles.dayBoxSelected,
                                ]}
                                onPress={() => toggleDay(day)}
                            >
                                <Text style={{ color: selectedDays.includes(day) ? '#fff' : '#333' }}>
                                    {day}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            )}

            <Text style={styles.label}>Start Date *</Text>
            <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowStartPicker(true)}
            >
                <Text style={styles.timeText}>
                    {startDate.toDateString()}
                </Text>
            </TouchableOpacity>
            {showStartPicker && (
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={(e, selectedDate) => {
                        setShowStartPicker(false);
                        if (selectedDate) setStartDate(selectedDate);
                    }}
                />
            )}

            <Text style={styles.label}>End Date *</Text>
            <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowEndPicker(true)}
            >
                <Text style={styles.timeText}>
                    {endDate.toDateString()}
                </Text>
            </TouchableOpacity>
            {showEndPicker && (
                <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={(e, selectedDate) => {
                        setShowEndPicker(false);
                        if (selectedDate) setEndDate(selectedDate);
                    }}
                />
            )}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Save Medication</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AddMedicationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FDFAF6',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        marginTop: 12,
        marginBottom: 6,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,

    },
    timeButton: {
        padding: 10,
        backgroundColor: '#e2e8f0',
        borderRadius: 8,
        alignItems: 'center',
    },
    timeText: {
        fontSize: 16,
        fontWeight: '600',
    },
    freqRow: {
        flexDirection: 'row',
        gap: 10,
    },
    freqOption: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        backgroundColor: '#e5e7eb',
        borderRadius: 20,
    },
    freqOptionSelected: {
        backgroundColor: '#2563eb',
    },
    daysRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    dayBox: {
        backgroundColor: '#e2e8f0',
        padding: 10,
        borderRadius: 8,
    },
    dayBoxSelected: {
        backgroundColor: '#2563eb',
    },
    submitButton: {
        marginTop: 24,
        backgroundColor: '#2563eb',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});
