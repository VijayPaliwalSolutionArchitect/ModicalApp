import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { appointmentService } from '../../services/apiService';
import { formatDate, formatTime, getRelativeTime } from '../../utils/dateUtils';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../config/theme';

const AppointmentsScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('upcoming'); // upcoming, past, all

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointments();
      
      // Filter based on selected tab
      const now = new Date();
      let filtered = data;
      
      if (filter === 'upcoming') {
        filtered = data.filter(apt => 
          new Date(apt.slot.start) >= now && 
          ['scheduled', 'confirmed'].includes(apt.status)
        );
      } else if (filter === 'past') {
        filtered = data.filter(apt => 
          new Date(apt.slot.start) < now || 
          ['completed', 'cancelled'].includes(apt.status)
        );
      }
      
      setAppointments(filtered);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAppointments();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return COLORS.info;
      case 'confirmed': return COLORS.primary;
      case 'completed': return COLORS.success;
      case 'cancelled': return COLORS.danger;
      default: return COLORS.textSecondary;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'teleconsultation': return 'videocam';
      case 'home_visit': return 'home';
      default: return 'medical';
    }
  };

  const renderAppointment = ({ item }) => (
    <Card
      onPress={() => navigation.navigate('AppointmentDetail', { id: item._id })}
      style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateDay}>
            {new Date(item.slot.start).getDate()}
          </Text>
          <Text style={styles.dateMonth}>
            {new Date(item.slot.start).toLocaleDateString('en-IN', { month: 'short' })}
          </Text>
        </View>
        
        <View style={styles.appointmentInfo}>
          <Text style={styles.doctorName}>{item.doctorId?.name?.display}</Text>
          <Text style={styles.specialty}>
            {item.doctorId?.doctorProfile?.specialties?.[0] || 'General'}
          </Text>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.timeText}>{formatTime(item.slot.start)}</Text>
          </View>
        </View>

        <View style={styles.appointmentActions}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
          <Ionicons 
            name={getTypeIcon(item.type)} 
            size={24} 
            color={COLORS.primary}
            style={styles.typeIcon}
          />
        </View>
      </View>

      {item.reason && (
        <View style={styles.reasonContainer}>
          <Text style={styles.reasonLabel}>Reason: </Text>
          <Text style={styles.reasonText}>{item.reason}</Text>
        </View>
      )}
    </Card>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Appointments</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('BookAppointment')}>
          <Ionicons name="add-circle" size={32} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {['upcoming', 'past', 'all'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.filterTab,
              filter === tab && styles.filterTabActive,
            ]}
            onPress={() => setFilter(tab)}>
            <Text
              style={[
                styles.filterText,
                filter === tab && styles.filterTextActive,
              ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Appointments List */}
      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title="No appointments found"
            subtitle="Book your first appointment with a doctor"
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textPrimary,
  },
  addButton: {
    padding: SPACING.xs,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  filterTab: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginRight: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.surface,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  appointmentCard: {
    marginBottom: SPACING.lg,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary + '15',
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.md,
  },
  dateDay: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.primary,
  },
  dateMonth: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  specialty: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  appointmentActions: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    textTransform: 'capitalize',
  },
  typeIcon: {
    marginTop: SPACING.xs,
  },
  reasonContainer: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  reasonLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textSecondary,
  },
  reasonText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textPrimary,
  },
});

export default AppointmentsScreen;