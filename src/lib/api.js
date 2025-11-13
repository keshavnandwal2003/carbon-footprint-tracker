// ====================================================================
// --- MOCK BACKEND & DATABASE (Simulating Node.js + MongoDB) ---
// ====================================================================

let mockDatabase = {
    users: [
        {
            _id: 'user_1',
            email: 'user@example.com',
            password: 'hashed_password_for_password123',
        },
    ],
    footprints: [
        // Pre-seed history data for the line chart
        {
            _id: 'fp_1',
            user: 'user_1',
            totalFootprint: 1050.75,
            breakdown: {
                energy: 250,
                transport: 180.5,
                flights: 200,
                diet: 195,
                waste: 225.25,
            },
            inputs: {},
            createdAt: new Date('2025-08-15T10:00:00Z').toISOString(),
        },
        {
            _id: 'fp_2',
            user: 'user_1',
            totalFootprint: 980.5,
            breakdown: {
                energy: 220,
                transport: 150.5,
                flights: 200,
                diet: 185,
                waste: 225.0,
            },
            inputs: {},
            createdAt: new Date('2025-09-15T10:00:00Z').toISOString(),
        },
        {
            _id: 'fp_3',
            user: 'user_1',
            totalFootprint: 950.0,
            breakdown: {
                energy: 210,
                transport: 140,
                flights: 190,
                diet: 185,
                waste: 225.0,
            },
            inputs: {},
            createdAt: new Date('2025-10-15T10:00:00Z').toISOString(),
        },
    ],
    goals: [
        {
            _id: 'goal_1',
            user: 'user_1',
            reductionPercent: 15,
            createdAt: new Date('2025-10-16T10:00:00Z').toISOString(),
        },
    ],
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
    // --- AUTH ---
    register: async (email, password) => {
        await wait(500);
        if (mockDatabase.users.find((u) => u.email === email)) {
            throw new Error('User already exists');
        }
        const newUser = {
            _id: `user_${Math.random().toString(36).substr(2, 9)}`,
            email,
            password: `hashed_password_for_${password}`,
        };
        mockDatabase.users.push(newUser);
        const token = `jwt_token_for_${newUser._id}`;
        return { token, user: { _id: newUser._id, email: newUser.email } };
    },

    login: async (email, password) => {
        await wait(500);
        const user = mockDatabase.users.find((u) => u.email === email);
        if (!user || user.password !== `hashed_password_for_${password}`) {
            if (
                user &&
                user.email === 'user@example.com' &&
                password === 'password123' &&
                user.password === 'hashed_password_for_password123'
            ) {
                /* Allow pre-seeded user */
            } else {
                throw new Error('Invalid email or password');
            }
        }
        const token = `jwt_token_for_${user._id}`;
        return { token, user: { _id: user._id, email: user.email } };
    },

    // --- FOOTPRINTS ---
    getFootprints: async (token) => {
        await wait(800);
        if (!token) throw new Error('Unauthorized');
        const userId = token.replace('jwt_token_for_', '');
        const footprints = mockDatabase.footprints
            .filter((fp) => fp.user === userId)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Sort ascending for line chart
        return footprints;
    },

    postFootprint: async (token, footprintData) => {
        await wait(600);
        if (!token) throw new Error('Unauthorized');
        const userId = token.replace('jwt_token_for_', '');
        const newFootprint = {
            ...footprintData,
            _id: `fp_${Math.random().toString(36).substr(2, 9)}`,
            user: userId,
            createdAt: new Date().toISOString(),
        };
        mockDatabase.footprints.push(newFootprint);
        return newFootprint;
    },

    // --- GOALS (Imported from previous app) ---
    getGoal: async (token) => {
        await wait(700);
        if (!token) throw new Error('Unauthorized');
        const userId = token.replace('jwt_token_for_', '');
        const goal = mockDatabase.goals
            .filter((g) => g.user === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        const latestFootprint = mockDatabase.footprints
            .filter((fp) => fp.user === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        return {
            goal: goal || null,
            latestFootprint: latestFootprint || null,
        };
    },

    setGoal: async (token, reductionPercent) => {
        await wait(500);
        if (!token) throw new Error('Unauthorized');
        const userId = token.replace('jwt_token_for_', '');
        const newGoal = {
            _id: `goal_${Math.random().toString(36).substr(2, 9)}`,
            user: userId,
            reductionPercent: reductionPercent,
            createdAt: new Date().toISOString(),
        };
        mockDatabase.goals = mockDatabase.goals.filter((g) => g.user !== userId);
        mockDatabase.goals.push(newGoal);
        return newGoal;
    },

    // --- NEW: Global Data API ---
    getGlobalData: async (token) => {
        await wait(1200); // This call is slower
        if (!token) throw new Error('Unauthorized');
        // Mock data simulating a response from The World Bank or Climate Watch
        return {
            data: [
                { country: 'China', totalEmissions: 10065, perCapita: 7.38 },
                { country: 'United States', totalEmissions: 5416, perCapita: 16.56 },
                { country: 'India', totalEmissions: 2654, perCapita: 1.96 },
                { country: 'Russia', totalEmissions: 1711, perCapita: 11.85 },
                { country: 'Japan', totalEmissions: 1162, perCapita: 9.27 },
                { country: 'Germany', totalEmissions: 759, perCapita: 9.13 },
                { country: 'Iran', totalEmissions: 720, perCapita: 8.65 },
                { country: 'South Korea', totalEmissions: 659, perCapita: 12.89 },
                { country: 'Canada', totalEmissions: 569, perCapita: 15.32 },
                { country: 'Brazil', totalEmissions: 457, perCapita: 2.15 },
            ],
            source: 'Mock Data from World Resources Institute (Simulated)',
            year: 2022,
        };
    },

    // --- GEMINI API ---
    getReductionTips: async (token, breakdown, totalFootprint) => {
        await wait(1500);
        if (!token) throw new Error('Unauthorized');
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
        const systemPrompt = `You are an encouraging climate coach. Provide actionable, simple tips. Use markdown for formatting, like **bolding** key ideas and using newlines for lists.`;
        const userQuery = `My monthly carbon footprint is ${totalFootprint} kg CO2e. Breakdown: Energy: ${breakdown.energy}, Transport: ${breakdown.transport}, Flights: ${breakdown.flights}, Diet: ${breakdown.diet}, Waste: ${breakdown.waste}. Give me 3 personalized tips to reduce my footprint, focusing on my highest categories.`;

        // --- Mocked Response (Simulating a real API call's structure) ---
        // In a real app, you would use fetch() here.
        console.log("Simulating Gemini API call with query:", userQuery);
        let tips = "Here are a few personalized tips based on your results:\n\n";
        tips += "**Action 1:** Your **Energy** use is significant. Try switching to LED bulbs and unplugging electronics when not in use. This 'phantom load' adds up!\n\n";
        tips += "**Action 2:** Your **Diet** has a noticeable impact. Try introducing one or two plant-based meal days per week, like 'Meatless Monday'.\n\n";
        tips += "**Action 3:** That **Flight** was a big one-time hit. For future travel, consider purchasing carbon offsets or, for shorter trips, look into train or bus options.";
        return tips;
    },

    // --- NEW: AI Tools APIs (Imported) ---
    getMealIdeas: async (token, dietType) => {
        await wait(2000); // Simulate API call latency
        if (!token) throw new Error('Unauthorized');
        const dietName = {
            dietOmnivore: 'Omnivore',
            dietVegetarian: 'Vegetarian',
            dietVegan: 'Vegan'
        }[dietType];

        console.log("Simulating Gemini API call for meal ideas:", dietType);
        // Mocked Response
        if (dietType === 'dietVegan') {
            return "**Breakfast:** Oatmeal with Berries & Chia Seeds.\n" +
                "**Lunch:** Spicy Black Bean & Avocado Tacos.\n" +
                "**Dinner:** Red Lentil Curry with Spinach.";
        } else {
            return "**Breakfast:** Scrambled Tofu or Eggs with Veggies.\n" +
                "**Lunch:** Big Lentil & Roasted Vegetable Salad.\n" +
                "**Dinner:** 'Less-Meat' Mushroom & Beef (or Bean) Burgers.";
        }
    },

    getGoalTips: async (token, reductionPercent, latestFootprint) => {
        await wait(2200); // This is a "big" request
        if (!token) throw new Error('Unauthorized');
        const { totalFootprint, breakdown } = latestFootprint;
        const targetReduction = (totalFootprint * (reductionPercent / 100)).toFixed(2);

        console.log("Simulating Gemini API call for goal tips");
        let plan = `Here is a plan to help you hit your ${reductionPercent}% reduction goal (about ${targetReduction} kg CO2e):\n\n`;
        plan += `**Action 1: Focus on Your ${breakdown.diet > breakdown.energy ? 'Diet' : 'Energy'
            }**\n*This is a high-impact area for you. Try replacing one red meat meal per week with a plant-based option like lentils.*\n\n`;
        plan += `**Action 2: Optimize Your Transport**\n*Your transport footprint is ${breakdown.transport} kg. Can you batch all your weekly errands into one trip?*\n\n`;
        plan += `**Action 3: A Small Tweak, a Big Win**\n*Lower your thermostat by 1 degree (if in winter) or use a smart power strip to cut phantom load.*\n\n`;
        plan += `*Stick with these, and you'll be well on your way to hitting your ${reductionPercent}% goal!*`;
        return plan;
    },
};