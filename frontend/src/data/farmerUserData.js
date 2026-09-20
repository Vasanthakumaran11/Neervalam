/**
 * Neervalam Farmer & IoT Telemetry Data Engine
 * Real-time sensor simulation, 24h drawdown curves, soil health, weather, and ML water pouring recommendations.
 */

export const FARMER_USERS = {
  'selvam-thanjavur': {
    id: 'selvam-thanjavur',
    numericId: '101',
    name: 'Selvam Arumugam',
    tamilName: 'செல்வம் ஆறுமுகம்',
    avatar: '👨‍🌾',
    location: 'Thiruvaiyaru, Thanjavur District',
    coordinates: [10.8804, 79.1062],
    landSizeAcres: 4.5,
    cropType: 'Paddy (CR 1009 Sub-1) & Black Gram',
    soilType: 'Cauvery Delta Alluvial Clay Loam',
    irrigationType: 'Smart Drip & Alternate Wetting-Drying (AWD)',
    iotHubId: 'IOT-TNJ-DELTA-4081',
    sensorStatus: 'Active · Online (4G LoRa Telemetry)',
    lastPing: '2 mins ago',

    wellDetails: {
      type: 'Dug-cum-Borewell (Unconfined Aquifer)',
      totalDepthMeters: 45,
      pumpRating: '5 HP Solar-Hybrid Submersible',
      flowMeterGpm: 45,
      currentDepthBgl: 3.42, // meters below ground level
      yesterdayDepthBgl: 3.48,
      delta24h: '+0.06m (Natural Recharge)',
      status: 'Safe / High Water Table',
      statusColor: '#10b981',
      pumpState: 'OFF' // 'ON' | 'OFF'
    },

    soilTelemetry: {
      rootZoneMoisture15cm: 68, // %
      subZoneMoisture30cm: 74,  // %
      optimalRange: '60% – 75%',
      soilTempCelsius: 27.4,
      electricalConductivity: '0.64 dS/m (Optimal)',
      nitrogenLevel: 'Adequate',
      landStatus: 'Fertile & Moisture Saturated'
    },

    weatherForecast: {
      location: 'Thiruvaiyaru Agri-Met Hub',
      currentTemp: 31.2,
      humidity: 84,
      windSpeedKmh: 14,
      solarRadiation: 'Moderate (Cloudy)',
      rainExpectedNext24h: true,
      rainProbabilityPercent: 85,
      rainAmountMm: 16.5,
      forecastDays: [
        { day: 'Today', condition: 'Humid & Overcast', temp: '31°C', rainMm: 1.2, rainProb: '40%' },
        { day: 'Tomorrow', condition: 'Heavy Convective Rain', temp: '28°C', rainMm: 16.5, rainProb: '85%' },
        { day: 'Day 3', condition: 'Scattered Showers', temp: '29°C', rainMm: 5.0, rainProb: '60%' }
      ]
    },

    mlWaterRecommendation: {
      action: 'NO_IRRIGATION_NEEDED',
      badgeText: 'Do Not Irrigate Today (Rain Imminent)',
      badgeColor: '#10b981',
      litersToPour: 0,
      recommendedPumpMinutes: 0,
      groundwaterSavedLiters: 6800,
      optimalTimeWindow: 'Keep pump OFF today & tomorrow',
      confidenceScore: 94,
      summaryMessage: 'Rain imminent! Heavy rain (16.5mm) predicted within 18 hours. Root-zone soil moisture is already optimal (68%).',
      detailedRationale: 'The ML crop-water model (ETc calculation) indicates that natural precipitation tomorrow will surpass crop evapotranspiration needs. Running your 5 HP pump today would result in waterlogging, nutrient leaching, and unnecessary aquifer depletion.',
      savingsEquivalence: 'Conserves enough water for 14 days of domestic household usage.'
    },

    historical24hTelemetry: [
      { time: '00:00', depthBgl: 3.48, soilMoisture: 70, pumpStatus: 0 },
      { time: '03:00', depthBgl: 3.47, soilMoisture: 69, pumpStatus: 0 },
      { time: '06:00', depthBgl: 3.45, soilMoisture: 69, pumpStatus: 0 },
      { time: '09:00', depthBgl: 3.44, soilMoisture: 68, pumpStatus: 0 },
      { time: '12:00', depthBgl: 3.43, soilMoisture: 67, pumpStatus: 0 },
      { time: '15:00', depthBgl: 3.43, soilMoisture: 67, pumpStatus: 0 },
      { time: '18:00', depthBgl: 3.42, soilMoisture: 68, pumpStatus: 0 },
      { time: '21:00', depthBgl: 3.42, soilMoisture: 68, pumpStatus: 0 }
    ]
  },

  'murugan-erode': {
    id: 'murugan-erode',
    numericId: '102',
    name: 'Murugan Palanisamy',
    tamilName: 'முருகன் பழனிசாமி',
    avatar: '👨‍🌾',
    location: 'Sathyamangalam, Erode District',
    coordinates: [11.5034, 77.2411],
    landSizeAcres: 6.0,
    cropType: 'Turmeric (Bhavani Local) & Banana (Grand Naine)',
    soilType: 'Red Sandy Loam with Quartz Gravel',
    irrigationType: 'Micro-Drip Emitter Network',
    iotHubId: 'IOT-ERD-BHAV-9122',
    sensorStatus: 'Active · Online (Cellular 4G Telemetry)',
    lastPing: '1 min ago',

    wellDetails: {
      type: 'Deep Borewell (Charnockite Hard Rock)',
      totalDepthMeters: 78,
      pumpRating: '7.5 HP Submersible with VFD Controller',
      flowMeterGpm: 38,
      currentDepthBgl: 15.20,
      yesterdayDepthBgl: 15.05,
      delta24h: '-0.15m (Aquifer Depletion)',
      status: 'Semi-Critical / Deep Water Table',
      statusColor: '#f97316',
      pumpState: 'OFF'
    },

    soilTelemetry: {
      rootZoneMoisture15cm: 28, // % Stress!
      subZoneMoisture30cm: 34,  // %
      optimalRange: '45% – 60%',
      soilTempCelsius: 33.1,
      electricalConductivity: '0.82 dS/m (Normal)',
      nitrogenLevel: 'Moderate',
      landStatus: 'Dry · Root Zone Moisture Deficit'
    },

    weatherForecast: {
      location: 'Sathyamangalam IMD Station',
      currentTemp: 35.8,
      humidity: 48,
      windSpeedKmh: 18,
      solarRadiation: 'High (Clear Sky)',
      rainExpectedNext24h: false,
      rainProbabilityPercent: 5,
      rainAmountMm: 0.0,
      forecastDays: [
        { day: 'Today', condition: 'Sunny & Hot', temp: '36°C', rainMm: 0.0, rainProb: '5%' },
        { day: 'Tomorrow', condition: 'Clear Sky', temp: '36.5°C', rainMm: 0.0, rainProb: '0%' },
        { day: 'Day 3', condition: 'Warm & Dry', temp: '35°C', rainMm: 0.0, rainProb: '10%' }
      ]
    },

    mlWaterRecommendation: {
      action: 'IRRIGATION_RECOMMENDED',
      badgeText: 'Precision Drip Irrigation Advised',
      badgeColor: '#0284c7',
      litersToPour: 3200,
      recommendedPumpMinutes: 48,
      groundwaterSavedLiters: 4800, // saved compared to 8,000L flood
      optimalTimeWindow: 'Tomorrow 5:30 AM – 6:18 AM (Dawn Window)',
      confidenceScore: 92,
      summaryMessage: 'Root-zone moisture is down to 28%. Pour exactly 3,200 Liters via drip during the dawn window.',
      detailedRationale: 'High evapotranspiration (5.2 mm/day) has created a moisture deficit in the 15cm root-zone. Running micro-drip emitters for 48 minutes at dawn reduces evaporation loss by 40% compared to midday, protecting your deep borewell from excessive drawdown.',
      savingsEquivalence: 'Micro-drip timing saves ~4,800L compared to conventional furrow flooding.'
    },

    historical24hTelemetry: [
      { time: '00:00', depthBgl: 15.05, soilMoisture: 32, pumpStatus: 0 },
      { time: '03:00', depthBgl: 15.08, soilMoisture: 31, pumpStatus: 0 },
      { time: '06:00', depthBgl: 15.10, soilMoisture: 30, pumpStatus: 0 },
      { time: '09:00', depthBgl: 15.14, soilMoisture: 29, pumpStatus: 0 },
      { time: '12:00', depthBgl: 15.17, soilMoisture: 28, pumpStatus: 0 },
      { time: '15:00', depthBgl: 15.19, soilMoisture: 28, pumpStatus: 0 },
      { time: '18:00', depthBgl: 15.20, soilMoisture: 28, pumpStatus: 0 },
      { time: '21:00', depthBgl: 15.20, soilMoisture: 28, pumpStatus: 0 }
    ]
  },

  'kavitha-madurai': {
    id: 'kavitha-madurai',
    numericId: '103',
    name: 'Kavitha Sundar',
    tamilName: 'கவிதா சுந்தர்',
    avatar: '👩‍🌾',
    location: 'Melur, Madurai District',
    coordinates: [10.0315, 78.3347],
    landSizeAcres: 3.2,
    cropType: 'Madurai Malli (Jasmine) & Vegetables',
    soilType: 'Red Loam with Sandy Fractions',
    irrigationType: 'Micro-Sprinkler & Drip System',
    iotHubId: 'IOT-MDU-MELUR-3310',
    sensorStatus: 'Active · Online (LoRaWAN Gateway)',
    lastPing: '4 mins ago',

    wellDetails: {
      type: 'Open Dug Well with Artificial Recharge Shaft',
      totalDepthMeters: 28,
      pumpRating: '3 HP Monobloc Pump',
      flowMeterGpm: 25,
      currentDepthBgl: 6.80,
      yesterdayDepthBgl: 6.85,
      delta24h: '+0.05m (Stable Aquifer)',
      status: 'Moderate / Managed Aquifer',
      statusColor: '#f59e0b',
      pumpState: 'OFF'
    },

    soilTelemetry: {
      rootZoneMoisture15cm: 46,
      subZoneMoisture30cm: 54,
      optimalRange: '40% – 55%',
      soilTempCelsius: 29.8,
      electricalConductivity: '0.52 dS/m (Good)',
      nitrogenLevel: 'Good',
      landStatus: 'Moderate Moisture · Flowering Stage'
    },

    weatherForecast: {
      location: 'Melur Weather Monitoring Station',
      currentTemp: 33.5,
      humidity: 62,
      windSpeedKmh: 12,
      solarRadiation: 'Moderate',
      rainExpectedNext24h: false,
      rainProbabilityPercent: 25,
      rainAmountMm: 1.5,
      forecastDays: [
        { day: 'Today', condition: 'Partly Cloudy', temp: '33°C', rainMm: 0.5, rainProb: '20%' },
        { day: 'Tomorrow', condition: 'Passing Clouds', temp: '32°C', rainMm: 1.5, rainProb: '25%' },
        { day: 'Day 3', condition: 'Dry & Pleasant', temp: '33°C', rainMm: 0.0, rainProb: '10%' }
      ]
    },

    mlWaterRecommendation: {
      action: 'LIGHT_DEFICIT_IRRIGATION',
      badgeText: 'Light Evening Watering Recommended',
      badgeColor: '#0ea5e9',
      litersToPour: 1400,
      recommendedPumpMinutes: 22,
      groundwaterSavedLiters: 2200,
      optimalTimeWindow: 'Today 5:45 PM – 6:10 PM (Dusk Window)',
      confidenceScore: 89,
      summaryMessage: 'Jasmine blooming phase requires light controlled watering. Pour 1,400 Liters during dusk.',
      detailedRationale: 'Sustained bud formation is enhanced by light moisture deficit. Pouring 1,400L in the evening hours maintains root transpiration while avoiding fungal rot.',
      savingsEquivalence: 'Conserves 2,200L compared to traditional morning irrigation.'
    },

    historical24hTelemetry: [
      { time: '00:00', depthBgl: 6.85, soilMoisture: 48, pumpStatus: 0 },
      { time: '03:00', depthBgl: 6.84, soilMoisture: 47, pumpStatus: 0 },
      { time: '06:00', depthBgl: 6.83, soilMoisture: 47, pumpStatus: 0 },
      { time: '09:00', depthBgl: 6.82, soilMoisture: 46, pumpStatus: 0 },
      { time: '12:00', depthBgl: 6.81, soilMoisture: 45, pumpStatus: 0 },
      { time: '15:00', depthBgl: 6.81, soilMoisture: 45, pumpStatus: 0 },
      { time: '18:00', depthBgl: 6.80, soilMoisture: 46, pumpStatus: 0 },
      { time: '21:00', depthBgl: 6.80, soilMoisture: 46, pumpStatus: 0 }
    ]
  }
};

/**
 * Helper to get a farmer by string id or numeric id
 */
export function getFarmerUser(id) {
  if (!id) return FARMER_USERS['selvam-thanjavur'];
  const cleanId = String(id).toLowerCase().trim();
  
  if (FARMER_USERS[cleanId]) {
    return FARMER_USERS[cleanId];
  }

  // Lookup by numeric id (e.g. 101, 102, 103)
  const found = Object.values(FARMER_USERS).find(u => u.numericId === cleanId);
  if (found) return found;

  // Default fallback to first farmer
  return FARMER_USERS['selvam-thanjavur'];
}
