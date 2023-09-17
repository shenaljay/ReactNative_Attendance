import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase/index.js';
import { useRoute, useNavigation } from '@react-navigation/native';

const UpdateEvent = () => {
  const route = useRoute(); //navigation hok
  const eventId = route.params?.id; //gettiing id from route
  const [name, setName] = useState(''); //defining variables with usestate hook
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  //const [participants, setParticipants] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    //getting the event details from firestore
    const getEventDetails = async () => {
      try {
        const eventRef = doc(db, 'events', eventId);
        const eventSnapshot = await getDoc(eventRef);

        if (eventSnapshot.exists()) {
          const eventData = eventSnapshot.data();
          setName(eventData.name);
          setDate(eventData.date);
          setLocation(eventData.location);
          //setParticipants(eventData.participants);
        } else {
          console.log('Event not found');
        }
      } catch (error) {
        console.log('Error getting event:', error);
      }
    };

    getEventDetails(); //calling the function
  }, [eventId]);

  const updateEvent = async () => {
    try {
      const eventRef = doc(db, 'events', eventId);
      //updating data in firestore
      await updateDoc(eventRef, {
        name: name,
        date: date,
        location: location,
        //participants: participants
      });
      console.log('Event updated successfully');
      navigation.goBack();
    } catch (error) {
      console.log('Error updating event:', error);
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
    <Text style={styles.description}>Date:</Text>
    <TextInput
      value={date}
      onChangeText={setDate}
      placeholder="Enter date"
      style={styles.input}
    />
  </View>
  <View style={styles.row}>
    <Text style={styles.description}>Location:</Text>
    <TextInput
      value={location}
      onChangeText={setLocation}
      placeholder="Enter location"
      style={styles.input}
    />
  </View>
  <Button title="Update Event" onPress={updateEvent} />
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

export default UpdateEvent;

//Shenal M Don
//S1498742