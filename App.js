import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList, Button, Pressable} from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddNewEvent from './AddNewEvent.js';
import AddParticipant from './AddParticipant.js';
//import UpdateEvent from './UpdateEvent.js';
import getEvents from './UpdateEvent.js';
import HomeSc from './HomeSc.js';
import UpdateParticipant from './UpdateParticipant.js';
import Attendance from './Attendance.js';
import ParticipantAttendance from './EventParticipant.js';
import { collection, getDocs, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from './firebase/index.js';
// importing necessary modules and dependencies


const MyEventsList = () => {

  const navigation = useNavigation();
  const handleEventPress = (eventId) => {
    navigation.navigate('EventParticipant', { id: eventId });
  };
  const [eventsList, setEventsList] = useState([]);

  async function readEventsList() {
    const snapshot = await getDocs(collection(db, 'events'));
    const listArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
    setEventsList(listArray);
  }

  useEffect(() => {
    console.log('App started');
    readEventsList();

    const unsubscribe = onSnapshot(collection(db, 'events'), (snapshot) => {
      const listArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setEventsList(listArray);
    });

    return () => unsubscribe();
  }, []);



  const editEvent = (event) => {
    navigation.navigate('UpdateEvent', { id: event });
  }



  async function deleteEvent(id) {
    await deleteDoc(doc(db, "events", id));
    readEventsList();
    console.log('Event Deleted');

  };

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <Pressable onPress={() => handleEventPress(item.id)} style={styles.eventItem}>
          <Text style={{color:'blue', textDecorationLine:'underline'}}>{item.name}</Text>
        </Pressable>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              title="Edit"
              onPress={() => editEvent(item.id)}
              style={styles.doneButton}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="Delete"
              color={'red'}
              onPress={() => deleteEvent(item.id)}
              style={styles.deleteButton}
            />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
        <Button
          title="Add Event"
          onPress={() => navigation.navigate("AddNewEvent")}
        />
        <View style={{ width: 2 }} />
        <Button
          title="Add Participant"
          onPress={() => navigation.navigate("AddParticipant")}
        />
      </View>
      <Text style={styles.headingText}>Events List</Text>
      <View style={{flex: 1}}>
      <FlatList
        data={eventsList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      </View>
    </View>
  );
};



/*let toDoListObject = {
  //title: 'Events List',
  counter: 10,
  data1: [{
    id: "1",
    cName: "Event 1",
  },
  {
    id: "2",
    cName: "Event 2",
  },
  {
    id: "3",
    cName: "Event 3",
  },
  {
    id: "4",
    cName: "Event 4",
  }]
};

let completedList = {
  title: 'Task completed',
  data1: []
};
*/



//function Home({ navigation }) {
//let toDoListData = toDoListObject.data1;
//let compListData = completedList.data1;
//let counter = toDoListObject.counter + 1;


/*return (
  <View style={styles.container}>
    <Text style={styles.headingText}>Events List</Text>
    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
      <Button title="Add Event" onPress={() =>
        navigation.navigate("AddNewEvent")} />
      <View style={{ width: 2 }} />
      <Button title="Add Participant" onPress={() =>
        navigation.navigate("AddParticipant")} />
    </View>
    <View style={{ flex: 1 }}>
      <FlatList
        data={[...toDoListData]}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.textL}> - {item.cName}</Text>
            <View style={styles.buttonContainer}>
              <View style={styles.buttonWrapper}>
                <Button
                  title="Done"
                  onPress={() => handleButtonPress(item)}
                  style={styles.doneButton}
                />
              </View>
              <View style={styles.buttonWrapper}>
                <Button
                  title="Delete"
                  color={'red'}
                  onPress={() => handleDeleteItem(item)}
                  style={styles.deleteButton}
                />
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => `${item.id}_${item.cName}`}
        ListHeaderComponent={() => <Text style={styles.textH}>{toDoListObject.title}</Text>}
      />

    </View>
  </View>
);
}
*/
const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='HomePage'>
        <Stack.Screen name="AddNewEvent" component={AddNewEvent} />
        <Stack.Screen name="Home" component={MyEventsList} />
        <Stack.Screen name="AddParticipant" component={AddParticipant} />
        <Stack.Screen name="UpdateEvent" component={getEvents} />
        <Stack.Screen name="HomePage" component={HomeSc} />
        <Stack.Screen name="Attendance" component={Attendance} />
        <Stack.Screen name="UpdateParticipant" component={UpdateParticipant} />
        <Stack.Screen name="EventParticipant" component={ParticipantAttendance} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


const styles = StyleSheet.create({
  mainContainer: {
    margin: 10,
    flex: 1,
    backgroundColor: 'grey'
  },

  iTContainer: {
    alignItems: 'center',
    backgroundColor: 'grey'
  },
  container: {
    flex: 1,
    padding: 20,
    margin: 5,
    //backgroundColor: 'white',
    //borderWidth: 2
  },
  headingText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  secondaryText: {
    fontSize: 13.5,
    justifyContent: 'center',
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
    paddingHorizontal: 5,
  },

  buttonContainer: {
    flexDirection: 'row',
  },

  buttonWrapper: {
    marginLeft: 10,
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

export default App;


//Shenal M Don
//S1498742