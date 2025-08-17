// KenyaHOA Pro - Comprehensive Seed Data
// This file contains realistic random data for all features

export const comprehensiveSeedData = {
  // Maintenance Requests by Tenant
  maintenanceRequests: {
    'garden-estate': [
      {
        id: 'MAINT-001',
        title: 'Leaking Pipe in Unit A-15',
        description: 'Water pipe under kitchen sink is leaking. Water damage starting to show on cabinet floor.',
        category: 'Plumbing',
        priority: 'High',
        status: 'In Progress',
        unit_number: 'A-15',
        resident_name: 'Grace Akinyi',
        submitted_date: '2025-08-10T09:30:00Z',
        assigned_to: 'James Mwangi',
        estimated_cost: 15000,
        notes: 'Plumber scheduled for tomorrow morning'
      },
      {
        id: 'MAINT-002',
        title: 'Garden Sprinkler System Malfunction',
        description: 'Sprinkler zone 3 not turning on. Garden area near playground is not getting watered.',
        category: 'Landscaping',
        priority: 'Medium',
        status: 'Pending',
        unit_number: 'Common Area',
        resident_name: 'Multiple Residents',
        submitted_date: '2025-08-12T14:20:00Z',
        assigned_to: null,
        estimated_cost: 8500,
        notes: 'Waiting for irrigation specialist availability'
      },
      {
        id: 'MAINT-003',
        title: 'Broken Light in Parking Area B',
        description: 'Street light near parking spaces 15-20 is not working. Safety concern for residents.',
        category: 'Electrical',
        priority: 'Medium',
        status: 'Completed',
        unit_number: 'Parking Area B',
        resident_name: 'Security Team',
        submitted_date: '2025-08-08T18:45:00Z',
        assigned_to: 'James Mwangi',
        estimated_cost: 3200,
        notes: 'Replaced LED bulb and checked electrical connections'
      },
      {
        id: 'MAINT-004',
        title: 'Pool Filter Needs Cleaning',
        description: 'Pool water is becoming cloudy. Filter system needs maintenance and chemical balance check.',
        category: 'Pool Maintenance',
        priority: 'Medium',
        status: 'Scheduled',
        unit_number: 'Pool Area',
        resident_name: 'Pool Committee',
        submitted_date: '2025-08-13T11:15:00Z',
        assigned_to: 'Pool Service Co.',
        estimated_cost: 12000,
        notes: 'Scheduled for Thursday morning maintenance'
      },
      {
        id: 'MAINT-005',
        title: 'AC Unit Making Noise in B-22',
        description: 'Air conditioning unit making loud rattling noise. Possible fan blade issue.',
        category: 'HVAC',
        priority: 'Low',
        status: 'Pending',
        unit_number: 'B-22',
        resident_name: 'Peter Kiprotich',
        submitted_date: '2025-08-14T16:30:00Z',
        assigned_to: null,
        estimated_cost: 7500,
        notes: null
      }
    ],
    
    'riverside-towers': [
      {
        id: 'MAINT-RT-001',
        title: 'Elevator 2 Door Sensor Issue',
        description: 'Elevator doors not closing properly. Sensor seems to be malfunctioning.',
        category: 'Elevator',
        priority: 'High',
        status: 'In Progress',
        unit_number: 'Elevator 2',
        resident_name: 'Multiple Residents',
        submitted_date: '2025-08-11T08:00:00Z',
        assigned_to: 'Otis Elevator Service',
        estimated_cost: 25000,
        notes: 'Technician arriving this afternoon'
      },
      {
        id: 'MAINT-RT-002',
        title: 'Gym Equipment Maintenance',
        description: 'Treadmill #3 belt needs adjustment. Exercise bike handlebars loose.',
        category: 'Amenities',
        priority: 'Medium',
        status: 'Scheduled',
        unit_number: 'Gym',
        resident_name: 'Fitness Committee',
        submitted_date: '2025-08-09T12:45:00Z',
        assigned_to: 'FitTech Services',
        estimated_cost: 18000,
        notes: 'Scheduled for weekend maintenance'
      },
      {
        id: 'MAINT-RT-003',
        title: 'Water Pressure Low in Unit 15A',
        description: 'Water pressure very low in master bathroom shower and kitchen sink.',
        category: 'Plumbing',
        priority: 'Medium',
        status: 'Completed',
        unit_number: '15A',
        resident_name: 'Robert Kamau',
        submitted_date: '2025-08-07T19:20:00Z',
        assigned_to: 'AquaFlow Plumbing',
        estimated_cost: 8200,
        notes: 'Cleaned aerators and checked building pressure. Issue resolved.'
      }
    ],

    'mombasa-beach': [
      {
        id: 'MAINT-MB-001',
        title: 'Beach Access Stairs Repair',
        description: 'Wooden stairs leading to beach are loose and potentially dangerous.',
        category: 'Structural',
        priority: 'High',
        status: 'In Progress',
        unit_number: 'Beach Access',
        resident_name: 'Safety Committee',
        submitted_date: '2025-08-12T07:30:00Z',
        assigned_to: 'Coastal Construction',
        estimated_cost: 45000,
        notes: 'Carpenter assessing damage today'
      },
      {
        id: 'MAINT-MB-002',
        title: 'Seawall Maintenance Required',
        description: 'Minor cracks appearing in seawall near units Beach-10 to Beach-15.',
        category: 'Structural',
        priority: 'Medium',
        status: 'Pending',
        unit_number: 'Beach-12 Area',
        resident_name: 'Ahmed Hassan',
        submitted_date: '2025-08-13T15:10:00Z',
        assigned_to: null,
        estimated_cost: 85000,
        notes: 'Requires structural engineer assessment'
      }
    ]
  },

  // Maintenance Schedule by Tenant
  maintenanceSchedule: {
    'garden-estate': [
      // Preventive Maintenance
      {
        id: 'SCHED-001',
        title: 'Pool Weekly Cleaning',
        type: 'preventive',
        category: 'Pool Maintenance',
        frequency: 'weekly',
        scheduled_date: '2025-08-18T08:00:00Z',
        next_occurrence: '2025-08-25T08:00:00Z',
        location: 'Pool Area',
        assigned_vendor: 'AquaClean Services',
        estimated_cost: 5000,
        estimated_duration: 2, // hours
        priority: 'Medium',
        status: 'Scheduled',
        description: 'Weekly pool cleaning, chemical balance check, and filter maintenance',
        checklist: [
          'Test water chemistry levels',
          'Clean pool surface and walls',
          'Empty skimmer baskets',
          'Backwash filter system',
          'Add chemicals as needed'
        ],
        notes: 'Preferred time: Early morning before residents use pool'
      },
      {
        id: 'SCHED-002',
        title: 'Landscaping Monthly Service',
        type: 'preventive',
        category: 'Landscaping',
        frequency: 'monthly',
        scheduled_date: '2025-08-20T07:00:00Z',
        next_occurrence: '2025-09-20T07:00:00Z',
        location: 'All Common Areas',
        assigned_vendor: 'GreenScape Kenya',
        estimated_cost: 45000,
        estimated_duration: 8, // hours
        priority: 'Medium',
        status: 'Scheduled',
        description: 'Comprehensive landscaping maintenance including lawn care, pruning, and flower bed maintenance',
        checklist: [
          'Mow all grass areas',
          'Edge walkways and borders',
          'Prune trees and shrubs',
          'Weed flower beds',
          'Apply fertilizer as needed',
          'Check irrigation system'
        ],
        notes: 'Complete before 2PM to minimize resident disruption'
      },
      {
        id: 'SCHED-003',
        title: 'Security System Monthly Check',
        type: 'preventive',
        category: 'Security',
        frequency: 'monthly',
        scheduled_date: '2025-08-22T14:00:00Z',
        next_occurrence: '2025-09-22T14:00:00Z',
        location: 'Security Office & Gates',
        assigned_vendor: 'SecureGuard Ltd',
        estimated_cost: 8000,
        estimated_duration: 3, // hours
        priority: 'High',
        status: 'Scheduled',
        description: 'Monthly security system maintenance and testing',
        checklist: [
          'Test all security cameras',
          'Check gate automation systems',
          'Test intercom systems',
          'Verify backup power systems',
          'Update access codes',
          'Check perimeter lighting'
        ],
        notes: 'Coordinate with day shift security team'
      },
      {
        id: 'SCHED-004',
        title: 'Fire Safety Equipment Inspection',
        type: 'preventive',
        category: 'Safety',
        frequency: 'quarterly',
        scheduled_date: '2025-08-30T10:00:00Z',
        next_occurrence: '2025-11-30T10:00:00Z',
        location: 'All Buildings',
        assigned_vendor: 'FireSafe Kenya',
        estimated_cost: 15000,
        estimated_duration: 4, // hours
        priority: 'High',
        status: 'Scheduled',
        description: 'Quarterly fire safety equipment inspection and testing',
        checklist: [
          'Inspect all fire extinguishers',
          'Test smoke detector systems',
          'Check emergency lighting',
          'Verify fire alarm systems',
          'Test emergency exits',
          'Update fire safety signage'
        ],
        notes: 'Required by county fire department regulations'
      },
      {
        id: 'SCHED-005',
        title: 'Playground Safety Inspection',
        type: 'preventive',
        category: 'Amenities',
        frequency: 'monthly',
        scheduled_date: '2025-08-25T09:00:00Z',
        next_occurrence: '2025-09-25T09:00:00Z',
        location: 'Children\'s Playground',
        assigned_vendor: 'Internal - James Mwangi',
        estimated_cost: 2000,
        estimated_duration: 1, // hours
        priority: 'High',
        status: 'Scheduled',
        description: 'Monthly playground equipment safety inspection',
        checklist: [
          'Check all equipment for loose bolts',
          'Inspect swing chains and seats',
          'Test slide safety features',
          'Check ground surface condition',
          'Verify fencing integrity',
          'Remove any hazardous debris'
        ],
        notes: 'Critical for child safety and insurance requirements'
      }
    ],
    
    'riverside-towers': [
      {
        id: 'SCHED-RT-001',
        title: 'Elevator Monthly Maintenance',
        type: 'preventive',
        category: 'Elevator',
        frequency: 'monthly',
        scheduled_date: '2025-08-19T06:00:00Z',
        next_occurrence: '2025-09-19T06:00:00Z',
        location: 'Elevators 1, 2, 3',
        assigned_vendor: 'Otis Elevator Service',
        estimated_cost: 35000,
        estimated_duration: 4, // hours
        priority: 'High',
        status: 'Scheduled',
        description: 'Monthly preventive maintenance for all three elevators',
        checklist: [
          'Lubricate all moving parts',
          'Test emergency systems',
          'Check door sensors',
          'Inspect cables and pulleys',
          'Test backup power systems',
          'Clean and adjust controls'
        ],
        notes: 'Schedule during low-traffic hours (6AM-10AM)'
      },
      {
        id: 'SCHED-RT-002',
        title: 'Gym Equipment Maintenance',
        type: 'preventive',
        category: 'Amenities',
        frequency: 'weekly',
        scheduled_date: '2025-08-17T19:00:00Z',
        next_occurrence: '2025-08-24T19:00:00Z',
        location: 'Fitness Center',
        assigned_vendor: 'FitTech Services',
        estimated_cost: 12000,
        estimated_duration: 3, // hours
        priority: 'Medium',
        status: 'Scheduled',
        description: 'Weekly gym equipment maintenance and safety checks',
        checklist: [
          'Inspect all cardio equipment',
          'Check weight machine cables',
          'Test treadmill emergency stops',
          'Clean and lubricate moving parts',
          'Verify safety locks and pins',
          'Update equipment log books'
        ],
        notes: 'Schedule after 7PM when gym usage is lowest'
      },
      {
        id: 'SCHED-RT-003',
        title: 'HVAC System Quarterly Service',
        type: 'preventive',
        category: 'HVAC',
        frequency: 'quarterly',
        scheduled_date: '2025-09-01T08:00:00Z',
        next_occurrence: '2025-12-01T08:00:00Z',
        location: 'All HVAC Units',
        assigned_vendor: 'CoolAir Kenya',
        estimated_cost: 85000,
        estimated_duration: 8, // hours
        priority: 'High',
        status: 'Scheduled',
        description: 'Quarterly HVAC system maintenance for optimal performance',
        checklist: [
          'Replace air filters',
          'Clean evaporator coils',
          'Check refrigerant levels',
          'Test thermostat calibration',
          'Inspect ductwork',
          'Lubricate motors and fans'
        ],
        notes: 'Schedule over 2 days to minimize resident disruption'
      }
    ],
    
    'mombasa-beach': [
      {
        id: 'SCHED-MB-001',
        title: 'Seawall Inspection',
        type: 'preventive',
        category: 'Structural',
        frequency: 'monthly',
        scheduled_date: '2025-08-20T06:00:00Z',
        next_occurrence: '2025-09-20T06:00:00Z',
        location: 'Beachfront Seawall',
        assigned_vendor: 'Coastal Construction',
        estimated_cost: 25000,
        estimated_duration: 3, // hours
        priority: 'High',
        status: 'Scheduled',
        description: 'Monthly seawall integrity inspection for coastal protection',
        checklist: [
          'Visual inspection for cracks',
          'Check for erosion damage',
          'Test drainage systems',
          'Inspect reinforcement bars',
          'Check joint sealants',
          'Document any changes'
        ],
        notes: 'Best done during low tide for complete inspection'
      },
      {
        id: 'SCHED-MB-002',
        title: 'Beach Access Maintenance',
        type: 'preventive',
        category: 'Amenities',
        frequency: 'weekly',
        scheduled_date: '2025-08-18T07:00:00Z',
        next_occurrence: '2025-08-25T07:00:00Z',
        location: 'Beach Access Walkways',
        assigned_vendor: 'Internal - Maintenance Team',
        estimated_cost: 5000,
        estimated_duration: 2, // hours
        priority: 'Medium',
        status: 'Scheduled',
        description: 'Weekly beach access walkway maintenance and cleaning',
        checklist: [
          'Clean walkway surfaces',
          'Check railing stability',
          'Remove sand accumulation',
          'Inspect steps and handrails',
          'Check lighting fixtures',
          'Clear drainage channels'
        ],
        notes: 'Complete before 9AM when beach usage increases'
      }
    ]
  },

  // Vendors and Service Providers by Tenant
  maintenanceVendors: {
    'garden-estate': [
      {
        id: 'VENDOR-001',
        name: 'AquaClean Services',
        category: 'Pool Maintenance',
        contact_person: 'Samuel Kiprotich',
        phone: '+254-722-123-456',
        email: 'info@aquaclean.co.ke',
        services: ['Pool Cleaning', 'Chemical Balancing', 'Equipment Repair'],
        hourly_rate: 2500,
        rating: 4.8,
        active_contracts: 2,
        last_service: '2025-08-14T08:00:00Z',
        notes: 'Reliable service, always on time'
      },
      {
        id: 'VENDOR-002',
        name: 'GreenScape Kenya',
        category: 'Landscaping',
        contact_person: 'Mary Wanjiru',
        phone: '+254-733-234-567',
        email: 'contact@greenscape.co.ke',
        services: ['Lawn Care', 'Tree Pruning', 'Irrigation', 'Pest Control'],
        hourly_rate: 1500,
        rating: 4.6,
        active_contracts: 1,
        last_service: '2025-08-12T07:00:00Z',
        notes: 'Excellent landscaping work, environmentally conscious'
      },
      {
        id: 'VENDOR-003',
        name: 'Fix-It-Fast Ltd',
        category: 'General Repairs',
        contact_person: 'David Mwangi',
        phone: '+254-711-345-678',
        email: 'repairs@fixitfast.co.ke',
        services: ['Plumbing', 'Electrical', 'Carpentry', 'Painting'],
        hourly_rate: 2000,
        rating: 4.5,
        active_contracts: 0,
        last_service: '2025-08-10T10:00:00Z',
        notes: 'Quick response time, reasonable prices'
      }
    ],
    
    'riverside-towers': [
      {
        id: 'VENDOR-RT-001',
        name: 'Otis Elevator Service',
        category: 'Elevator Maintenance',
        contact_person: 'John Ochieng',
        phone: '+254-720-456-789',
        email: 'service@otis.co.ke',
        services: ['Elevator Maintenance', 'Emergency Repairs', 'Modernization'],
        hourly_rate: 8000,
        rating: 4.9,
        active_contracts: 3,
        last_service: '2025-08-11T06:00:00Z',
        notes: 'Premium service, certified technicians'
      },
      {
        id: 'VENDOR-RT-002',
        name: 'FitTech Services',
        category: 'Gym Equipment',
        contact_person: 'Grace Njeri',
        phone: '+254-734-567-890',
        email: 'info@fittech.co.ke',
        services: ['Equipment Maintenance', 'Repairs', 'Installation'],
        hourly_rate: 3500,
        rating: 4.7,
        active_contracts: 1,
        last_service: '2025-08-09T19:00:00Z',
        notes: 'Specialized in fitness equipment, knowledgeable staff'
      }
    ]
  },

  // Financial Data by Tenant
  financialData: {
    'garden-estate': {
      monthlyRevenue: 425000,
      expenses: 285000,
      netIncome: 140000,
      outstandingDues: 85000,
      paymentHistory: [
        { unit: 'A-15', resident: 'Grace Akinyi', amount: 15000, date: '2025-08-14T10:30:00Z', type: 'Monthly Dues', status: 'Paid' },
        { unit: 'A-12', resident: 'John Macharia', amount: 15000, date: '2025-08-13T14:20:00Z', type: 'Monthly Dues', status: 'Paid' },
        { unit: 'B-22', resident: 'Peter Kiprotich', amount: 12000, date: '2025-08-12T09:15:00Z', type: 'Monthly Dues', status: 'Paid' },
        { unit: 'A-08', resident: 'Mary Wanjiru', amount: 15000, date: '2025-08-11T16:45:00Z', type: 'Monthly Dues', status: 'Paid' },
        { unit: 'C-05', resident: 'David Gitonga', amount: 12000, date: '2025-08-10T11:30:00Z', type: 'Monthly Dues', status: 'Paid' },
        { unit: 'B-18', resident: 'Sarah Muthoni', amount: 18000, date: '2025-08-09T13:20:00Z', type: 'Special Assessment', status: 'Paid' }
      ],
      overduePayments: [
        { unit: 'A-03', resident: 'Michael Kimani', amount: 30000, dueDate: '2025-07-15', daysOverdue: 31, type: 'Monthly Dues' },
        { unit: 'C-11', resident: 'Jane Njoki', amount: 15000, dueDate: '2025-08-01', daysOverdue: 14, type: 'Monthly Dues' },
        { unit: 'B-07', resident: 'Paul Mwai', amount: 12000, dueDate: '2025-08-05', daysOverdue: 10, type: 'Monthly Dues' }
      ],
      expenses: [
        { category: 'Landscaping', amount: 45000, date: '2025-08-12', vendor: 'GreenScape Kenya', description: 'Monthly garden maintenance' },
        { category: 'Security', amount: 85000, date: '2025-08-01', vendor: 'SecureGuard Ltd', description: 'Security services - August' },
        { category: 'Utilities', amount: 32000, date: '2025-08-10', vendor: 'Kenya Power', description: 'Common area electricity' },
        { category: 'Pool Maintenance', amount: 18000, date: '2025-08-08', vendor: 'AquaClean Services', description: 'Pool cleaning and chemicals' },
        { category: 'Repairs', amount: 25000, date: '2025-08-14', vendor: 'Fix-It-Fast Ltd', description: 'Plumbing repairs various units' }
      ]
    },

    'riverside-towers': {
      monthlyRevenue: 890000,
      expenses: 620000,
      netIncome: 270000,
      outstandingDues: 125000,
      paymentHistory: [
        { unit: '15A', resident: 'Robert Kamau', amount: 25000, date: '2025-08-14T11:45:00Z', type: 'Monthly Dues', status: 'Paid' },
        { unit: '12B', resident: 'Alice Wanjiku', amount: 22000, date: '2025-08-13T15:30:00Z', type: 'Monthly Dues', status: 'Paid' },
        { unit: '08C', resident: 'James Ochieng', amount: 28000, date: '2025-08-12T10:20:00Z', type: 'Monthly Dues', status: 'Paid' },
        { unit: '22A', resident: 'Grace Nduta', amount: 25000, date: '2025-08-11T14:15:00Z', type: 'Monthly Dues', status: 'Paid' }
      ],
      overduePayments: [
        { unit: '05B', resident: 'Peter Muturi', amount: 50000, dueDate: '2025-07-10', daysOverdue: 36, type: 'Monthly Dues' },
        { unit: '18C', resident: 'Mary Kamande', amount: 25000, dueDate: '2025-08-01', daysOverdue: 14, type: 'Monthly Dues' },
        { unit: '09A', resident: 'John Mwangi', amount: 22000, dueDate: '2025-08-03', daysOverdue: 12, type: 'Monthly Dues' }
      ],
      expenses: [
        { category: 'Elevator Maintenance', amount: 125000, date: '2025-08-10', vendor: 'Otis Kenya', description: 'Quarterly elevator service' },
        { category: 'Security', amount: 150000, date: '2025-08-01', vendor: 'TowerGuard Security', description: 'Security services - August' },
        { category: 'Gym Equipment', amount: 35000, date: '2025-08-12', vendor: 'FitTech Services', description: 'Equipment maintenance and repair' },
        { category: 'Utilities', amount: 85000, date: '2025-08-08', vendor: 'Kenya Power', description: 'Building electricity and water' }
      ]
    },

    'mombasa-beach': {
      monthlyRevenue: 320000,
      expenses: 245000,
      netIncome: 75000,
      outstandingDues: 45000,
      paymentHistory: [
        { unit: 'Beach-12', resident: 'Ahmed Hassan', amount: 18000, date: '2025-08-13T12:30:00Z', type: 'Monthly Dues', status: 'Paid' },
        { unit: 'Beach-08', resident: 'Fatuma Omar', amount: 16000, date: '2025-08-12T09:45:00Z', type: 'Monthly Dues', status: 'Paid' },
        { unit: 'Beach-15', resident: 'Hassan Ali', amount: 20000, date: '2025-08-11T16:20:00Z', type: 'Monthly Dues', status: 'Paid' }
      ],
      overduePayments: [
        { unit: 'Beach-03', resident: 'Omar Said', amount: 18000, dueDate: '2025-07-25', daysOverdue: 21, type: 'Monthly Dues' },
        { unit: 'Beach-07', resident: 'Amina Kone', amount: 16000, dueDate: '2025-08-01', daysOverdue: 14, type: 'Monthly Dues' }
      ],
      expenses: [
        { category: 'Beach Maintenance', amount: 45000, date: '2025-08-10', vendor: 'Coastal Care Ltd', description: 'Beach cleaning and maintenance' },
        { category: 'Security', amount: 55000, date: '2025-08-01', vendor: 'Coast Security', description: 'Security services - August' },
        { category: 'Seawall Inspection', amount: 25000, date: '2025-08-12', vendor: 'Marine Engineers', description: 'Quarterly seawall inspection' }
      ]
    }
  },

  // Resident Directory by Tenant
  residentDirectory: {
    'garden-estate': [
      { unit: 'A-15', name: 'Grace Akinyi', role: 'Owner', phone: '+254-722-123-456', email: 'grace.akinyi@email.com', moveInDate: '2022-03-15', family: 2 },
      { unit: 'B-22', name: 'Peter Kiprotich', role: 'Tenant', phone: '+254-733-234-567', email: 'peter.k@email.com', moveInDate: '2024-01-10', family: 1 },
      { unit: 'A-12', name: 'John & Mary Macharia', role: 'Owner', phone: '+254-711-345-678', email: 'macharia.family@email.com', moveInDate: '2021-08-20', family: 4 },
      { unit: 'C-05', name: 'David Gitonga', role: 'Owner', phone: '+254-720-456-789', email: 'david.gitonga@email.com', moveInDate: '2023-05-12', family: 3 },
      { unit: 'B-18', name: 'Sarah Muthoni', role: 'Tenant', phone: '+254-734-567-890', email: 'sarah.muthoni@email.com', moveInDate: '2023-11-05', family: 2 },
      { unit: 'A-08', name: 'Mary Wanjiru', role: 'Owner', phone: '+254-712-678-901', email: 'mary.wanjiru@email.com', moveInDate: '2020-12-01', family: 1 },
      { unit: 'C-11', name: 'Jane Njoki', role: 'Tenant', phone: '+254-725-789-012', email: 'jane.njoki@email.com', moveInDate: '2024-02-28', family: 2 },
      { unit: 'A-03', name: 'Michael Kimani', role: 'Owner', phone: '+254-713-890-123', email: 'michael.kimani@email.com', moveInDate: '2022-09-10', family: 3 },
      { unit: 'B-07', name: 'Paul Mwai', role: 'Tenant', phone: '+254-726-901-234', email: 'paul.mwai@email.com', moveInDate: '2023-07-15', family: 1 }
    ],

    'riverside-towers': [
      { unit: '15A', name: 'Robert Kamau', role: 'Owner', phone: '+254-722-111-222', email: 'robert.kamau@email.com', moveInDate: '2021-06-12', family: 2 },
      { unit: '12B', name: 'Alice Wanjiku', role: 'Owner', phone: '+254-733-222-333', email: 'alice.wanjiku@email.com', moveInDate: '2020-04-08', family: 3 },
      { unit: '08C', name: 'James Ochieng', role: 'Tenant', phone: '+254-711-333-444', email: 'james.ochieng@email.com', moveInDate: '2023-01-20', family: 1 },
      { unit: '22A', name: 'Grace Nduta', role: 'Owner', phone: '+254-720-444-555', email: 'grace.nduta@email.com', moveInDate: '2022-11-15', family: 4 },
      { unit: '05B', name: 'Peter Muturi', role: 'Tenant', phone: '+254-734-555-666', email: 'peter.muturi@email.com', moveInDate: '2024-03-01', family: 2 },
      { unit: '18C', name: 'Mary Kamande', role: 'Owner', phone: '+254-712-666-777', email: 'mary.kamande@email.com', moveInDate: '2021-09-25', family: 3 },
      { unit: '09A', name: 'John Mwangi', role: 'Tenant', phone: '+254-725-777-888', email: 'john.mwangi@email.com', moveInDate: '2023-08-10', family: 1 }
    ],

    'mombasa-beach': [
      { unit: 'Beach-12', name: 'Ahmed Hassan', role: 'Owner', phone: '+254-722-333-444', email: 'ahmed.hassan@email.com', moveInDate: '2020-12-10', family: 2 },
      { unit: 'Beach-08', name: 'Fatuma Omar', role: 'Owner', phone: '+254-733-444-555', email: 'fatuma.omar@email.com', moveInDate: '2021-07-18', family: 3 },
      { unit: 'Beach-15', name: 'Hassan Ali', role: 'Tenant', phone: '+254-711-555-666', email: 'hassan.ali@email.com', moveInDate: '2023-02-05', family: 1 },
      { unit: 'Beach-03', name: 'Omar Said', role: 'Owner', phone: '+254-720-666-777', email: 'omar.said@email.com', moveInDate: '2022-04-20', family: 4 },
      { unit: 'Beach-07', name: 'Amina Kone', role: 'Tenant', phone: '+254-734-777-888', email: 'amina.kone@email.com', moveInDate: '2023-10-12', family: 2 }
    ]
  },

  // Document Library by Tenant
  documentLibrary: {
    'garden-estate': [
      {
        category: 'HOA Documents',
        documents: [
          { name: 'Garden Estate Bylaws 2024', type: 'PDF', size: '2.4 MB', date: '2024-01-15', description: 'Updated community bylaws and regulations' },
          { name: 'CC&Rs - Covenants, Conditions & Restrictions', type: 'PDF', size: '3.1 MB', date: '2023-12-01', description: 'Property usage rules and restrictions' },
          { name: 'Architectural Guidelines', type: 'PDF', size: '1.8 MB', date: '2024-03-10', description: 'Home modification and improvement guidelines' },
          { name: 'Community Rules & Regulations', type: 'PDF', size: '1.2 MB', date: '2024-02-20', description: 'Day-to-day community living rules' }
        ]
      },
      {
        category: 'Financial Reports',
        documents: [
          { name: 'Monthly Financial Statement - July 2025', type: 'PDF', size: '890 KB', date: '2025-08-01', description: 'Revenue, expenses, and budget analysis' },
          { name: 'Annual Budget 2025', type: 'PDF', size: '1.5 MB', date: '2024-12-15', description: 'Approved budget for 2025 fiscal year' },
          { name: 'Reserve Fund Report Q2 2025', type: 'PDF', size: '650 KB', date: '2025-07-15', description: 'Reserve fund balance and projections' },
          { name: 'Audit Report 2024', type: 'PDF', size: '2.1 MB', date: '2025-03-01', description: 'Independent financial audit results' }
        ]
      },
      {
        category: 'Forms & Applications',
        documents: [
          { name: 'Maintenance Request Form', type: 'PDF', size: '245 KB', date: '2024-01-01', description: 'Form to report maintenance issues' },
          { name: 'Architectural Modification Request', type: 'PDF', size: '320 KB', date: '2024-01-01', description: 'Request form for home modifications' },
          { name: 'Violation Appeal Form', type: 'PDF', size: '180 KB', date: '2024-01-01', description: 'Appeal process for HOA violations' },
          { name: 'Pool & Amenities Reservation Form', type: 'PDF', size: '290 KB', date: '2024-06-01', description: 'Reserve community amenities' }
        ]
      },
      {
        category: 'Meeting Minutes',
        documents: [
          { name: 'Board Meeting Minutes - August 2025', type: 'PDF', size: '540 KB', date: '2025-08-10', description: 'Monthly board meeting discussion points' },
          { name: 'Annual General Meeting 2025', type: 'PDF', size: '1.2 MB', date: '2025-06-15', description: 'Annual community meeting minutes' },
          { name: 'Special Board Meeting - July 2025', type: 'PDF', size: '380 KB', date: '2025-07-22', description: 'Special meeting regarding pool renovations' }
        ]
      }
    ],

    'riverside-towers': [
      {
        category: 'HOA Documents',
        documents: [
          { name: 'Riverside Towers Bylaws 2024', type: 'PDF', size: '2.8 MB', date: '2024-01-20', description: 'Tower community governance rules' },
          { name: 'High-Rise Safety Regulations', type: 'PDF', size: '1.9 MB', date: '2024-02-15', description: 'Safety protocols for high-rise living' },
          { name: 'Elevator Usage Guidelines', type: 'PDF', size: '750 KB', date: '2024-04-01', description: 'Elevator etiquette and emergency procedures' }
        ]
      },
      {
        category: 'Financial Reports',
        documents: [
          { name: 'Monthly Financial Statement - July 2025', type: 'PDF', size: '920 KB', date: '2025-08-01', description: 'Tower financial performance report' },
          { name: 'Capital Improvement Fund Report', type: 'PDF', size: '1.1 MB', date: '2025-07-20', description: 'Major building improvements funding' },
          { name: 'Utility Cost Analysis Q2 2025', type: 'PDF', size: '680 KB', date: '2025-07-10', description: 'Building-wide utility usage and costs' }
        ]
      }
    ],

    'mombasa-beach': [
      {
        category: 'HOA Documents',
        documents: [
          { name: 'Beach Resort Community Bylaws', type: 'PDF', size: '2.2 MB', date: '2024-01-10', description: 'Coastal community regulations' },
          { name: 'Beach Access & Usage Rules', type: 'PDF', size: '1.1 MB', date: '2024-03-05', description: 'Private beach access guidelines' },
          { name: 'Environmental Protection Guidelines', type: 'PDF', size: '1.6 MB', date: '2024-02-28', description: 'Coastal environmental preservation rules' }
        ]
      },
      {
        category: 'Financial Reports',
        documents: [
          { name: 'Monthly Financial Statement - July 2025', type: 'PDF', size: '780 KB', date: '2025-08-01', description: 'Beach resort financial summary' },
          { name: 'Seawall Maintenance Reserve Fund', type: 'PDF', size: '590 KB', date: '2025-07-15', description: 'Coastal protection infrastructure fund' }
        ]
      }
    ]
  },

  // Community Events by Tenant
  communityEvents: {
    'garden-estate': [
      {
        title: 'Monthly Board Meeting',
        date: '2025-08-20T19:00:00Z',
        location: 'Community Center',
        type: 'Meeting',
        description: 'Monthly HOA board meeting. All residents welcome to attend.',
        rsvp_required: false
      },
      {
        title: 'Community BBQ & Pool Party',
        date: '2025-08-25T15:00:00Z',
        location: 'Pool Area',
        type: 'Social',
        description: 'Family-friendly BBQ event. Bring your favorite side dish!',
        rsvp_required: true
      },
      {
        title: 'Garden Estate Movie Night',
        date: '2025-08-30T20:00:00Z',
        location: 'Community Center',
        type: 'Entertainment',
        description: 'Outdoor movie screening under the stars. Popcorn provided!',
        rsvp_required: false
      }
    ],

    'riverside-towers': [
      {
        title: 'Tower Residents Meeting',
        date: '2025-08-22T18:30:00Z',
        location: 'Sky Lounge - 20th Floor',
        type: 'Meeting',
        description: 'Quarterly residents meeting to discuss building improvements.',
        rsvp_required: true
      },
      {
        title: 'Fitness Challenge Launch',
        date: '2025-08-26T06:00:00Z',
        location: 'Gym - Ground Floor',
        type: 'Fitness',
        description: '30-day fitness challenge. Prizes for participation!',
        rsvp_required: true
      }
    ],

    'mombasa-beach': [
      {
        title: 'Beach Cleanup Day',
        date: '2025-08-24T07:00:00Z',
        location: 'Private Beach',
        type: 'Community Service',
        description: 'Help keep our beach beautiful. Breakfast provided after cleanup.',
        rsvp_required: true
      },
      {
        title: 'Sunset Yoga Session',
        date: '2025-08-27T17:30:00Z',
        location: 'Beach Deck',
        type: 'Wellness',
        description: 'Relaxing yoga session as the sun sets over the ocean.',
        rsvp_required: false
      }
    ]
  }
};

export default comprehensiveSeedData;