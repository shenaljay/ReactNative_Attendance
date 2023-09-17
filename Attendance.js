import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, Button, View, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, getDoc, onSnapshot, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from './firebase';

const Attendance = () => {
    const route = useRoute();
    const eventId = route.params?.id;
    const [eventDetails, setEventDetails] = useState(null);
    const [participantListData, setParticipantListData] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const getEventDetails = async () => {
            const eventRef = doc(db, 'events', eventId);
            const eventSnapshot = await getDoc(eventRef);

            if (eventSnapshot.exists()) {
                const eventData = eventSnapshot.data();
                setEventDetails(eventData);
            } else {
                // Handle the case when the document doesn't exist
                console.log('Event not found');
            }
        };

        getEventDetails();
    }, [eventId]);

    useEffect(() => {
        console.log('App started');
        readParticipantsList();

        const unsubscribe = onSnapshot(collection(db, 'participants'), (snapshot) => {
            const listArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name,
            }));
            setParticipantListData(listArray);
        });

        return () => unsubscribe();
    }, []);

    async function readParticipantsList() {
        try {
            const snapshot = await getDocs(collection(db, 'participants'));
            const listArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name,
            }));
            setParticipantListData(listArray);
        } catch (error) {
            console.error("Error reading participants list: ", error);
        }
    }

    const renderItem = ({ item }) => {
        const handleEditParticipant = async (participantId) => {
            try {
                // Find the participant by ID in the participantListData array
                const participant = participantListData.find((item) => item.id === participantId);
                if (participant) {
                    // Create a new document in the "attendance" collection inside the "events" collection
                    const attendanceRef = doc(db, 'events', eventId, 'attendance', participantId);
                    await setDoc(attendanceRef, { participantId, name: participant.name });

                    console.log('Participant added to attendance:', participantId);
                }
            } catch (error) {
                console.error('Error adding participant to attendance:', error);
            }
        };

        return (
            <View style={styles.container}>
                <View style={styles.itemContainer}>
                    <Text style={styles.textL}>{item.name}</Text>
                    <View style={styles.buttonContainer}>
                        <View style={styles.buttonWrapper}>
                            <Button
                                title="Mark"
                                onPress={() => handleEditParticipant(item.id)}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            {eventDetails ? (
                <>
                    <Text style={styles.heading}>{eventDetails.name}</Text>
                    <View style={styles.row}>
                        <Text style={styles.description}>Date:</Text>
                        <Text style={styles.value}>{eventDetails.date}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.description}>Location:</Text>
                        <Text style={styles.value}>{eventDetails.location}</Text>
                    </View>
                </>
            ) : (
                <Text>Loading event...</Text>
            )}

            <View style={styles.flatListContainer}>
                {participantListData.length > 0 ? (
                    <FlatList
                        data={participantListData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />
                ) : (
                    <Text>No participants found.</Text>
                )}
            </View>
            <View style={styles.pressableText}>
                <Pressable title="Home" onPress={() => navigation.navigate("HomePage")}>
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
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    description: {
        flex: 1,
        fontSize: 18,
    },
    value: {
        flex: 1,
        fontSize: 18,
        textAlign: 'right',
    },
    flatListContainer: {
        //flex: 1,
        width: '100%',
        padding: 1,
        marginTop: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        //borderRadius: 10,
        flexDirection: 'row',
        //alignSelf: 'flex-end',
    },

    buttonWrapper: {
        marginLeft: 10,
        //alignSelf: 'flex-end',
    },
    textH: {
        fontSize: 25,
        fontStyle: 'italic'
    },

    textL: {
        fontSize: 14,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    pressableText: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 20,
        padding: 10,
    },
    linkText: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
});

export default Attendance;

//Shenal M Don
//S1498742