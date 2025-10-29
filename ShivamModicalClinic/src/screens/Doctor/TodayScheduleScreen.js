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
import { formatTime, isToday } from '../../utils/dateUtils';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../config/theme';

const TodayScheduleScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointments();
      
      // Filter today's appointments
      const todayApts = data.filter(apt => isToday(apt.slot.start));
      
      // Apply secondary filter
      let filtered = todayApts;
      const now = new Date();
      
      if (filter === 'upcoming') {
        filtered = todayApts.filter(apt => 
          new Date(apt.slot.start) > now &&
          ['scheduled', 'confirmed'].includes(apt.status)
        );
      } else if (filter === 'completed') {
        filtered = todayApts.filter(apt => apt.status === 'completed');
      }
      
      // Sort by time
      filtered.sort((a, b) => new Date(a.slot.start) - new Date(b.slot.start));
      
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
      case 'in_progress': return COLORS.warning;
      case 'completed': return COLORS.success;
      case 'cancelled': return COLORS.danger;
      default: return COLORS.textSecondary;
    }
  };

  const isPast = (date) => {
    return new Date(date) < new Date();
  };

  const renderAppointment = ({ item }) => {
    const pastAppointment = isPast(item.slot.start);
    
    return (
      <Card
        onPress={() => navigation.navigate('AppointmentDetail', { id: item._id })}
        style={[styles.appointmentCard, pastAppointment && styles.pastAppointment]}>
        <View style={styles.appointmentHeader}>
          <View style={styles.timeSection}>
            <Text style={[styles.time, pastAppointment && styles.pastText]}>
              {formatTime(item.slot.start)}
            </Text>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          </View>
          
          <View style={styles.appointmentInfo}>
            <Text style={[styles.patientName, pastAppointment && styles.pastText]}>
              {item.patientId?.userId?.name?.display || 'Patient'}
            </Text>
            <Text style={styles.patientNumber}>
              {item.patientId?.patientNumber || 'N/A'}
            </Text>
            
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Ionicons name="medical-outline" size={14} color={COLORS.textSecondary} />
                <Text style={styles.detailText}>{item.reason || 'General'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                <Text style={styles.detailText}>{item.slot.duration} min</Text>
              </View>
            </View>

            {item.symptoms && item.symptoms.length > 0 && (
              <View style={styles.symptomsContainer}>
                <Ionicons name="alert-circle" size={14} color={COLORS.danger} />
                <Text style={styles.symptomsText}>
                  {item.symptoms.slice(0, 3).join(', ')}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.actionsColumn}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {item.status}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} style={{ marginTop: SPACING.sm }} />
          </View>
        </View>
      </Card>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Today's Schedule</Text>
          <Text style={styles.subtitle}>
            {new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {['all', 'upcoming', 'completed'].map((tab) => (
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
            title="No appointments"
            subtitle={filter === 'all' ? 'No appointments scheduled for today' : `No ${filter} appointments`}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
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
  pastAppointment: {
    opacity: 0.7,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeSection: {
    alignItems: 'center',
    marginRight: SPACING.md,
    minWidth: 60,
  },
  time: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  pastText: {
    color: COLORS.textMuted,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  appointmentInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  patientNumber: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  detailText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  symptomsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  symptomsText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.danger,
    marginLeft: SPACING.xs,
  },
  actionsColumn: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    textTransform: 'capitalize',
  },
});

export default TodayScheduleScreen;