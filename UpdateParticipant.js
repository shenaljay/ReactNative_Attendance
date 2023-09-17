import React, { useEffect, useState } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native';
import { StyleSheet, TextInput, Text, Button, View } from 'react-native';
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from './firebase';

const UpdateParticipant = () => {
    const route = useRoute(); //navigation hook
    const participantId = route.params?.id; //gettiing id from route
    const [name, setName] = useState(''); //defining variables with usestate hook
    const [email, setEmail] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        //getting the event details from firestore
        const getParticipantDetails = async () => {
            try {
                const participantRef = doc(db, 'participants', participantId);
                const participantSnapshot = await getDoc(participantRef);

                if (participantSnapshot.exists()) {
                    const participantData = participantSnapshot.data();
                    setName(participantData.name);
                    setEmail(participantData.email);
                } else {
                    console.log('Participant not found');
                }
            } catch (error) {
                console.log('Error getting Participant:', error);
            }
        };

        getParticipantDetails(); //calling the function
    }, [participantId]);

    const updateParticipant = async () => {
        try {
            const Participant = doc(db, 'participants', participantId);
            //updating data in firestore
            await updateDoc(Participant, {
                name: name,
                email: email,
            });
            console.log('Participant updated successfully');
            navigation.goBack();
        } catch (error) {
            console.log('Error updating participant:', error);
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.description}>Name:</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter name"
                    style={styles.input}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.description}>Email:</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter date"
                    style={styles.input}
                />
            </View>
            <Button title="Update Event" onPress={updateParticipant} />
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
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
});

export default UpdateParticipant;

//Shenal M Don
//S1498742