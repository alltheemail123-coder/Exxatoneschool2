// Generate expanded availability data with 100+ items
const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
const cities = ["Birmingham", "Fairbanks", "Phoenix", "Little Rock", "Los Angeles", "Denver", "Hartford", "Dover", "Miami", "Atlanta", "Honolulu", "Boise", "Chicago", "Indianapolis", "Des Moines", "Topeka", "Louisville", "New Orleans", "Portland", "Baltimore", "Boston", "Detroit", "Minneapolis", "Jackson", "Kansas City", "Billings", "Omaha", "Las Vegas", "Concord", "Newark", "Albuquerque", "New York", "Charlotte", "Fargo", "Columbus", "Oklahoma City", "Portland", "Philadelphia", "Providence", "Charleston", "Sioux Falls", "Nashville", "Houston", "Salt Lake City", "Montpelier", "Richmond", "Seattle", "Charleston", "Milwaukee", "Cheyenne"];
const disciplines = ["Physical Therapy", "Occupational Therapy", "Speech-Language Pathology", "Physical Therapy Assistant", "Occupational Therapy Assistant", "Audiology", "Respiratory Therapy", "Recreational Therapy"];
const specializations = ["Orthopedic", "Pediatric", "General", "Sports Medicine", "Neurological", "Geriatric", "Cardiovascular", "Acute Care", "Mental Health", "Hand Therapy", "Voice Disorders", "Stroke Rehabilitation", "Adult Rehabilitation", "Outpatient", "Wound Care", "Cardiac Rehabilitation"];
const durations = ["6 weeks", "8 weeks", "10 weeks", "12 weeks", "14 weeks", "16 weeks", "18 weeks", "20 weeks"];
const experienceTypes = ["Individual", "Group"];

// Hospital site locations
const hospitalSites = [
  "Belmont - Park St",
  "Downtown - Main Campus",
  "Westside - Medical Center",
  "Northshore - Clinic",
  "Southside - Rehabilitation",
  "Eastgate - Outpatient",
  "Midtown - Specialty Care",
  "Riverside - Acute Care",
  "Hillcrest - Pediatric",
  "Valley - Orthopedic",
  "Summit - Cardiac",
  "Lakeside - Geriatric",
  "Parkview - Mental Health",
  "Crossroads - Emergency",
  "Harbor - Trauma Center"
];

// Generate random date within next 6 months
function generateRandomDate() {
  const start = new Date();
  const end = new Date();
  end.setMonth(start.getMonth() + 6);
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime);
}

// Generate year-round availability dates
function generateYearRoundDates() {
  const currentYear = new Date().getFullYear();
  return {
    startDate: new Date(currentYear, 0, 1), // January 1st
    endDate: new Date(currentYear, 11, 31), // December 31st
  };
}

// Format date as MM/DD/YYYY
function formatDate(date: Date) {
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
}

// Generate end date based on start date and duration
function generateEndDate(startDate: Date, duration: string) {
  const weeks = parseInt(duration.split(' ')[0]);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + (weeks * 7));
  return endDate;
}

// Generate time indicators for last requested
const timeIndicators = ["Just now", "5 minutes ago", "15 minutes ago", "30 minutes ago", "1 hour ago", "2 hours ago", "3 hours ago", "5 hours ago", "6 hours ago", "1 day ago", "2 days ago", "3 days ago", "4 days ago", "5 days ago", "1 week ago"];

// Request types and programs
const requestTypes = ["student", "faculty", "school"];
const programs = ["Physical Therapy", "Nursing", "Occupational Therapy", "Respiratory Therapy", "Medical Assistant"];

function generateAvailabilityData() {
  const data = [];
  
  for (let i = 0; i < 120; i++) {
    const state = states[Math.floor(Math.random() * states.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const discipline = disciplines[Math.floor(Math.random() * disciplines.length)];
    const specialization = specializations[Math.floor(Math.random() * specializations.length)];
    const duration = durations[Math.floor(Math.random() * durations.length)];
    const experienceType = experienceTypes[Math.floor(Math.random() * experienceTypes.length)];
    const hospitalSite = hospitalSites[Math.floor(Math.random() * hospitalSites.length)];
    
    // 30% chance of unlimited slots and year-round availability
    const isUnlimited = Math.random() < 0.3;
    const isYearRound = Math.random() < 0.3;
    
    let startDate: Date;
    let endDate: Date;
    let totalSlots: number;
    
    if (isYearRound) {
      const yearRoundDates = generateYearRoundDates();
      startDate = yearRoundDates.startDate;
      endDate = yearRoundDates.endDate;
    } else {
      startDate = generateRandomDate();
      endDate = generateEndDate(startDate, duration);
    }
    
    if (isUnlimited) {
      totalSlots = -1; // -1 represents unlimited
    } else {
      totalSlots = Math.floor(Math.random() * 25) + 8; // 8-32 slots
    }
    
    const totalRequest = isUnlimited ? Math.floor(Math.random() * 50) + 10 : Math.floor(Math.random() * totalSlots);
    const pendingReview = Math.floor(Math.random() * 5);
    
    // Generate new request indicators (20% chance)
    const hasRecentRequest = Math.random() < 0.3;
    const isNewRequest = Math.random() < 0.15;
    const lastRequestTime = hasRecentRequest || isNewRequest ? timeIndicators[Math.floor(Math.random() * timeIndicators.length)] : null;
    
    // Generate request metadata
    const requestedBy = requestTypes[Math.floor(Math.random() * requestTypes.length)];
    const program = requestedBy === "school" ? programs[Math.floor(Math.random() * programs.length)] : null;
    
    // Create unique ID
    const id = Math.floor(Math.random() * 999999999).toString();
    
    // Generate discipline abbreviation
    const disciplineAbbr = discipline === "Physical Therapy" ? "PT" 
      : discipline === "Occupational Therapy" ? "OT"
      : discipline === "Speech-Language Pathology" ? "SLP"
      : discipline === "Physical Therapy Assistant" ? "PTA"
      : discipline === "Occupational Therapy Assistant" ? "OTA"
      : discipline === "Audiology" ? "AUD"
      : discipline === "Respiratory Therapy" ? "RT"
      : "REC";
    
    const name = `${state} - ${city}-${disciplineAbbr}-H1 2025`;
    
    data.push({
      id,
      name,
      experienceType,
      location: hospitalSite, // Changed to hospital site location
      discipline,
      specialization,
      totalSlots,
      totalRequest,
      pendingReview,
      duration,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      hasRecentRequest,
      isNewRequest,
      lastRequestTime,
      isUnlimited,
      isYearRound,
      requestedBy,
      program,
    });
  }
  
  return data;
}

export const availabilityData = generateAvailabilityData();

export default availabilityData;