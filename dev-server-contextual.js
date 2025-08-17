// KenyaHOA Pro - Development server with user-specific contextual data
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import comprehensive seed data
const comprehensiveSeedData = {
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
    
    'kileleshwa-villas': [
      {
        id: 'SCHED-KV-001',
        title: 'Garden Maintenance',
        type: 'preventive',
        category: 'Landscaping',
        frequency: 'weekly',
        scheduled_date: '2025-08-19T08:00:00Z',
        next_occurrence: '2025-08-26T08:00:00Z',
        location: 'Common Gardens',
        assigned_vendor: 'Green Thumb Services',
        estimated_cost: 8000,
        estimated_duration: 4, // hours
        priority: 'Medium',
        status: 'Scheduled',
        description: 'Weekly garden and landscape maintenance',
        checklist: [
          'Mow grass areas',
          'Trim hedges and bushes',
          'Water flower beds',
          'Remove weeds',
          'Check irrigation systems'
        ],
        notes: 'Focus on entrance areas for best first impression'
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
    ],

    'kileleshwa-villas': [
      {
        id: 'VENDOR-KV-001',
        name: 'Green Thumb Services',
        category: 'Landscaping',
        contact_person: 'Paul Mutua',
        phone: '+254-725-111-222',
        email: 'info@greenthumb.co.ke',
        services: ['Garden Maintenance', 'Tree Care', 'Lawn Services'],
        hourly_rate: 1200,
        rating: 4.4,
        active_contracts: 1,
        last_service: '2025-08-12T08:00:00Z',
        notes: 'Good value for money, reliable schedule'
      }
    ],

    'mombasa-beach': [
      {
        id: 'VENDOR-MB-001',
        name: 'Coastal Construction',
        category: 'Structural',
        contact_person: 'Ahmed Ali',
        phone: '+254-741-333-444',
        email: 'info@coastal-construction.co.ke',  
        services: ['Structural Repairs', 'Seawall Maintenance', 'Construction'],
        hourly_rate: 5000,
        rating: 4.6,
        active_contracts: 2,
        last_service: '2025-08-10T06:00:00Z',
        notes: 'Specialized in coastal construction, experienced with seawalls'
      }
    ]
  }
};

// Store active sessions (in real app this would be JWT token validation)
const activeSessions = new Map();

