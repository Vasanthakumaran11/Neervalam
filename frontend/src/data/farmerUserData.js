/**
 * Neervalam Farmer & IoT Telemetry Data Engine
 * Real-time sensor simulation, 24h drawdown curves, soil health, weather, and ML water pouring recommendations.
 */
import dataset from './groundwater_dataset.json';

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

// Pre-resolved Erode demo profile
FARMER_USERS['iot-erd-102'] = {
  id: 'iot-erd-102',
  numericId: '102',
  name: 'Murugan Palanisamy',
  tamilName: 'முருகன் பழனிசாமி (ஈரோடு)',
  avatar: '👨‍🌾',
  location: 'Perundurai, Erode District',
  coordinates: [11.2755, 77.5828],
  landSizeAcres: 6.5,
  cropType: 'Turmeric (Erode Manjal - GI Tag) & Sugarcane',
  soilType: 'Red Sandy Loam / Weathered Saprolite (Bhavani Aquifer)',
  irrigationType: 'Smart Drip Irrigation & IoT Solenoid Valve Network',
  iotHubId: 'IOT-ERD-102',
  sensorStatus: 'Active · Online (LoRaWAN Erode Telemetry)',
  lastPing: 'Just now (Live IoT Stream)',
  cgwbStationId: 154,

  wellDetails: {
    type: 'Dug-cum-Borewell (CGWB Station #154)',
    totalDepthMeters: 55,
    pumpRating: '7.5 HP Solar-Hybrid Submersible',
    flowMeterGpm: 42,
    currentDepthBgl: 12.8,
    yesterdayDepthBgl: 12.86,
    delta24h: '-0.06m (Aquifer Extraction)',
    status: 'Moderate / Seasonal Stress · Bhavani Basin',
    statusColor: '#f59e0b',
    pumpState: 'OFF'
  },

  soilTelemetry: {
    rootZoneMoisture15cm: 32,
    subZoneMoisture30cm: 38,
    optimalRange: '45% – 60%',
    soilTempCelsius: 31.8,
    electricalConductivity: '0.74 dS/m (Normal)',
    nitrogenLevel: 'Adequate',
    landStatus: 'Moderately Dry · Root Zone Irrigation Window Open'
  },

  weatherForecast: {
    location: 'Perundurai Agri-Met Telemetry Station, Erode',
    currentTemp: 34.6,
    humidity: 52,
    windSpeedKmh: 15,
    solarRadiation: 'High (Clear Sky)',
    rainExpectedNext24h: false,
    rainProbabilityPercent: 10,
    rainAmountMm: 0.0,
    forecastDays: [
      { day: 'Today', condition: 'Sunny & Dry', temp: '35°C', rainMm: 0.0, rainProb: '10%' },
      { day: 'Tomorrow', condition: 'Clear Sky', temp: '35.5°C', rainMm: 0.0, rainProb: '5%' },
      { day: 'Day 3', condition: 'Passing Clouds', temp: '34°C', rainMm: 1.2, rainProb: '25%' }
    ]
  },

  mlWaterRecommendation: {
    action: 'IRRIGATION_RECOMMENDED',
    badgeText: 'Erode Bhavani Aquifer Precision Drip Advisory',
    badgeColor: '#0284c7',
    litersToPour: 3200,
    recommendedPumpMinutes: 45,
    groundwaterSavedLiters: 4600,
    optimalTimeWindow: 'Tomorrow 5:30 AM – 6:15 AM (Dawn Evaporation Minimum)',
    confidenceScore: 94,
    summaryMessage: 'Bhavani Basin root moisture at 32%. Schedule 3,200 Liters via micro-drip emitters at dawn.',
    detailedRationale: 'Transmissivity in this Perundurai unconfined saprolite zone permits controlled recovery. Running precision drip for 45 minutes prevents excessive conical depression around your well while satisfying crop water duty for Turmeric rhizome development.',
    savingsEquivalence: 'Conserves ~4,600L compared to conventional furrow flooding.'
  },

  historical24hTelemetry: [
    { time: '00:00', depthBgl: 12.68, soilMoisture: 36, pumpStatus: 0 },
    { time: '03:00', depthBgl: 12.71, soilMoisture: 35, pumpStatus: 0 },
    { time: '06:00', depthBgl: 12.75, soilMoisture: 34, pumpStatus: 0 },
    { time: '09:00', depthBgl: 12.78, soilMoisture: 32, pumpStatus: 0 },
    { time: '12:00', depthBgl: 12.83, soilMoisture: 30, pumpStatus: 0 },
    { time: '15:00', depthBgl: 12.86, soilMoisture: 29, pumpStatus: 0 },
    { time: '18:00', depthBgl: 12.82, soilMoisture: 31, pumpStatus: 0 },
    { time: '21:00', depthBgl: 12.80, soilMoisture: 33, pumpStatus: 0 }
  ]
};

