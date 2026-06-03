import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import Button from '../components/Button';
import SyncService from '../services/SyncService';

interface StatusScreenProps {
  navigation: any;
}

const StatusScreen: React.FC<StatusScreenProps> = ({ navigation }) => {
  const [syncing, setSyncing] = useState(true);
  const [result, setResult] = useState<{ success: boolean; count: number } | null>(null);

  useEffect(() => {
    performSync();
  }, []);

  const performSync = async () => {
    const syncResult = await SyncService.sync();
    setResult(syncResult);
    setSyncing(false);
  };

  const handleDone = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {syncing ? (
          <>
            <ActivityIndicator size="large" color="#0078D4" />
            <Text style={styles.title}>Syncing Records</Text>
            <Text style={styles.subtitle}>Please wait while data syncs to cloud</Text>
          </>
        ) : result ? (
          <>
            <Text style={result.success ? styles.iconSuccess : styles.iconError}>
              {result.success ? '✓' : '✗'}
            </Text>
            <Text style={styles.title}>
              {result.success ? 'Sync Complete' : 'Sync Failed'}
            </Text>
            <Text style={styles.subtitle}>
              {result.success 
                ? `${result.count} records synced to AWS` 
                : 'Unable to connect to server'}
            </Text>
          </>
        ) : null}
      </View>
      
      {!syncing && (
        <View style={styles.buttonContainer}>
          <Button title="Done" onPress={handleDone} type="primary" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F2F1',
    justifyContent: 'center',
    padding: 24
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  iconSuccess: {
    fontSize: 64,
    color: '#107C10',
    marginBottom: 16
  },
  iconError: {
    fontSize: 64,
    color: '#D13438',
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#323130',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 15,
    color: '#605E5C',
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop: 24
  }
});

export default StatusScreen;
