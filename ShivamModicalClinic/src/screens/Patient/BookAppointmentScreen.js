import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { doctorService, appointmentService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../../config/theme';

const BookAppointmentScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Select Doctor, 2: Select Date/Time, 3: Confirm
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [reason, setReason] = useState('');
  const [appointmentType, setAppointmentType] = useState('in_clinic');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && step === 2) {
      loadAvailability();
    }
  }, [selectedDoctor, selectedDate]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      const data = await doctorService.getAvailability(selectedDoctor._id, dateStr);
      setAvailableSlots(data.slots || []);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedSlot) {
      Alert.alert('Error', 'Please select a doctor and time slot');
      return;
    }

    try {
      setSubmitting(true);
      const appointmentData = {
        doctorId: selectedDoctor._id,
        patientId: user.patientProfile.patientId,
        clinicId: selectedDoctor.clinicId,
        type: appointmentType,
        slot: {
          start: selectedSlot.start,
          end: selectedSlot.end,
          duration: 30,
        },
        reason: reason || 'General Consultation',
        consultationFee: selectedDoctor.doctorProfile.consultationFee,
      };

      await appointmentService.createAppointment(appointmentData);
      
      Alert.alert(
        'Success',
        'Appointment booked successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('PatientDashboard'),
          },
        ]
      );
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const renderDoctor = ({ item }) => (
    <Card onPress={() => handleDoctorSelect(item)} style={styles.doctorCard}>
      <View style={styles.doctorHeader}>
        <View style={styles.doctorAvatar}>
          <Ionicons name="person" size={32} color={COLORS.primary} />
        </View>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{item.name.display}</Text>
          <Text style={styles.specialty}>
            {item.doctorProfile.specialties.join(', ')}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={COLORS.warning} />
            <Text style={styles.rating}>
              {item.doctorProfile.rating.toFixed(1)} ({item.doctorProfile.totalReviews})
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.doctorFooter}>
        <Text style={styles.feeLabel}>Consultation Fee:</Text>
        <Text style={styles.feeAmount}>₹{item.doctorProfile.consultationFee}</Text>
      </View>
    </Card>
  );

  const renderTimeSlot = (slot, index) => {
    const isSelected = selectedSlot?.start === slot.start;
    const startTime = new Date(slot.start).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.timeSlot,
          isSelected && styles.timeSlotSelected,
          !slot.available && styles.timeSlotDisabled,
        ]}
        onPress={() => slot.available && handleSlotSelect(slot)}
        disabled={!slot.available}>
        <Text
          style={[
            styles.timeSlotText,
            isSelected && styles.timeSlotTextSelected,
            !slot.available && styles.timeSlotTextDisabled,
          ]}>
          {startTime}
        </Text>
      </TouchableOpacity>
    );
  };

  const generateNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  if (loading && step === 1) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (step > 1 ? setStep(step - 1) : navigation.goBack())}
          style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Book Appointment</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Steps */}
      <View style={styles.progressContainer}>
        {[1, 2, 3].map((s) => (
          <View key={s} style={styles.stepContainer}>
            <View style={[styles.stepCircle, step >= s && styles.stepCircleActive]}>
              <Text style={[styles.stepText, step >= s && styles.stepTextActive]}>
                {s}
              </Text>
            </View>
            {s < 3 && (
              <View style={[styles.stepLine, step > s && styles.stepLineActive]} />
            )}
          </View>
        ))}
      </View>

      {/* Step Content */}
      {step === 1 && (
        <FlatList
          data={doctors}
          renderItem={renderDoctor}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {step === 2 && selectedDoctor && (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Selected Doctor Info */}
          <Card style={styles.selectedDoctorCard}>
            <Text style={styles.sectionTitle}>Selected Doctor</Text>
            <Text style={styles.doctorName}>{selectedDoctor.name.display}</Text>
            <Text style={styles.specialty}>
              {selectedDoctor.doctorProfile.specialties.join(', ')}
            </Text>
          </Card>

          {/* Appointment Type */}
          <Text style={styles.sectionTitle}>Appointment Type</Text>
          <View style={styles.typeContainer}>
            {[
              { value: 'in_clinic', label: 'In-Clinic', icon: 'medical' },
              { value: 'teleconsultation', label: 'Video Call', icon: 'videocam' },
            ].map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeButton,
                  appointmentType === type.value && styles.typeButtonActive,
                ]}
                onPress={() => setAppointmentType(type.value)}>
                <Ionicons
                  name={type.icon}
                  size={24}
                  color={
                    appointmentType === type.value
                      ? COLORS.primary
                      : COLORS.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.typeLabel,
                    appointmentType === type.value && styles.typeLabelActive,
                  ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Date Selection */}
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {generateNextDays().map((date, index) => {
              const isSelected =
                date.toDateString() === selectedDate.toDateString();
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateCard,
                    isSelected && styles.dateCardSelected,
                  ]}
                  onPress={() => setSelectedDate(date)}>
                  <Text
                    style={[
                      styles.dateDay,
                      isSelected && styles.dateDaySelected,
                    ]}>
                    {date.toLocaleDateString('en-IN', { weekday: 'short' })}
                  </Text>
                  <Text
                    style={[
                      styles.dateNumber,
                      isSelected && styles.dateNumberSelected,
                    ]}>
                    {date.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Time Slots */}
          <Text style={styles.sectionTitle}>Available Time Slots</Text>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <View style={styles.slotsGrid}>
              {availableSlots.map((slot, index) => renderTimeSlot(slot, index))}
            </View>
          )}

          {/* Reason */}
          <Text style={styles.sectionTitle}>Reason for Visit (Optional)</Text>
          <Input
            value={reason}
            onChangeText={setReason}
            placeholder="Describe your symptoms or reason"
            multiline
            style={{ height: 100 }}
          />

          <Button
            onPress={() => setStep(3)}
            disabled={!selectedSlot}
            fullWidth
            style={styles.nextButton}>
            Continue
          </Button>
        </ScrollView>
      )}

      {step === 3 && selectedDoctor && selectedSlot && (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.confirmTitle}>Confirm Appointment</Text>
          
          <Card style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Ionicons name="person" size={20} color={COLORS.primary} />
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Doctor</Text>
                <Text style={styles.summaryValue}>{selectedDoctor.name.display}</Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Date</Text>
                <Text style={styles.summaryValue}>
                  {selectedDate.toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <Ionicons name="time" size={20} color={COLORS.primary} />
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Time</Text>
                <Text style={styles.summaryValue}>
                  {new Date(selectedSlot.start).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <Ionicons name="medical" size={20} color={COLORS.primary} />
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Type</Text>
                <Text style={styles.summaryValue}>
                  {appointmentType === 'in_clinic' ? 'In-Clinic' : 'Video Call'}
                </Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <Ionicons name="cash" size={20} color={COLORS.primary} />
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Fee</Text>
                <Text style={styles.summaryValue}>
                  ₹{selectedDoctor.doctorProfile.consultationFee}
                </Text>
              </View>
            </View>
          </Card>

          <Button
            onPress={handleBookAppointment}
            loading={submitting}
            fullWidth
            style={styles.confirmButton}>
            Confirm & Book Appointment
          </Button>
        </ScrollView>
      )}
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING['2xl'],
    marginBottom: SPACING.xl,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
  },
  stepText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textMuted,
  },
  stepTextActive: {
    color: COLORS.surface,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.border,
  },
  stepLineActive: {
    backgroundColor: COLORS.primary,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING['2xl'],
  },
  doctorCard: {
    marginBottom: SPACING.lg,
  },
  doctorHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  doctorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  specialty: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  doctorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  feeLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
  },
  feeAmount: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.primary,
  },
  selectedDoctorCard: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    marginRight: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  typeButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  typeLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  typeLabelActive: {
    color: COLORS.primary,
  },
  dateCard: {
    width: 70,
    padding: SPACING.md,
    marginRight: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  dateCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  dateDay: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  dateDaySelected: {
    color: COLORS.primary,
  },
  dateNumber: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textPrimary,
  },
  dateNumberSelected: {
    color: COLORS.primary,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.lg,
  },
  timeSlot: {
    width: '30%',
    padding: SPACING.md,
    marginRight: '3%',
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timeSlotSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  timeSlotDisabled: {
    opacity: 0.4,
  },
  timeSlotText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
  },
  timeSlotTextSelected: {
    color: COLORS.surface,
  },
  timeSlotTextDisabled: {
    color: COLORS.textMuted,
  },
  nextButton: {
    marginTop: SPACING.lg,
  },
  confirmTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  summaryCard: {
    marginBottom: SPACING.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  summaryInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
  },
  confirmButton: {
    marginTop: SPACING.lg,
  },
});

export default BookAppointmentScreen;