FARMER_USERS['erode-farmer'] = FARMER_USERS['iot-erd-102'];

export const ERODE_WELLS = (dataset?.wells || []).filter(w => w.district === 'Erode');

/**
 * Generate a complete, authentic Farmer telemetry profile dynamically from any real Erode CGWB well.
 * Assigns one of Erode's 63 real wells based on the IoT ID or seed.
 */
export function createErodeFarmerProfile(seedId = 'IOT-ERD-102', userProfile = null, specificWellId = null) {
  if (!ERODE_WELLS.length) return FARMER_USERS['iot-erd-102'];

  let well;
  if (specificWellId) {
    well = ERODE_WELLS.find(w => String(w.id) === String(specificWellId) || w.location.toLowerCase().includes(String(specificWellId).toLowerCase()));
  }

  if (!well) {
    let hash = 0;
    const str = String(seedId || userProfile?.id || userProfile?.phone || userProfile?.iot_hub_id || 'IOT-ERD-102');
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const wellIndex = Math.abs(hash) % ERODE_WELLS.length;
    well = ERODE_WELLS[wellIndex];
  }

  const numericId = String(well.id || Math.abs(String(seedId).split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 900) + 100);
  const iotId = userProfile?.iot_hub_id || (String(seedId).toUpperCase().startsWith('IOT-') ? String(seedId).toUpperCase() : `IOT-ERD-${numericId}`);
  const farmerName = userProfile?.full_name || 'Murugan Palanisamy';
  const cleanLoc = well.location.replace(/\(.*?\)/g, '').replace(/[0-9]/g, '').trim();
  const waterLevel = well.latestLevel !== null && well.latestLevel !== undefined ? Number(well.latestLevel) : 11.8;
  const depthMeters = Math.max(50, Math.round(waterLevel * 2.6));
  const pumpRating = waterLevel > 12 ? '7.5 HP Solar-Hybrid Submersible (VFD)' : '5.0 HP Submersible Monobloc';

  const statusColor = well.color || (waterLevel < 5 ? '#10b981' : waterLevel < 12 ? '#f59e0b' : '#ef4444');
  const statusLabel = waterLevel < 5 ? 'Safe / High Water Table' : waterLevel < 12 ? 'Moderate / Seasonal Stress' : 'Critical / Deep Saprolite Drawdown';

  const historical24h = [
    { time: '00:00', depthBgl: Math.round((waterLevel - 0.12) * 100) / 100, soilMoisture: 36, pumpStatus: 0 },
    { time: '03:00', depthBgl: Math.round((waterLevel - 0.09) * 100) / 100, soilMoisture: 35, pumpStatus: 0 },
    { time: '06:00', depthBgl: Math.round((waterLevel - 0.05) * 100) / 100, soilMoisture: 34, pumpStatus: 0 },
    { time: '09:00', depthBgl: Math.round((waterLevel - 0.02) * 100) / 100, soilMoisture: 32, pumpStatus: 0 },
    { time: '12:00', depthBgl: Math.round((waterLevel + 0.03) * 100) / 100, soilMoisture: 30, pumpStatus: 0 },
    { time: '15:00', depthBgl: Math.round((waterLevel + 0.06) * 100) / 100, soilMoisture: 29, pumpStatus: 0 },
    { time: '18:00', depthBgl: Math.round((waterLevel + 0.02) * 100) / 100, soilMoisture: 31, pumpStatus: 0 },
    { time: '21:00', depthBgl: waterLevel, soilMoisture: 33, pumpStatus: 0 }
  ];

  const litersToPour = waterLevel > 10 ? 3200 : 1800;
  const pumpMins = waterLevel > 10 ? 45 : 28;
  const savedLiters = waterLevel > 10 ? 4600 : 2600;

  return {
    id: seedId || 'iot-erd-102',
    numericId: numericId,
    name: farmerName,
    tamilName: `${cleanLoc} உழவர் (${farmerName})`,
    avatar: '👨‍🌾',
    location: `${cleanLoc}, Erode District`,
    coordinates: [well.latitude, well.longitude],
    landSizeAcres: 5.5,
    cropType: 'Turmeric (Erode Manjal - GI Tag) & Sugarcane',
    soilType: 'Red Sandy Loam / Saprolite (Bhavani Aquifer)',
    irrigationType: 'Smart Drip Irrigation & IoT Soil Moisture Valve Network',
    iotHubId: iotId,
    sensorStatus: 'Active · Online (LoRaWAN Erode Telemetry)',
    lastPing: 'Just now (Live IoT Stream)',
    cgwbStationId: well.id,

    wellDetails: {
      type: `${well.wellType || 'Dug-cum-Borewell'} (CGWB Station #${well.id})`,
      totalDepthMeters: depthMeters,
      pumpRating: pumpRating,
      flowMeterGpm: 42,
      currentDepthBgl: waterLevel,
      yesterdayDepthBgl: Math.round((waterLevel + 0.06) * 100) / 100,
      delta24h: '-0.06m (Aquifer Extraction)',
      status: `${statusLabel} · Bhavani Basin`,
      statusColor: statusColor,
      pumpState: 'OFF'
    },

    soilTelemetry: {
      rootZoneMoisture15cm: 32,
      subZoneMoisture30cm: 38,
      optimalRange: '45% – 60%',
      soilTempCelsius: 31.8,
      electricalConductivity: '0.74 dS/m (Normal)',
      nitrogenLevel: 'Adequate',
      landStatus: 'Moderately Dry · Root Zone Irrigation Window Open'
    },

    weatherForecast: {
      location: `${cleanLoc} Agri-Met Telemetry Station, Erode`,
      currentTemp: 34.6,
      humidity: 52,
      windSpeedKmh: 15,
      solarRadiation: 'High (Clear Sky)',
      rainExpectedNext24h: false,
      rainProbabilityPercent: 10,
      rainAmountMm: 0.0,
      forecastDays: [
        { day: 'Today', condition: 'Sunny & Dry', temp: '35°C', rainMm: 0.0, rainProb: '10%' },
        { day: 'Tomorrow', condition: 'Clear Sky', temp: '35.5°C', rainMm: 0.0, rainProb: '5%' },
        { day: 'Day 3', condition: 'Passing Clouds', temp: '34°C', rainMm: 1.2, rainProb: '25%' }
      ]
    },

    mlWaterRecommendation: {
      action: waterLevel > 10 ? 'IRRIGATION_RECOMMENDED' : 'LIGHT_DEFICIT_IRRIGATION',
      badgeText: 'Erode Bhavani Aquifer Precision Drip Advisory',
      badgeColor: waterLevel > 10 ? '#0284c7' : '#10b981',
      litersToPour: litersToPour,
      recommendedPumpMinutes: pumpMins,
      groundwaterSavedLiters: savedLiters,
      optimalTimeWindow: 'Tomorrow 5:30 AM – 6:15 AM (Dawn Evaporation Minimum)',
      confidenceScore: 94,
      summaryMessage: `Bhavani Basin root moisture at 32%. Schedule ${litersToPour.toLocaleString()} Liters via micro-drip emitters at dawn.`,
      detailedRationale: `Transmissivity in this ${cleanLoc} unconfined saprolite zone permits controlled recovery. Running precision drip for ${pumpMins} minutes prevents excessive conical depression around your well while satisfying crop water duty for Turmeric rhizome development.`,
      savingsEquivalence: `Conserves ~${savedLiters.toLocaleString()}L compared to conventional furrow flooding.`
    },

    historical24hTelemetry: historical24h
  };
}

/**
 * Resolve farmer telemetry by ID or registered IoT device ID.
 * Defaults to authentic Erode well telemetry whenever a new user registers as Farmer!
 */
export function resolveFarmerProfile(id, userProfile = null) {
  const cleanId = id ? String(id).toLowerCase().trim() : '';

  // Explicit demo profiles
  if (cleanId === 'selvam-thanjavur' && !userProfile) {
    return FARMER_USERS['selvam-thanjavur'];
  }
  if (cleanId === 'kavitha-madurai' && !userProfile) {
    return FARMER_USERS['kavitha-madurai'];
  }
  if (FARMER_USERS[cleanId] && !userProfile) {
    return FARMER_USERS[cleanId];
  }

  // If farmer registered with an IoT hub ID or district
  const iotId = userProfile?.iot_hub_id || (cleanId.startsWith('iot-') ? cleanId : 'IOT-ERD-102');
  
  // Return dynamically synthesized Erode well profile for this farmer
  return createErodeFarmerProfile(iotId, userProfile);
}

export function getFarmerUser(id, userProfile = null) {
  return resolveFarmerProfile(id, userProfile);
}
