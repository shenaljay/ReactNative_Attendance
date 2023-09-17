import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, TextInput, Text, Button, View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, getDocs, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from './firebase';



/*let participants = {
    //title: 'Events List',
    counter: 10,
    data1: [{
        id: "1",
        cName: "Shenal",
    },
    {
        id: "2",
        cName: "Don",
    },
    {
        id: "3",
        cName: "Madurawalage",
    },
    {
        id: "4",
        cName: "Harshana",
    },
    {
        id: "5",
        cName: "Shenal",
    },
    {
        id: "6",
        cName: "Don",
    },
    {
        id: "7",
        cName: "Madurawalage",
    },
    {
        id: "8",
        cName: "Harshana",
    }
    ]
};

let completedList = {
    title: 'Task completed',
    data1: []
};
*/


const AddParticipant = () => {
    const [participantName, setParticipantName] = useState('');
    const [participantEmail, setParticiapntEmail] = useState('');
    const [participantListData, setParticipantListData] = useState([]);
    const navigation = useNavigation();

    const handleTextChange = (inputNumber, text) => {
        switch (inputNumber) {
            case 1:
                setParticipantName(text);
                break;
            case 2:
                setParticiapntEmail(text);
                break;
            default:
                break;
        }
    };

    const handleButtonPress = async () => {
        try {
            // Create a new document in the "participants" collection
            const docRef = await addDoc(collection(db, "participants"), {
                name: participantName,
                email: participantEmail,
            });

            console.log("Participant added with ID", docRef.id);

            // Clear the input fields
            setParticipantName('');
            setParticiapntEmail('');
        } catch (e) {
            console.error("Error adding participant: ", e);
        }
    };

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

    async function deleteParticipant(id) {

        await deleteDoc(doc(db, "participants", id));
        readParticipantsList();
        console.log('Participant Deleted');

    };

    const editParticipant = (participant) => {
        navigation.navigate('UpdateParticipant', { id: participant });
    }

    const renderItem = ({ item }) => (
        <View style={styles.container}>
            <View style={styles.itemContainer}>
                <Text style={styles.textL}>{item.name}</Text>
                <View style={styles.buttonContainer}>
                    <View style={styles.buttonWrapper}>
                        <Button
                            title="Edit"
                            onPress={() => editParticipant(item.id)}
                            style={styles.doneButton}
                        />
                    </View>
                    <View style={styles.buttonWrapper}>
                        <Button
                            title="Delete"
                            color={'red'}
                            onPress={() => deleteParticipant(item.id)}
                            style={styles.deleteButton}
                        />
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>

            <View style={styles.row}>
                <Text style={styles.description}>Name:</Text>
                <TextInput
                    style={styles.input}
                    value={participantName}
                    onChangeText={(text) => handleTextChange(1, text)}
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.description}>Email:</Text>
                <TextInput
                    style={styles.input}
                    value={participantEmail}
                    onChangeText={(text) => handleTextChange(2, text)}
                />
            </View>

            <View style={styles.buttonContainer}>
                <Button title="Add Participant" onPress={handleButtonPress} />
            </View>

            <Text style={styles.headingText}>Participants List</Text>
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
        margin: 5,
        //alignItems: 'center',
    },

    textH: {
        fontSize: 25,
        fontStyle: 'italic'
    },

    textL: {
        fontSize: 14,
    },

    headingText: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 30,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    flatListContainer: {
        width: '100%',
        padding: 1,
        marginTop: 10,
        marginBottom: 10,
    },
    description: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
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
        flexDirection: 'row',
        //borderRadius: 10,
        //alignSelf: 'flex-end',
    },
    buttonWrapper: {
        marginLeft: 10,
      },
    pressableText: {
        position: 'absolute',
        //alignSelf: 'flex-end',
        bottom: 20,
        padding: 10,
    },
    linkText: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
    },
    pressableText: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 20,
      },
      linkText: {
        color: 'blue',
        textDecorationLine: 'underline',
      },
});
export default AddParticipant;

//Shenal M Don
//S1498742