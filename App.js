import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFor, setSelectedFor] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let headersList = {
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "x-forwarded-for": "122.161.69.1",
          "x-real-ip": "122.161.69.1",
          "x-eig-origin": "162.241.123.25",
          "sec-fetch-site": "cross-site",
          "x-https": "1",
          "Authorization": "Bearer 560|4e6JibVoospK1KjepUuK6fV5R2ISEA1OaJXqzFf3cb7aac60"
        }

        const response = await fetch("https://bmdublog.com/bbn-finance/api/socialMedia", {
          method: "GET",
          headers: headersList
        });
        const jsonData = await response.json();
        const json = jsonData.data
        setAllData(json);
        const uniqueForData = [...new Set(json.map((item) => item.for))].map((value) => {
          return json.find((item) => item.for === value);
        });
        setData(uniqueForData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleModal = (forValue) => {
    setSelectedFor(forValue);
    setModalVisible(true);
  };

  const colors = [
    '#2ECC71', // First color
    '#3498DB', // Third color
    '#E67E22', // Fourth color
    '#F1C40F', // Fifth color
  ];

  const renderItem = ({ item, index }) => {

    return (
      <View style={styles.item}>
        <Text style={styles.itemText}>{item.for}</Text>
        <TouchableOpacity style={{
          backgroundColor: colors[(index % colors.length) + Math.floor(index / colors.length)],
          paddingHorizontal: 10, padding: 5, borderRadius: 5,
        }}
          onPress={() => handleModal(item.for)}
        >
          <Text style={styles.btnText}>View Profiles</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderModalContent = () => {
    const filteredData = allData.filter((item) => item.for === selectedFor);
    return (
      <View style={{ flexDirection: 'column', gap: 10, }}>
        {filteredData.map((socialMedia, index) => (
          <TouchableOpacity key={socialMedia.id} style={{
            backgroundColor: colors[(index % colors.length) + Math.floor(index / colors.length)],
            paddingHorizontal: 10, padding: 5, borderRadius: 5,
          }}
            onPress={() => Linking.openURL(socialMedia.url)}
          >
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '400' }}>{socialMedia.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.header}>Our Parterns</Text>
      <View style={{ height: 250, width: '100%', backgroundColor: '#FFF', marginTop: 5 }}>
        <Image source={require('./assets/partner.png')} style={{ height: '100%', width: '100%' }} />
      </View>
      <View>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
      {modalVisible &&
        <TouchableOpacity style={{ position: 'absolute', width: '100%', height: '120%', backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}
          onPress={() => setModalVisible(false)}
        >
          <View style={{ backgroundColor: '#FFF', width: '80%', height: 'auto', padding: 20, marginBottom: '50%', borderRadius: 10, }}>
            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '500', marginBottom: 10, }}>{selectedFor} Profile</Text>
            <View
              style={styles.modalContainer}>
              {renderModalContent()}
            </View>
          </View>
        </TouchableOpacity>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignSelf: 'center',
    fontSize: 22,
    fontWeight: '600'
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemText: {
    fontSize: 20,
    fontWeight: '500'
  },
  touchBtn: {
    padding: 5,
    paddingHorizontal: 10,
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
  }
});