// Seeded HOA and User Data
const seededData = {
  tenants: {
    'garden-estate': {
      id: 'tenant-001',
      name: 'Garden Estate Homeowners Association',
      slug: 'garden-estate',
      subscription_plan: 'professional',
      location: 'Nairobi, Karen',
      total_properties: 85,
      occupied_properties: 78,
      total_residents: 156,
      monthly_revenue: 425000
    },
    'riverside-towers': {
      id: 'tenant-002', 
      name: 'Riverside Towers Residents Association',
      slug: 'riverside-towers',
      subscription_plan: 'premium',
      location: 'Nairobi, Westlands',
      total_properties: 120,
      occupied_properties: 115,
      total_residents: 287,
      monthly_revenue: 890000
    },
    'kileleshwa-villas': {
      id: 'tenant-003',
      name: 'Kileleshwa Villas Community',
      slug: 'kileleshwa-villas',
      subscription_plan: 'basic',
      location: 'Nairobi, Kileleshwa',
      total_properties: 32,
      occupied_properties: 29,
      total_residents: 67,
      monthly_revenue: 185000
    },
    'mombasa-beach': {
      id: 'tenant-004',
      name: 'Mombasa Beach Resort Owners',
      slug: 'mombasa-beach',
      subscription_plan: 'professional',
      location: 'Mombasa, Nyali',
      total_properties: 64,
      occupied_properties: 58,
      total_residents: 134,
      monthly_revenue: 320000
    }
  },
  
  users: {
    // Garden Estate Users
    'admin.garden@kenyahoa.com': {
      id: 'user-001',
      first_name: 'Sarah',
      last_name: 'Wanjiku',
      email: 'admin.garden@kenyahoa.com',
      role: 'hoa_admin',
      tenant_slug: 'garden-estate',
      unit_number: null
    },
    'manager.garden@kenyahoa.com': {
      id: 'user-002',
      first_name: 'James',
      last_name: 'Mwangi',
      email: 'manager.garden@kenyahoa.com',
      role: 'property_manager',
      tenant_slug: 'garden-estate',
      unit_number: null
    },
    'owner.garden@kenyahoa.com': {
      id: 'user-003',
      first_name: 'Grace',
      last_name: 'Akinyi',
      email: 'owner.garden@kenyahoa.com',
      role: 'resident_owner',
      tenant_slug: 'garden-estate',
      unit_number: 'A-15'
    },
    'tenant.garden@kenyahoa.com': {
      id: 'user-004',
      first_name: 'Peter',
      last_name: 'Kiprotich',
      email: 'tenant.garden@kenyahoa.com',
      role: 'resident_tenant',
      tenant_slug: 'garden-estate',
      unit_number: 'B-22'
    },
    'maintenance.garden@kenyahoa.com': {
      id: 'user-004-m',
      first_name: 'David',
      last_name: 'Mwangi',
      email: 'maintenance.garden@kenyahoa.com',
      role: 'maintenance_manager',
      tenant_slug: 'garden-estate',
      unit_number: null
    },
    
    // Riverside Towers Users
    'admin.riverside@kenyahoa.com': {
      id: 'user-005',
      first_name: 'Michael',
      last_name: 'Ochieng',
      email: 'admin.riverside@kenyahoa.com',
      role: 'hoa_admin',
      tenant_slug: 'riverside-towers',
      unit_number: null
    },
    'finance.riverside@kenyahoa.com': {
      id: 'user-006',
      first_name: 'Catherine',
      last_name: 'Nduta',
      email: 'finance.riverside@kenyahoa.com',
      role: 'finance_manager',
      tenant_slug: 'riverside-towers',
      unit_number: null
    },
    'owner.riverside@kenyahoa.com': {
      id: 'user-007',
      first_name: 'Robert',
      last_name: 'Kamau',
      email: 'owner.riverside@kenyahoa.com',
      role: 'resident_owner',
      tenant_slug: 'riverside-towers',
      unit_number: '15A'
    },
    'maintenance.riverside@kenyahoa.com': {
      id: 'user-007-m',
      first_name: 'Francis',
      last_name: 'Ochieng',
      email: 'maintenance.riverside@kenyahoa.com',
      role: 'maintenance_manager',
      tenant_slug: 'riverside-towers',
      unit_number: null
    },
    
    // Kileleshwa Villas Users
    'admin.kileleshwa@kenyahoa.com': {
      id: 'user-008',
      first_name: 'Mary',
      last_name: 'Njeri',
      email: 'admin.kileleshwa@kenyahoa.com',
      role: 'hoa_admin',
      tenant_slug: 'kileleshwa-villas',
      unit_number: null
    },
    'owner.kileleshwa@kenyahoa.com': {
      id: 'user-009',
      first_name: 'David',
      last_name: 'Mutua',
      email: 'owner.kileleshwa@kenyahoa.com',
      role: 'resident_owner',
      tenant_slug: 'kileleshwa-villas',
      unit_number: 'Villa-7'
    },
    'maintenance.kileleshwa@kenyahoa.com': {
      id: 'user-009-m',
      first_name: 'Joseph',
      last_name: 'Kariuki',
      email: 'maintenance.kileleshwa@kenyahoa.com',
      role: 'maintenance_manager',
      tenant_slug: 'kileleshwa-villas',
      unit_number: null
    },
    
    // Mombasa Beach Users
    'admin.mombasa@kenyahoa.com': {
      id: 'user-010',
      first_name: 'Fatuma',
      last_name: 'Ali',
      email: 'admin.mombasa@kenyahoa.com',
      role: 'hoa_admin',
      tenant_slug: 'mombasa-beach',
      unit_number: null
    },
    'owner.mombasa@kenyahoa.com': {
      id: 'user-011',
      first_name: 'Ahmed',
      last_name: 'Hassan',
      email: 'owner.mombasa@kenyahoa.com',
      role: 'resident_owner',
      tenant_slug: 'mombasa-beach',
      unit_number: 'Beach-12'
    },
    'maintenance.mombasa@kenyahoa.com': {
      id: 'user-011-m',
      first_name: 'Omar',
      last_name: 'Salim',
      email: 'maintenance.mombasa@kenyahoa.com',
      role: 'maintenance_manager',
      tenant_slug: 'mombasa-beach',
      unit_number: null
    },
    
    // Super Admin Users (Platform Level)
    'superadmin@kenyahoa.com': {
      id: 'user-super-001',
      first_name: 'Sarah',
      last_name: 'Kimani',
      email: 'superadmin@kenyahoa.com',
      role: 'super_admin',
      tenant_slug: null, // Super admins are not tied to specific tenants
      unit_number: null
    },
    'platform.admin@kenyahoa.com': {
      id: 'user-super-002',
      first_name: 'James',
      last_name: 'Mutua',
      email: 'platform.admin@kenyahoa.com',
      role: 'super_admin',
      tenant_slug: null,
      unit_number: null
    },
    
    // Demo user (keep for compatibility)
    'demo@example.com': {
      id: 'user-demo',
      first_name: 'Demo',
      last_name: 'User',
      email: 'demo@example.com',
      role: 'hoa_admin',
      tenant_slug: 'garden-estate',
      unit_number: null
    }
  }
};

