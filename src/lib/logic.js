// ====================================================================
// --- 1. CORE BUSINESS LOGIC & CONSTANTS ---
// ====================================================================

// Emission Factors (Expanded to match new form)
// These are simplified for the demo.
export const EMISSION_FACTORS = {
    // --- Energy ---
    // Source: US EPA EGRID (example)
    energyKwh: 0.389, // kg CO2e/kWh
    // Source: EPA
    gasTherms: 5.3, // kg CO2e/therm

    // --- Transport ---
    // Source: EPA (avg. passenger car)
    transportCar: 0.24, // kg CO2e/mile (updated from 0.18 for better avg)
    transportBus: 0.08, // kg CO2e/mile
    transportTrain: 0.05, // kg CO2e/mile
    // Source: ICAO
    transportFlight: 0.12, // kg CO2e/mile (short-haul avg)

    // --- Diet ---
    // (kg CO2e/week)
    dietOmnivore: 45, // ~6.4 kg/day
    dietVegetarian: 30, // ~4.3 kg/day
    dietVegan: 20, // ~2.8 kg/day

    // --- Waste ---
    // Source: EPA (avg. US household)
    wastePerPerson: 2.2, // kg CO2e/day per person
};

/**
 * Calculates the carbon footprint based on new, detailed inputs.
 * @param {object} inputs - The raw inputs from the calculator form.
 * @returns {object} - An object containing the total and breakdown.
 */
export const calculateFootprint = (inputs) => {
    // Monthly calculations
    const energy =
        (inputs.energyKwh || 0) * EMISSION_FACTORS.energyKwh +
        (inputs.gasTherms || 0) * EMISSION_FACTORS.gasTherms;

    // Weekly * 4.33 (avg. weeks in a month)
    const transport =
        ((inputs.transportCar || 0) * EMISSION_FACTORS.transportCar +
            (inputs.transportBus || 0) * EMISSION_FACTORS.transportBus +
            (inputs.transportTrain || 0) * EMISSION_FACTORS.transportTrain) *
        4.33;

    // Monthly calculation
    const flights = (inputs.transportFlight || 0) * EMISSION_FACTORS.transportFlight;

    // Weekly * 4.33
    const diet = (EMISSION_FACTORS[inputs.diet] || 0) * 4.33;

    // Daily * 30.4 (avg. days in a month)
    const waste =
        (inputs.wastePeople || 1) * EMISSION_FACTORS.wastePerPerson * 30.4;

    const totalFootprint = energy + transport + flights + diet + waste;

    return {
        // All values are now monthly
        totalFootprint: parseFloat(totalFootprint.toFixed(2)),
        breakdown: {
            energy: parseFloat(energy.toFixed(2)),
            transport: parseFloat(transport.toFixed(2)),
            flights: parseFloat(flights.toFixed(2)),
            diet: parseFloat(diet.toFixed(2)),
            waste: parseFloat(waste.toFixed(2)),
        },
        inputs, // Store the raw inputs for history
    };
};