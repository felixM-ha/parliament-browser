import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, Text, List, Avatar, Provider as PaperProvider, ActivityIndicator, Searchbar, Divider } from 'react-native-paper';

const Stack = createStackNavigator();

// --- Welcome Screen ---
function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.center}>
      <Text variant="headlineLarge" style={styles.title}>Ålands Lagting</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>Parliament Browser v1.0</Text>
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('Members')}
        style={styles.button}
        buttonColor="#007AFF"
      >
        Visa Ledamöter
      </Button>
    </View>
  );
}

// --- Members List Screen ---
function MembersScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]); 
  
  useEffect(() => {
    // Fetch members data from API
    fetch('https://api.lagtinget.ax/api/persons.json')
      .then(response => response.json())
      .then(data => {

        console.log("--- API DATA START ---");
        console.log(JSON.stringify(data, null, 2));
        console.log("--- API DATA END ---");

        const sortedData = data.sort((a, b) => (a.last_name || "").localeCompare(b.last_name || ""));
        setMembers(sortedData);
        setFilteredMembers(sortedData); // Initialize filtered members with all data
        setLoading(false);
      })
      .catch(error => console.error('API Error:', error));
  }, []);

  const onSearch = (query) => {
    setSearchQuery(query);
    const filtered = members.filter(member => {
      const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
      return fullName.includes(query.toLowerCase());
    });
    setFilteredMembers(filtered);
  };

  if (loading) {
    return <ActivityIndicator animating={true} size="large" style={styles.center} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Searchbar
        placeholder="Sök efter ledamot..."
        onChangeText={onSearch}
        value={searchQuery}
        style={{ margin: 10 }}
      />

      <Text style={{ marginLeft: 10, marginBottom: 5, color: '#555' }}>
        {filteredMembers.length} ledamöter hittades
      </Text>

      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const cityName = item.city ? item.city.replace(/[0-9]/g, '').trim() : "Åland";
          const imageURL = item.image?.url || item.image;

          return (
            <List.Item
              title={`${item.first_name} ${item.last_name}`}
              description={cityName}
              left={props => (
                <Avatar.Image 
                  {...props} 
                  size={50} 
                  source={{ uri: imageURL }} 
                />
              )}
              onPress={() => navigation.navigate('Details', { member: item })}
            />
          );
        }}
      />
    </View>
  );
}

// --- Member Details Screen ---
function MemberDetailsScreen({ route }) {
  const { member } = route.params;
  const imageUrl = member.image?.url || member.image;
  const cityName = member.city ? member.city.replace(/[0-9]/g, '').trim() : "Åland";
  
  const getStatusText = (stateValue) => {
    const s = String(stateValue);

    if (s=== "1") return "Ordinarie ledamot";
    if (s=== "2") return "Ersättare";
    if (s=== "3") return "Tidigare ledamot";
    return "Ledamot";
  };


  return (
    <View style={styles.center}>
      {imageUrl ? (
        <Avatar.Image size={150} source={{ uri: imageUrl }} style={{ marginBottom: 20 }} />
      ) : (
        <Avatar.Icon size={150} icon="account" style={{ marginBottom: 20 }} />
      )}

      <Text variant="headlineMedium" style={{ marginTop: 20, fontWeight: 'bold' }}>
        {member.name || `${member.first_name} ${member.last_name}`}
      </Text>
      
      <Text variant="titleMedium" style={{ color: '#003366', marginBottom: 20 }}>
        {getStatusText(member.state)}
      </Text>

      <Divider style={{ width: '80%', marginVertical: 10 }} />

      <View style={{ width: '60%' }}>
        <List.Item title="Hemort" description={cityName} left={p => <List.Icon {...p} icon="home" />} />
        <List.Item title="Status" description={getStatusText(member.state)} left={p => <List.Icon {...p} icon="account-check" />} />
        <List.Item title="Adress" description={member.address || 'Ej angiven'} left={p => <List.Icon {...p} icon="map-marker" />} />
        <List.Item title="Född" description={member.birthday || 'Ej angivet'} left={p => <List.Icon {...p} icon="calendar" />} />
      </View>
    </View>
  );
}

// --- Main App Component ---
export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ title: 'Välkommen' }} />
          <Stack.Screen name="Members" component={MembersScreen} options={{ title: 'Ledamöter' }} />
          <Stack.Screen name="Details" component={MemberDetailsScreen} options={{ title: 'Detaljer' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  subtitle: {
    marginBottom: 20,
    color: '#555',
  },
  button: {
    marginTop: 20,
  },
});
