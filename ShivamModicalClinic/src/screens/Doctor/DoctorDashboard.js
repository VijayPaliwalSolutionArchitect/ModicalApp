import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { statsService, appointmentService } from '../../services/apiService';
import { formatTime, isToday } from '../../utils/dateUtils';
import Card from '../../components/Card';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../../config/theme';

const DoctorDashboard = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    todayTotal: 0,
    todayNew: 0,
    todayOld: 0,
    totalPatients: 0,
    monthlyAppointments: 0,
    upcomingToday: 0
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load doctor stats
      const statsData = await statsService.getDoctorStats();
      setStats(statsData);

      // Load today's appointments
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const appointments = await appointmentService.getAppointments();
      const todayApts = appointments.filter(apt => 
        isToday(apt.slot.start)
      );
      setTodayAppointments(todayApts);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const statsData = [
    { label: "Today's Total", value: stats.todayTotal, icon: 'calendar', color: COLORS.primary },
    { label: 'New Patients', value: stats.todayNew, icon: 'person-add', color: COLORS.success },
    { label: 'Follow-ups', value: stats.todayOld, icon: 'repeat', color: COLORS.info },
    { label: 'Total Patients', value: stats.totalPatients, icon: 'people', color: COLORS.accent },
  ];

  const quickActions = [
    { label: 'Patient List', icon: 'people-outline', route: 'PatientList' },
    { label: 'Today Schedule', icon: 'calendar-outline', route: 'TodaySchedule' },
    { label: 'Add Prescription', icon: 'document-text-outline', route: 'CreatePrescription' },
    { label: 'Notifications', icon: 'notifications-outline', route: 'Notifications' },
  ];

  const StatCard = ({ label, value, icon, color }) => (
    <View style={[styles.statCard, SHADOWS.md]}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const QuickActionButton = ({ label, icon, route }) => (
    <TouchableOpacity
      style={styles.quickAction}
      onPress={() => navigation.navigate(route)}
      activeOpacity={0.7}>
      <View style={[styles.quickActionIcon, SHADOWS.sm]}>
        <Ionicons name={icon} size={24} color={COLORS.primary} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return COLORS.info;
      case 'confirmed': return COLORS.primary;
      case 'in_progress': return COLORS.warning;
      case 'completed': return COLORS.success;
      default: return COLORS.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Header */}
        <LinearGradient
          colors={COLORS.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Good Day,</Text>
              <Text style={styles.userName}>Dr. {user?.name?.last || 'Doctor'}</Text>
              <Text style={styles.specialty}>
                {user?.doctorProfile?.specialties?.[0] || 'Medical Professional'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.surface} />
              {stats.upcomingToday > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{stats.upcomingToday}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <QuickActionButton key={index} {...action} />
            ))}
          </View>
        </View>

        {/* Today's Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TodaySchedule')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {todayAppointments.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No appointments scheduled for today</Text>
            </Card>
          ) : (
            todayAppointments.slice(0, 3).map((apt, index) => (
              <Card 
                key={index}
                onPress={() => navigation.navigate('AppointmentDetail', { id: apt._id })}
                style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <View style={styles.timeContainer}>
                    <Text style={styles.time}>{formatTime(apt.slot.start)}</Text>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(apt.status) }]} />
                  </View>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.patientName}>
                      {apt.patientId?.userId?.name?.display || 'Patient'}
                    </Text>
                    <Text style={styles.reason}>{apt.reason || 'General Consultation'}</Text>
                    {apt.symptoms && apt.symptoms.length > 0 && (
                      <View style={styles.symptomsRow}>
                        <Ionicons name="medical" size={12} color={COLORS.danger} />
                        <Text style={styles.symptoms}>
                          {apt.symptoms.slice(0, 2).join(', ')}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                </View>
              </Card>
            ))
          )}
        </View>

        {/* Performance This Month */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <Card style={styles.performanceCard}>
            <View style={styles.performanceRow}>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceValue}>{stats.monthlyAppointments}</Text>
                <Text style={styles.performanceLabel}>Appointments</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.performanceItem}>
                <Text style={styles.performanceValue}>{stats.totalPatients}</Text>
                <Text style={styles.performanceLabel}>Total Patients</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, SHADOWS.sm]}
          onPress={logout}
          activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: SPACING['2xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: SPACING.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.surface,
    marginTop: SPACING.xs,
  },
  specialty: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: SPACING.xs,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.surface,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  statCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textPrimary,
  },
  seeAll: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.primary,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.lg,
  },
  quickAction: {
    width: '47%',
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  quickActionLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: SPACING['2xl'],
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  appointmentCard: {
    marginBottom: SPACING.md,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  time: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
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
  reason: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  symptomsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symptoms: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.danger,
    marginLeft: SPACING.xs,
  },
  performanceCard: {
    padding: SPACING.xl,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  performanceItem: {
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  performanceLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.border,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.xl,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  logoutText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.danger,
    marginLeft: SPACING.sm,
  },
});

export default DoctorDashboard;