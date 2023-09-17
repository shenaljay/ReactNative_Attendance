import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const ParticipantAttendance = ({ route }) => {
  const eventId = route.params?.id;
  const [eventDetails, setEventDetails] = useState(null);
  const [participantListData, setParticipantListData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    if (eventId) {
      const getEventDetails = async () => {
        const eventRef = doc(db, 'events', eventId);
        const eventSnapshot = await getDoc(eventRef);

        if (eventSnapshot.exists()) {
          const eventData = eventSnapshot.data();
          setEventDetails(eventData);
        } else {
          console.log('Event not found');
        }
      };

      getEventDetails();
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId) {
      readParticipantsList();
    }
  }, [eventId]);

  async function readParticipantsList() {
    try {
      const snapshot = await getDocs(collection(db, 'events', eventId, 'attendance'));
      const listArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
      }));
    /*try {
      const snapshot = await doc(db, 'events', eventId, 'subcollection', 'attendance');
      const attendanceSnapshot = await getDoc(attendanceRef);
  
      if (attendanceSnapshot.size > 0) {
        const participantData = attendanceSnapshot.docs.map((doc) => ({
          id: doc.particiid,
          name: doc.data().name,
        }));*/
  
        setParticipantListData(listArray);
      //} else {
        //console.log('Attendance data not found');
      //}
    } catch (error) {
      console.error('Error reading participant list from attendance:', error);
    }
  }

    useEffect(() => {
      async function fetchDocumentCount() {
        try {
          const collectionRef = collection(db, 'events', eventId, 'attendance');
          const querySnapshot = await getDocs(collectionRef);
          
          const count = querySnapshot.size;
          setTotalCount(count);
        } catch (error) {
          console.error('Error fetching document count:', error);
        }
      }
  
      fetchDocumentCount();
    }, []);

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <Text style={styles.textL}>{item.name}</Text>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
          </View>
        </View>
      </View>
    </View>
  );


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
          <View style={styles.row}>
            <Text style={styles.description}>Total Attendance:</Text>
            <Text style={styles.value}>{totalCount}</Text>
          </View>
          <View style={styles.pressableText}>
                <Pressable title="Home" onPress={() => navigation.navigate("Home")}>
                    <Text style={styles.linkText}>Home</Text>
                </Pressable>
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
    width: '100%',
    padding: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonWrapper: {
    marginLeft: 10,
  },
  textL: {
    fontSize: 14,
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  
});

export default ParticipantAttendance;

//Shenal M Don
//S1498742