// Activities by tenant
const tenantActivities = {
  'garden-estate': [
    {
      type: 'payment',
      message: 'Payment received: KES 15,000 for Monthly dues - Unit A-15',
      timestamp: new Date().toISOString(),
      user: 'Grace Akinyi'
    },
    {
      type: 'maintenance',
      message: 'Maintenance completed: Garden irrigation system fixed',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      user: 'James Mwangi'
    },
    {
      type: 'announcement',
      message: 'Community meeting scheduled for Saturday 2PM at clubhouse',
      timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
      user: 'Sarah Wanjiku'
    },
    {
      type: 'resident',
      message: 'New resident registered: Peter Kiprotich - Unit B-22',
      timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
      user: 'Sarah Wanjiku'
    }
  ],
  'riverside-towers': [
    {
      type: 'payment',
      message: 'Payment received: KES 25,000 for Monthly dues - Unit 15A',
      timestamp: new Date().toISOString(),
      user: 'Robert Kamau'
    },
    {
      type: 'maintenance',
      message: 'Elevator maintenance scheduled for next week',
      timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
      user: 'Michael Ochieng'
    },
    {
      type: 'document',
      message: 'Annual budget report published and distributed to residents',
      timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
      user: 'Catherine Nduta'
    },
    {
      type: 'announcement',
      message: 'Swimming pool maintenance scheduled for weekend',
      timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
      user: 'Michael Ochieng'
    }
  ],
  'kileleshwa-villas': [
    {
      type: 'payment',
      message: 'Payment received: KES 12,000 for Monthly dues - Villa-7',
      timestamp: new Date().toISOString(),
      user: 'David Mutua'
    },
    {
      type: 'maintenance',
      message: 'Security gate repairs completed successfully',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      user: 'Mary Njeri'
    },
    {
      type: 'announcement',
      message: 'Quarterly residents meeting this Friday 7PM',
      timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
      user: 'Mary Njeri'
    }
  ],
  'mombasa-beach': [
    {
      type: 'payment',
      message: 'Payment received: KES 18,000 for Monthly dues - Beach-12',
      timestamp: new Date().toISOString(),
      user: 'Ahmed Hassan'
    },
    {
      type: 'maintenance',
      message: 'Beach cleanup and palm tree maintenance completed',
      timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
      user: 'Fatuma Ali'
    },
    {
      type: 'announcement',
      message: 'Beach volleyball tournament this weekend - prizes available!',
      timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
      user: 'Fatuma Ali'
    },
    {
      type: 'resident',
      message: 'New beach access cards issued to all residents',
      timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
      user: 'Fatuma Ali'
    }
  ]
};

// User-specific data for residents
const userSpecificData = {
  'owner.garden@kenyahoa.com': {
    outstanding_payments: [
      { description: 'Monthly HOA Dues - March', amount: 15000, due_date: '2025-03-31' },
      { description: 'Parking Fee - Q1', amount: 3000, due_date: '2025-04-15' }
    ],
    properties: [
      { unit_number: 'A-15', relationship_type: 'Owner', property_type: '3BR Apartment' }
    ]
  },
  'tenant.garden@kenyahoa.com': {
    outstanding_payments: [
      { description: 'Monthly HOA Dues - March', amount: 15000, due_date: '2025-03-31' }
    ],
    properties: [
      { unit_number: 'B-22', relationship_type: 'Tenant', property_type: '2BR Apartment' }
    ]
  },
  'owner.riverside@kenyahoa.com': {
    outstanding_payments: [
      { description: 'Monthly HOA Dues - March', amount: 25000, due_date: '2025-03-31' },
      { description: 'Gym Access Fee', amount: 5000, due_date: '2025-04-10' }
    ],
    properties: [
      { unit_number: '15A', relationship_type: 'Owner', property_type: '4BR Penthouse' }
    ]
  },
  'owner.kileleshwa@kenyahoa.com': {
    outstanding_payments: [
      { description: 'Monthly HOA Dues - March', amount: 12000, due_date: '2025-03-31' }
    ],
    properties: [
      { unit_number: 'Villa-7', relationship_type: 'Owner', property_type: '5BR Villa' }
    ]
  },
  'owner.mombasa@kenyahoa.com': {
    outstanding_payments: [
      { description: 'Monthly HOA Dues - March', amount: 18000, due_date: '2025-03-31' },
      { description: 'Beach Access Fee', amount: 2000, due_date: '2025-04-01' }
    ],
    properties: [
      { unit_number: 'Beach-12', relationship_type: 'Owner', property_type: 'Beachfront Apartment' }
    ]
  }
};

// Simple static file server
const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Handle API routes (mock responses)
  if (req.url.startsWith('/api/')) {
    handleApiRequest(req, res);
    return;
  }
  
  // Handle specific routes
  let filePath;
  
  if (req.url === '/') {
    filePath = path.join(__dirname, 'dist', 'index.html');
  } else if (req.url === '/dashboard' || req.url === '/dashboard/') {
    filePath = path.join(__dirname, 'dist', 'dashboard.html');
  } else if (req.url.startsWith('/static/')) {
    // Serve static files from public directory
    filePath = path.join(__dirname, 'public', req.url);
  } else {
    // Try to serve from dist directory
    filePath = path.join(__dirname, 'dist', req.url);
  }
  
  // If file doesn't exist, default to main page for SPA routing
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'dist', 'index.html');
  }
  
  try {
    const content = fs.readFileSync(filePath);
    const ext = path.extname(filePath);
    const contentType = getContentType(ext);
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (error) {
    res.writeHead(404);
    res.end('Not Found');
  }
});

function handleApiRequest(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Handle POST requests (for login)
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const mockResponse = getMockResponse(req.url, req.method, body, req.headers);
      res.writeHead(mockResponse.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(mockResponse.data));
    });
  } else {
    // Handle GET requests
    const mockResponse = getMockResponse(req.url, req.method, null, req.headers);
    res.writeHead(mockResponse.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mockResponse.data));
  }
}

