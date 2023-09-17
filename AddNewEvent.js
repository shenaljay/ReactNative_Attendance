import React, { useState } from 'react'
import { Pressable, StyleSheet, TextInput, Text, Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from './firebase';
import { collection, addDoc } from "firebase/firestore";



const AddNewEvent = () => {
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const navigation = useNavigation();
    //const [eventParticipants, setEventParticipants] = useState('');

    const handleTextChange = (inputNumber, text) => {
        switch (inputNumber) {
            case 1:
                setEventTitle(text);
                break;
            case 2:
                setEventDate(text);
                break;
            case 3:
                setEventLocation(text);
                break;
           // case 4:
                //setEventParticipants(text);
                //break;
            default:
                break;
        };
    };

    

    const handleAddEvent = async () => {
        try {
            // Create a new document in the "participants" collection
            const docRef = await addDoc(collection(db, "events"), {
                name: eventTitle,
                date: eventDate,
                location: eventLocation,
                //participants: eventParticipants,
            });

            console.log("Event added with ID", docRef.id);

            // Clear the input fields
            setEventTitle('');
            setEventDate('');
            setEventLocation('');
            //setEventParticipants('');
            navigation.goBack();
        } catch (e) {
            console.error("Error adding event: ", e);
        }
    };

    return (
        <View style={styles.container}>

            <View style={styles.row}>
                <Text style={styles.description}>Title:</Text>
                <TextInput
                    style={styles.input}
                    value={eventTitle}
                    onChangeText={(text) => handleTextChange(1, text)}
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.description}>Date:</Text>
                <TextInput
                    style={styles.input}
                    value={eventDate}
                    onChangeText={(text) => handleTextChange(2, text)}
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.description}>Location:</Text>
                <TextInput
                    style={styles.input}
                    value={eventLocation}
                    onChangeText={(text) => handleTextChange(3, text)}
                />

            </View>

            <View style={styles.buttonContainer}>
                <Button title="Add Event" onPress={handleAddEvent} />
            </View>

            <View style={styles.pressableText}>
                <Pressable title="Home" onPress={() => navigation.navigate("Home")}>
                    <Text style={styles.linkText}>Home</Text>
                </Pressable>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        //justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    description: {
        flex: 1,
        fontSize: 18,
        marginRight: 2,
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        borderRadius: 10,
        alignSelf: 'flex-end',
    },
    pressableText: {
        position: 'absolute',
        //alignSelf: 'flex-end',
        bottom: 20,
    },
    linkText: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
});

export default AddNewEvent;
