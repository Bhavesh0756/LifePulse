/**
 * LifePulse Landing Page Data Model
 * Demonstration data structured for landing page visualization.
 */

export const NAV_LINKS = [
  { name: 'Home', href: '/#hero' },
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'Privacy Model', href: '/#privacy' },
  { name: 'Emergency', href: '/#emergency' },
  { name: 'Compatibility', href: '/#compatibility' },
  { name: 'Impact', href: '/#impact' },
];

export const VALUE_PROPOSITIONS = [
  {
    id: 'connect',
    code: 'CONNECT',
    title: 'Precision Compatibility Matching',
    description: 'Instantly connect verified healthcare institutions with donors based on logistical prioritization.',
    icon: 'Network',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'secure',
    code: 'SECURE',
    title: 'Consent-First Privacy Safeguard',
    description: 'Donor phone and email remain strictly hidden until the donor explicitly accepts a request.',
    icon: 'ShieldCheck',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'fast',
    code: 'FAST',
    title: 'Urgent Emergency Dispatch',
    description: 'Rapid notification routing for critical hospital requirements when every second matters.',
    icon: 'Zap',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'save-lives',
    code: 'SAVE LIVES',
    title: 'Direct Community Impact',
    description: 'Every successful request coordination saves lives and supports regional blood bank stock.',
    icon: 'HeartPulse',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Hospital Creates Request',
    description: 'Verified healthcare institutions submit blood requirements including blood group, units, location, and urgency status.',
    icon: 'Hospital',
    detail: 'Verified Institutions Only',
  },
  {
    step: '02',
    title: 'LifePulse Prioritizes Donors',
    description: 'Our algorithmic platform evaluates compatibility, donor availability, proximity, and verification status to identify optimal matches.',
    icon: 'Cpu',
    detail: 'Logistical Prioritization Score',
  },
  {
    step: '03',
    title: 'Donor Reviews & Consents',
    description: 'Matching donors receive discrete notifications. Contact details remain completely private until the donor explicitly chooses Accept.',
    icon: 'UserCheck',
    detail: '100% Privacy Protection',
  },
  {
    step: '04',
    title: 'Direct Coordination',
    description: 'Upon donor acceptance, secure contact channels open between the hospital logistics team and the donor for donation scheduling.',
    icon: 'PhoneCall',
    detail: 'Consent-Based Contact Sharing',
  },
];

export const EMERGENCY_REQUESTS = [
  {
    id: 'req-01',
    hospitalName: 'St. Jude Memorial Hospital',
    location: 'Downtown Medical Center, Sector 4',
    bloodGroup: 'O-',
    unitsRequired: 3,
    unitsConfirmed: 2,
    urgency: 'CRITICAL',
    timeLabel: 'Required within 2 hours',
    distance: '2.4 km away',
    verified: true,
  },
  {
    id: 'req-02',
    hospitalName: 'City General Trauma Care',
    location: 'North Avenue, Block B',
    bloodGroup: 'AB-',
    unitsRequired: 2,
    unitsConfirmed: 1,
    urgency: 'HIGH',
    timeLabel: 'Required Today',
    distance: '4.8 km away',
    verified: true,
  },
  {
    id: 'req-03',
    hospitalName: 'Apex Heart & Surgical Center',
    location: 'Westside Healthcare Complex',
    bloodGroup: 'B+',
    unitsRequired: 4,
    unitsConfirmed: 3,
    urgency: 'URGENT',
    timeLabel: 'Required in 6 hours',
    distance: '5.1 km away',
    verified: true,
  },
];

export const IMPACT_STATS = [
  { label: 'Registered Donors', value: 1245, suffix: '+', icon: 'Users' },
  { label: 'Verified Hospitals', value: 38, suffix: '+', icon: 'Building2' },
  { label: 'Requests Fulfilled', value: 580, suffix: '+', icon: 'CheckCircle2' },
  { label: 'Lives Impacted', value: 23000, suffix: '+', icon: 'Activity' },
];

export const BLOOD_COMPATIBILITY_MATRIX = [
  {
    type: 'O-',
    name: 'Universal Red Cell Donor',
    canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    canReceiveFrom: ['O-'],
    rarity: '7% of population',
    badge: 'Universal Donor',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  {
    type: 'O+',
    name: 'Most Common Blood Type',
    canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-'],
    rarity: '37% of population',
    badge: 'High Demand',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    type: 'A+',
    name: 'A Positive',
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    rarity: '34% of population',
    badge: 'Common',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    type: 'A-',
    name: 'A Negative',
    canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
    canReceiveFrom: ['A-', 'O-'],
    rarity: '6% of population',
    badge: 'Rare',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  {
    type: 'B+',
    name: 'B Positive',
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    rarity: '9% of population',
    badge: 'Moderate',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  },
  {
    type: 'B-',
    name: 'B Negative',
    canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
    canReceiveFrom: ['B-', 'O-'],
    rarity: '2% of population',
    badge: 'Very Rare',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  {
    type: 'AB+',
    name: 'Universal Plasma Recipient',
    canDonateTo: ['AB+'],
    canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    rarity: '3% of population',
    badge: 'Universal Recipient',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    type: 'AB-',
    name: 'Rarest Blood Type',
    canDonateTo: ['AB+', 'AB-'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    rarity: '1% of population',
    badge: 'Rarest',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
  },
];