function getMockResponse(url, method, body = null, headers = {}) {
  // Health check
  if (url === '/api/health') {
    return {
      status: 200,
      data: {
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: 'development',
        database: 'contextual_mock',
        available_hoas: Object.keys(seededData.tenants).length,
        available_users: Object.keys(seededData.users).length,
        active_sessions: activeSessions.size
      }
    };
  }
  
  // Login endpoint with seeded data
  if (url === '/api/auth/login' && method === 'POST') {
    try {
      const loginData = JSON.parse(body);
      const email = loginData.email;
      const password = loginData.password; // In real app, would verify password
      
      const user = seededData.users[email];
      if (user) {
        const tenant = seededData.tenants[user.tenant_slug];
        const token = 'mock-jwt-token-' + Date.now();
        
        // Store session for contextual data
        activeSessions.set(token, {
          user: user,
          tenant: tenant,
          loginTime: new Date().toISOString()
        });
        
        return {
          status: 200,
          data: {
            success: true,
            token: token,
            user: user,
            tenant: tenant,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          }
        };
      } else {
        return {
          status: 401,
          data: {
            success: false,
            message: 'Invalid credentials'
          }
        };
      }
    } catch (error) {
      return {
        status: 400,
        data: {
          success: false,
          message: 'Invalid request format'
        }
      };
    }
  }
  
  // List available accounts endpoint
  if (url === '/api/auth/demo-accounts') {
    // Return direct demo accounts instead of mapping from seededData to avoid undefined errors
    const demoAccounts = [
      {
        name: 'Garden Estate Admin',
        email: 'admin.garden@kenyahoa.com',
        password: 'demo123',
        tenant_slug: 'garden-estate',
        hoa_name: 'Garden Estate Homeowners Association',
        role: 'HOA Admin',
        description: 'Full administrative access to Garden Estate'
      },
      {
        name: 'Riverside Towers Admin', 
        email: 'admin.riverside@kenyahoa.com',
        password: 'demo123',
        tenant_slug: 'riverside-towers',
        hoa_name: 'Riverside Towers Residents Association',
        role: 'HOA Admin',
        description: 'Full administrative access to Riverside Towers'
      },
      {
        name: 'Kileleshwa Villas Admin',
        email: 'admin.kileleshwa@kenyahoa.com', 
        password: 'demo123',
        tenant_slug: 'kileleshwa-villas',
        hoa_name: 'Kileleshwa Villas Community',
        role: 'HOA Admin',
        description: 'Full administrative access to Kileleshwa Villas'
      },
      {
        name: 'Mombasa Beach Admin',
        email: 'admin.mombasa@kenyahoa.com',
        password: 'demo123', 
        tenant_slug: 'mombasa-beach',
        hoa_name: 'Mombasa Beach Resort Owners',
        role: 'HOA Admin',
        description: 'Full administrative access to Mombasa Beach'
      },
      {
        name: 'Garden Estate Maintenance',
        email: 'maintenance.garden@kenyahoa.com',
        password: 'demo123',
        tenant_slug: 'garden-estate',
        hoa_name: 'Garden Estate Homeowners Association',
        role: 'Maintenance Manager',
        description: 'Maintenance management for Garden Estate'
      },
      {
        name: 'Riverside Towers Maintenance',
        email: 'maintenance.riverside@kenyahoa.com',
        password: 'demo123',
        tenant_slug: 'riverside-towers',
        hoa_name: 'Riverside Towers Residents Association', 
        role: 'Maintenance Manager',
        description: 'Maintenance management for Riverside Towers'
      },
      {
        name: 'Garden Estate Resident',
        email: 'owner.garden@kenyahoa.com',
        password: 'demo123',
        tenant_slug: 'garden-estate',
        hoa_name: 'Garden Estate Homeowners Association',
        role: 'Property Owner',
        description: 'Property owner in Garden Estate (Unit A-15)'
      },
      {
        name: 'Riverside Towers Resident', 
        email: 'owner.riverside@kenyahoa.com',
        password: 'demo123',
        tenant_slug: 'riverside-towers',
        hoa_name: 'Riverside Towers Residents Association',
        role: 'Property Owner',
        description: 'Property owner in Riverside Towers (Unit 15A)'
      },
      {
        name: 'Platform Super Admin',
        email: 'superadmin@kenyahoa.com',
        password: 'demo123',
        tenant_slug: null,
        hoa_name: 'Platform Administration',
        role: 'Super Admin',
        description: 'Full platform administration access'
      }
    ];
    
    return {
      status: 200,
      data: {
        success: true,
        accounts: demoAccounts,
        total_accounts: demoAccounts.length,
        message: 'Demo accounts available for testing different roles and HOAs'
      }
    };
  }
  
  // Dashboard stats - dynamic based on authentication
  if (url === '/api/dashboard/stats') {
    const authHeader = headers.authorization;
    let sessionData = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      sessionData = activeSessions.get(token);
    }
    
    // Default to garden-estate if no valid session
    const tenantSlug = sessionData ? sessionData.tenant.slug : 'garden-estate';
    const currentUser = sessionData ? sessionData.user : null;
    
    const tenant = seededData.tenants[tenantSlug];
    const activities = tenantActivities[tenantSlug] || [];
    
    // Add some variance based on HOA
    const maintenanceVariance = {
      'garden-estate': 8,
      'riverside-towers': 12,
      'kileleshwa-villas': 3,
      'mombasa-beach': 5
    };
    
    const paymentVariance = {
      'garden-estate': 3,
      'riverside-towers': 7,
      'kileleshwa-villas': 1,
      'mombasa-beach': 2
    };
    
    return {
      status: 200,
      data: {
        total_properties: tenant.total_properties,
        occupied_properties: tenant.occupied_properties,
        total_residents: tenant.total_residents,
        pending_maintenance: maintenanceVariance[tenantSlug] || 5,
        overdue_payments: paymentVariance[tenantSlug] || 3,
        monthly_revenue: tenant.monthly_revenue,
        recent_activities: activities,
        current_user: currentUser ? {
          name: `${currentUser.first_name} ${currentUser.last_name}`,
          role: currentUser.role,
          unit: currentUser.unit_number
        } : null,
        hoa_context: {
          name: tenant.name,
          location: tenant.location,
          subscription_plan: tenant.subscription_plan
        }
      }
    };
  }
  
  // User-specific data endpoint
  if (url === '/api/dashboard/my-data') {
    const authHeader = headers.authorization;
    let sessionData = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      sessionData = activeSessions.get(token);
    }
    
    if (sessionData && sessionData.user) {
      const userEmail = sessionData.user.email;
      const userData = userSpecificData[userEmail] || {};
      
      return {
        status: 200,
        data: {
          success: true,
          data: userData
        }
      };
    }
    
    return {
      status: 401,
      data: {
        success: false,
        message: 'Unauthorized'
      }
    };
  }
  
  // Resident dashboard endpoint - announcements and resident-specific content
  if (url === '/api/dashboard/resident') {
    const authHeader = headers.authorization;
    let sessionData = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      sessionData = activeSessions.get(token);
    }
    
    // Default to garden-estate if no valid session
    const tenantSlug = sessionData ? sessionData.tenant.slug : 'garden-estate';
    const currentUser = sessionData ? sessionData.user : null;
    
    const tenant = seededData.tenants[tenantSlug];
    const activities = tenantActivities[tenantSlug] || [];
    
    // Filter activities for announcements and community-relevant items
    const announcements = activities.filter(activity => 
      ['announcement', 'resident', 'document'].includes(activity.type)
    );
    
    // Add resident-specific data
    const residentData = {
      announcements: announcements,
      community_events: [
        {
          title: 'Monthly HOA Meeting',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Community Center',
          type: 'meeting'
        },
        {
          title: 'Community BBQ',
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Pool Area',
          type: 'social'
        }
      ],
      my_account: currentUser ? {
        outstanding_balance: 0,
        last_payment: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        next_due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        unit_number: currentUser.unit_number
      } : null,
      hoa_context: {
        name: tenant.name,
        location: tenant.location,
        amenities: ['Pool', 'Gym', 'Community Center', 'Parking'],
        office_hours: 'Mon-Fri 9AM-5PM',
        emergency_contact: '+254-700-000-000'
      }
    };
    
    return {
      status: 200,
      data: residentData
    };
  }
  
  // Maintenance requests endpoint
  if (url === '/api/maintenance/requests') {
    const authHeader = headers.authorization;
    let sessionData = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      sessionData = activeSessions.get(token);
    }
    
    const tenantSlug = sessionData ? sessionData.tenant.slug : 'garden-estate';
    const requests = comprehensiveSeedData.maintenanceRequests[tenantSlug] || [];
    
    return {
      status: 200,
      data: {
        success: true,
        requests: requests,
        total: requests.length,
        by_status: {
          pending: requests.filter(r => r.status === 'Pending').length,
          in_progress: requests.filter(r => r.status === 'In Progress').length,
          completed: requests.filter(r => r.status === 'Completed').length,
          scheduled: requests.filter(r => r.status === 'Scheduled').length
        }
      }
    };
  }

  // Maintenance schedule endpoint
  if (url === '/api/maintenance/schedule') {
    const authHeader = headers.authorization;
    let sessionData = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      sessionData = activeSessions.get(token);
    }
    
    const tenantSlug = sessionData ? sessionData.tenant.slug : 'garden-estate';
    const schedule = comprehensiveSeedData.maintenanceSchedule[tenantSlug] || [];
    const vendors = comprehensiveSeedData.maintenanceVendors[tenantSlug] || [];
    
    // Calculate schedule statistics
    const totalScheduled = schedule.length;
    const thisWeek = schedule.filter(item => {
      const scheduledDate = new Date(item.scheduled_date);
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return scheduledDate >= now && scheduledDate <= weekFromNow;
    }).length;
    
    const thisMonth = schedule.filter(item => {
      const scheduledDate = new Date(item.scheduled_date);
      const now = new Date();
      const monthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      return scheduledDate >= now && scheduledDate <= monthFromNow;
    }).length;
    
    const overdue = schedule.filter(item => {
      const scheduledDate = new Date(item.scheduled_date);
      const now = new Date();
      return scheduledDate < now && item.status === 'Scheduled';
    }).length;
    
    return {
      status: 200,
      data: {
        success: true,
        schedule: schedule,
        vendors: vendors,
        statistics: {
          total_scheduled: totalScheduled,
          this_week: thisWeek,
          this_month: thisMonth,
          overdue: overdue,
          by_category: schedule.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
          }, {}),
          by_frequency: schedule.reduce((acc, item) => {
            acc[item.frequency] = (acc[item.frequency] || 0) + 1;
            return acc;
          }, {}),
          by_status: schedule.reduce((acc, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
          }, {})
        }
      }
    };
  }

  // Financial reports endpoint
  if (url === '/api/financial/reports') {
    const authHeader = headers.authorization;
    let sessionData = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      sessionData = activeSessions.get(token);
    }
    
    const tenantSlug = sessionData ? sessionData.tenant.slug : 'garden-estate';
    const financialData = comprehensiveSeedData.financialData[tenantSlug] || {};
    
    return {
      status: 200,
      data: {
        success: true,
        financial_summary: {
          monthly_revenue: financialData.monthlyRevenue || 0,
          monthly_expenses: financialData.expenses || 0,
          net_income: financialData.netIncome || 0,
          outstanding_dues: financialData.outstandingDues || 0
        },
        recent_payments: financialData.paymentHistory?.slice(0, 10) || [],
        overdue_payments: financialData.overduePayments || [],
        expenses: financialData.expenses || []
      }
    };
  }

  // Payment tracking endpoint
  if (url === '/api/financial/payments') {
    const authHeader = headers.authorization;
    let sessionData = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      sessionData = activeSessions.get(token);
    }
    
    const tenantSlug = sessionData ? sessionData.tenant.slug : 'garden-estate';
    const financialData = comprehensiveSeedData.financialData[tenantSlug] || {};
    
    return {
      status: 200,
      data: {
        success: true,
        payment_history: financialData.paymentHistory || [],
        overdue_payments: financialData.overduePayments || [],
        total_collected: (financialData.paymentHistory || []).reduce((sum, payment) => sum + payment.amount, 0),
        total_overdue: (financialData.overduePayments || []).reduce((sum, payment) => sum + payment.amount, 0)
      }
    };
  }

  // Resident directory endpoint
  if (url === '/api/residents/directory') {
    const authHeader = headers.authorization;
    let sessionData = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      sessionData = activeSessions.get(token);
    }
    
    const tenantSlug = sessionData ? sessionData.tenant.slug : 'garden-estate';
    const residents = comprehensiveSeedData.residentDirectory[tenantSlug] || [];
    
    return {
      status: 200,
      data: {
        success: true,
        residents: residents,
        total_residents: residents.length,
        owners: residents.filter(r => r.role === 'Owner').length,
        tenants: residents.filter(r => r.role === 'Tenant').length,
        occupancy_rate: Math.round((residents.length / (residents.length + 5)) * 100) // Mock calculation
      }
    };
  }

  // Document library endpoint
  if (url === '/api/documents/library') {
    const authHeader = headers.authorization;
    let sessionData = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      sessionData = activeSessions.get(token);
    }
    
    const tenantSlug = sessionData ? sessionData.tenant.slug : 'garden-estate';
    const documents = comprehensiveSeedData.documentLibrary[tenantSlug] || [];
    
    return {
      status: 200,
      data: {
        success: true,
        document_categories: documents,
        total_documents: documents.reduce((sum, category) => sum + category.documents.length, 0)
      }
    };
  }

  // Community events endpoint
  if (url === '/api/community/events') {
    const authHeader = headers.authorization;
    let sessionData = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      sessionData = activeSessions.get(token);
    }
    
    const tenantSlug = sessionData ? sessionData.tenant.slug : 'garden-estate';
    const events = comprehensiveSeedData.communityEvents[tenantSlug] || [];
    
    return {
      status: 200,
      data: {
        success: true,
        upcoming_events: events,
        total_events: events.length
      }
    };
  }

  // User-specific account data for residents
  if (url === '/api/residents/my-account') {
    const authHeader = headers.authorization;
    let sessionData = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      sessionData = activeSessions.get(token);
    }
    
    if (sessionData && sessionData.user) {
      const user = sessionData.user;
      const tenantSlug = sessionData.tenant.slug;
      const financialData = comprehensiveSeedData.financialData[tenantSlug] || {};
      
      // Find user's payment history and account balance
      const userPayments = (financialData.paymentHistory || []).filter(payment => 
        payment.unit === user.unit_number || payment.resident.includes(user.first_name)
      );
      
      const userOverdue = (financialData.overduePayments || []).filter(payment => 
        payment.unit === user.unit_number || payment.resident.includes(user.first_name)
      );
      
      return {
        status: 200,
        data: {
          success: true,
          account_info: {
            unit_number: user.unit_number,
            resident_name: `${user.first_name} ${user.last_name}`,
            role: user.role,
            account_balance: userOverdue.reduce((sum, payment) => sum + payment.amount, 0),
            last_payment: userPayments.length > 0 ? userPayments[0] : null,
            payment_history: userPayments,
            overdue_amounts: userOverdue
          }
        }
      };
    }
    
    return {
      status: 401,
      data: {
        success: false,
        message: 'Unauthorized'
      }
    };
  }

  // SUPER ADMIN API ENDPOINTS
  
  // Platform analytics for super admin
  if (url === '/api/platform/analytics') {
    const authHeader = headers.authorization;
    let sessionData = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      sessionData = activeSessions.get(token);
    }
    
    // Check if user is super admin
    if (!sessionData || sessionData.user.role !== 'super_admin') {
      return {
        status: 403,
        data: {
          success: false,
          message: 'Access denied. Super admin privileges required.'
        }
      };
    }
    
    // Calculate platform-wide analytics
    const allTenants = Object.values(seededData.tenants);
    const totalProperties = allTenants.reduce((sum, tenant) => sum + tenant.total_properties, 0);
    const totalResidents = allTenants.reduce((sum, tenant) => sum + tenant.total_residents, 0);
    const totalRevenue = allTenants.reduce((sum, tenant) => sum + tenant.monthly_revenue, 0);
    const occupancyRate = allTenants.reduce((sum, tenant) => sum + tenant.occupied_properties, 0) / totalProperties * 100;
    
    // Calculate growth metrics (mock data)
    const monthlyGrowth = {
      properties: 8.5, // percentage
      revenue: 12.3,
      users: 15.7,
      hoas: 25.0
    };
    
    // System health metrics
    const systemHealth = {
      database: 'Healthy',
      api_response_time: '245ms',
      uptime: '99.8%',
      active_sessions: activeSessions.size,
      error_rate: '0.2%'
    };
    
    // Top performing HOAs
    const topHoas = allTenants
      .map(tenant => ({
        name: tenant.name,
        slug: tenant.slug,
        revenue: tenant.monthly_revenue,
        properties: tenant.total_properties,
        occupancy_rate: (tenant.occupied_properties / tenant.total_properties * 100).toFixed(1)
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    return {
      status: 200,
      data: {
        success: true,
        platform_overview: {
          total_hoas: allTenants.length,
          active_hoas: allTenants.filter(t => t.occupied_properties > 0).length,
          total_properties: totalProperties,
          total_residents: totalResidents,
          total_revenue: totalRevenue,
          occupancy_rate: Math.round(occupancyRate * 10) / 10,
          monthly_growth: monthlyGrowth
        },
        system_health: systemHealth,
        top_performing_hoas: topHoas,
        revenue_by_month: [
          { month: 'Jan 2025', revenue: totalRevenue * 0.85 },
          { month: 'Feb 2025', revenue: totalRevenue * 0.91 },
          { month: 'Mar 2025', revenue: totalRevenue * 0.96 },
          { month: 'Apr 2025', revenue: totalRevenue * 1.02 },
          { month: 'May 2025', revenue: totalRevenue },
        ],
        user_growth: [
          { month: 'Jan 2025', users: Math.round(totalResidents * 0.75) },
          { month: 'Feb 2025', users: Math.round(totalResidents * 0.82) },
          { month: 'Mar 2025', users: Math.round(totalResidents * 0.88) },
          { month: 'Apr 2025', users: Math.round(totalResidents * 0.94) },
          { month: 'May 2025', users: totalResidents },
        ]
      }
    };
  }
  
  // Platform HOA management
  if (url === '/api/platform/hoas') {
    const authHeader = headers.authorization;
    let sessionData = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      sessionData = activeSessions.get(token);
    }
    
    // Check if user is super admin
    if (!sessionData || sessionData.user.role !== 'super_admin') {
      return {
        status: 403,
        data: {
          success: false,
          message: 'Access denied. Super admin privileges required.'
        }
      };
    }
    
    // Return all HOAs with detailed information
    const hoasWithDetails = Object.values(seededData.tenants).map(tenant => {
      const tenantUsers = Object.values(seededData.users)
        .filter(user => user.tenant_slug === tenant.slug);
      
      return {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        location: tenant.location,
        subscription_plan: tenant.subscription_plan,
        status: tenant.occupied_properties > 0 ? 'Active' : 'Inactive',
        total_properties: tenant.total_properties,
        occupied_properties: tenant.occupied_properties,
        total_residents: tenant.total_residents,
        monthly_revenue: tenant.monthly_revenue,
        occupancy_rate: Math.round((tenant.occupied_properties / tenant.total_properties) * 100),
        total_users: tenantUsers.length,
        admin_users: tenantUsers.filter(u => ['hoa_admin', 'property_manager', 'finance_manager'].includes(u.role)).length,
        created_date: '2024-01-15T10:00:00Z', // Mock data
        last_activity: '2025-08-15T14:30:00Z' // Mock data
      };
    });
    
    return {
      status: 200,
      data: {
        success: true,
        hoas: hoasWithDetails,
        total_hoas: hoasWithDetails.length,
        active_hoas: hoasWithDetails.filter(hoa => hoa.status === 'Active').length,
        subscription_breakdown: {
          basic: hoasWithDetails.filter(hoa => hoa.subscription_plan === 'basic').length,
          professional: hoasWithDetails.filter(hoa => hoa.subscription_plan === 'professional').length,
          premium: hoasWithDetails.filter(hoa => hoa.subscription_plan === 'premium').length
        }
      }
    };
  }
  
  // Platform user management
  if (url === '/api/platform/users') {
    const authHeader = headers.authorization;
    let sessionData = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      sessionData = activeSessions.get(token);
    }
    
    // Check if user is super admin
    if (!sessionData || sessionData.user.role !== 'super_admin') {
      return {
        status: 403,
        data: {
          success: false,
          message: 'Access denied. Super admin privileges required.'
        }
      };
    }
    
    // Return all platform users grouped by HOA and role
    const allUsers = Object.values(seededData.users).map(user => {
      const tenant = user.tenant_slug ? seededData.tenants[user.tenant_slug] : null;
      return {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role,
        hoa_name: tenant ? tenant.name : 'Platform Admin',
        hoa_slug: user.tenant_slug,
        unit_number: user.unit_number,
        status: 'Active', // Mock status
        last_login: '2025-08-14T16:22:00Z', // Mock data
        created_date: '2024-03-10T09:15:00Z' // Mock data
      };
    });
    
    // Group users by role for analytics
    const usersByRole = {
      super_admin: allUsers.filter(u => u.role === 'super_admin').length,
      hoa_admin: allUsers.filter(u => u.role === 'hoa_admin').length,
      property_manager: allUsers.filter(u => u.role === 'property_manager').length,
      finance_manager: allUsers.filter(u => u.role === 'finance_manager').length,
      maintenance_manager: allUsers.filter(u => u.role === 'maintenance_manager').length,
      resident_owner: allUsers.filter(u => u.role === 'resident_owner').length,
      resident_tenant: allUsers.filter(u => u.role === 'resident_tenant').length
    };
    
    return {
      status: 200,
      data: {
        success: true,
        users: allUsers,
        total_users: allUsers.length,
        users_by_role: usersByRole,
        active_users: allUsers.filter(u => u.status === 'Active').length,
        recent_signups: allUsers.slice(-10) // Last 10 users
      }
    };
  }

  // Demo accounts endpoint
  if (url === '/api/auth/demo-accounts') {
    const demoAccounts = [
      {
        name: 'Garden Estate Admin',
        email: 'admin.garden@kenyahoa.com',
        password: 'demo123',
        tenant_slug: 'garden-estate',
        hoa_name: 'Garden Estate Homeowners Association',
        role: 'HOA Admin',
        description: 'Full administrative access to Garden Estate'
      },
      {
        name: 'Riverside Towers Admin', 
        email: 'admin.riverside@kenyahoa.com',
        password: 'demo123',
        tenant_slug: 'riverside-towers',
        hoa_name: 'Riverside Towers Residents Association',
        role: 'HOA Admin',
        description: 'Full administrative access to Riverside Towers'
      },
      {
        name: 'Kileleshwa Villas Admin',
        email: 'admin.kileleshwa@kenyahoa.com', 
        password: 'demo123',
        tenant_slug: 'kileleshwa-villas',
        hoa_name: 'Kileleshwa Villas Community',
        role: 'HOA Admin',
        description: 'Full administrative access to Kileleshwa Villas'
      },
      {
        name: 'Mombasa Beach Admin',
        email: 'admin.mombasa@kenyahoa.com',
        password: 'demo123', 
        tenant_slug: 'mombasa-beach',
        hoa_name: 'Mombasa Beach Resort Owners',
        role: 'HOA Admin',
        description: 'Full administrative access to Mombasa Beach'
      },
      {
        name: 'Garden Estate Maintenance',
        email: 'maintenance.garden@kenyahoa.com',
        password: 'demo123',
        tenant_slug: 'garden-estate',
        hoa_name: 'Garden Estate Homeowners Association',
        role: 'Maintenance Manager',
        description: 'Maintenance management for Garden Estate'
      },
      {
        name: 'Riverside Towers Maintenance',
        email: 'maintenance.riverside@kenyahoa.com',
        password: 'demo123',
        tenant_slug: 'riverside-towers',
        hoa_name: 'Riverside Towers Residents Association', 
        role: 'Maintenance Manager',
        description: 'Maintenance management for Riverside Towers'
      },
      {
        name: 'Garden Estate Resident',
        email: 'owner.garden@kenyahoa.com',
        password: 'demo123',
        tenant_slug: 'garden-estate',
        hoa_name: 'Garden Estate Homeowners Association',
        role: 'Property Owner',
        description: 'Property owner in Garden Estate (Unit A-15)'
      },
      {
        name: 'Riverside Towers Resident', 
        email: 'owner.riverside@kenyahoa.com',
        password: 'demo123',
        tenant_slug: 'riverside-towers',
        hoa_name: 'Riverside Towers Residents Association',
        role: 'Property Owner',
        description: 'Property owner in Riverside Towers (Unit 15A)'
      },
      {
        name: 'Platform Super Admin',
        email: 'superadmin@kenyahoa.com',
        password: 'demo123',
        tenant_slug: null,
        hoa_name: 'Platform Administration',
        role: 'Super Admin',
        description: 'Full platform administration access'
      }
    ];
    
    return {
      status: 200,
      data: {
        success: true,
        accounts: demoAccounts,
        total_accounts: demoAccounts.length,
        message: 'Demo accounts available for testing different roles and HOAs'
      }
    };
  }

  // Default mock response
  return {
    status: 200,
    data: {
      success: true,
      message: 'Mock API response',
      data: []
    }
  };
}

