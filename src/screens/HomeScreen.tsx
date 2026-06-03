import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import DatabaseService from '../services/DatabaseService';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [stats, setStats] = useState({ total: 0, pending: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
    const unsubscribe = navigation.addListener('focus', loadStats);
    return unsubscribe;
  }, [navigation]);

  const loadStats = async () => {
    const records = await DatabaseService.getUnsyncedRecords();
    setStats({
      total: records.length,
      pending: records.length
    });
  };

  const handleMarkAttendance = () => {
    navigation.navigate('Camera');
  };

  const handleSync = async () => {
    setLoading(true);
    navigation.navigate('Status');
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Datalake Attendance</Text>
        <Text style={styles.subtitle}>Face Liveness Verification</Text>
      </View>

      <Card>
        <Text style={styles.cardTitle}>Offline Records</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Records</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending Sync</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>System Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Model Size:</Text>
          <Text style={styles.infoValue}>15 MB</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Processing Time:</Text>
          <Text style={styles.infoValue}>&lt;1 second</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Liveness Method:</Text>
          <Text style={styles.infoValue}>Blink + Smile</Text>
        </View>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          title="Mark Attendance"
          onPress={handleMarkAttendance}
          type="primary"
        />
        <Button
          title="Sync to Cloud"
          onPress={handleSync}
          type="secondary"
          loading={loading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F2F1'
  },
  header: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1DFDD'
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#323130',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 15,
    color: '#605E5C'
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 16
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statValue: {
    fontSize: 32,
    fontWeight: '600',
    color: '#0078D4',
    marginBottom: 4
  },
  statLabel: {
    fontSize: 14,
    color: '#605E5C'
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E1DFDD'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#323130',
    marginBottom: 16
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  infoLabel: {
    fontSize: 14,
    color: '#605E5C'
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#323130'
  },
  buttonContainer: {
    padding: 24,
    gap: 12
  }
});

export default HomeScreen;
