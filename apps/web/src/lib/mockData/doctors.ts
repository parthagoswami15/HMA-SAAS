// Mock data for Doctors

export const mockDoctors = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    experience: '12 years',
    qualification: 'MBBS, MD Cardiology',
    rating: 4.8,
    availability: 'Mon-Fri 9AM-5PM',
    consultationFee: 1500,
    image: '/images/doctor-placeholder.jpg',
    department: 'Cardiology',
    phone: '+91-9876543210',
    email: 'sarah.johnson@hospital.com'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Radiology',
    experience: '10 years',
    qualification: 'MBBS, MD Radiology',
    rating: 4.6,
    availability: 'Mon-Sat 8AM-6PM',
    consultationFee: 1200,
    image: '/images/doctor-placeholder.jpg',
    department: 'Radiology',
    phone: '+91-9876543211',
    email: 'michael.chen@hospital.com'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatrics',
    experience: '8 years',
    qualification: 'MBBS, MD Pediatrics',
    rating: 4.9,
    availability: 'Tue-Sat 10AM-4PM',
    consultationFee: 1000,
    image: '/images/doctor-placeholder.jpg',
    department: 'Pediatrics',
    phone: '+91-9876543212',
    email: 'emily.rodriguez@hospital.com'
  }
];

export const mockDoctorSchedules = [
  {
    doctorId: '1',
    date: '2024-01-18',
    timeSlots: [
      { time: '9:00 AM', available: false },
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: true },
      { time: '2:00 PM', available: false },
      { time: '3:00 PM', available: true }
    ]
  },
  {
    doctorId: '2',
    date: '2024-01-18',
    timeSlots: [
      { time: '8:00 AM', available: true },
      { time: '9:00 AM', available: false },
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: true },
      { time: '2:00 PM', available: true }
    ]
  }
];