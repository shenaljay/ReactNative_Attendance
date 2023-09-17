import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, onSnapshot} from "firebase/firestore";
import { db } from './firebase/index.js';

const HomeSc = () => {

    const navigation = useNavigation();
  
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

    const handlePress = (event)  => {
      navigation.navigate('Attendance', { id: event });
    }
  
    const renderItem = ({ item }) => (
      <View style={styles.container}>
      <View style={styles.itemContainer}>
          <Text style={styles.textL}>{item.name}</Text>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button
                title="View"
                onPress={() => handlePress(item.id)}
              />
            </View>
          </View>
        </View>
      </View>
    );
  
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
          <View style={{ width: 2 }} />
          <Button
            title="Admin"
            style = {styles.adminButton}
            onPress={() => navigation.navigate("Home")}
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
    scrollView: {
      backgroundColor: 'pink',
      marginHorizontal: 20,
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
  
    buttonContainer: {
      flexDirection: 'row',
    },
  
    buttonWrapper: {
      marginLeft: 10,
    },
    adminButton: {
      backgroundColor: 'yellow'
    }
  });
  
  export default HomeSc;
  
  //Shenal M Don
//S1498742