function getContentType(ext) {
  const types = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
  };
  return types[ext] || 'text/plain';
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 KenyaHOA Pro contextual development server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🏠 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`👥 Demo accounts: http://localhost:${PORT}/api/auth/demo-accounts`);
  console.log(`🔐 Contextual data: Users see their own HOA data based on login`);
  console.log('');
  console.log('🏘️ Available HOAs with unique data:');
  Object.values(seededData.tenants).forEach(tenant => {
    console.log(`   - ${tenant.name} (${tenant.location}) - ${tenant.total_properties} units, KES ${tenant.monthly_revenue.toLocaleString()}/month`);
  });
  console.log('');
  console.log('👤 Sample Login Accounts (each shows different HOA data):');
  console.log('   🔑 Garden Estate Admin: admin.garden@kenyahoa.com / password123');
  console.log('   🔑 Riverside Admin: admin.riverside@kenyahoa.com / password123');
  console.log('   🔑 Kileleshwa Admin: admin.kileleshwa@kenyahoa.com / password123');
  console.log('   🔑 Mombasa Admin: admin.mombasa@kenyahoa.com / password123');
  console.log('');
  console.log('📝 API endpoints:');
  console.log('   - POST /api/auth/login (creates session)');
  console.log('   - GET  /api/auth/demo-accounts');
  console.log('   - GET  /api/dashboard/stats (contextual per user)');
  console.log('   - GET  /api/dashboard/my-data (user-specific)');
  console.log('   - GET  /api/health');
});