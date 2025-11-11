// /src/types.ts

// Represents an R,G,B color
export type Color = [number, number, number];

export interface Position {
    x: number;
    y: number;
}

export interface Country {
    id: string;
    name: string;
    code: string; // ISO country code (USA, CHN, RUS)
    
    // Geographic data
    position: Position; // Center position on map
    territories: string[]; // <-- UPDATED: Now stores string Province IDs
    color: string; // Hex color for map display
    
    // Economic data
    gdp: number; // In billions USD
    gdpPerCapita: number;
    population: number; // In millions
    unemploymentRate: number; // Percentage
    inflationRate: number; // Percentage
    nationalDebt: number; // In billions USD
    interestRate: number; // Percentage
    
    // Resources
    resources: ResourceStockpile;
    
    // Military
    militaryStrength: number; // Abstract strength value
    militarySpending: number; // In billions USD
    
    // Political
    politicalPower: number; // Current PP
    politicalPowerGain: number; // PP per day
    stability: number; // 0-100
    warSupport: number; // 0-100
    government: GovernmentType;
    ideology: Ideology;
    
    // Diplomatic
    relations: Map<string, number>; // Country ID -> relation value (-100 to 100)
    alliances: string[]; // Alliance IDs
    
    // Internal
    corruptionLevel: number; // 0-100
    economicGrowthRate: number; // Percentage
}

export interface Territory {
    id: string;
    name: string;
    countryId: string;
    position: Position;
    population: number;
    
    // Infrastructure
    infrastructureLevel: number; // 0-10
    civilianFactories: number;
    militaryFactories: number;
    officeComplexes: number;
    
    // Resources
    resourceDeposits: Partial<ResourceStockpile>;
    
    // Military
    garrison: number; // Number of troops stationed
}

export interface ResourceStockpile {
    oil: number;
    steel: number;
    aluminum: number;
    rubber: number;
    rareEarths: number;
    semiconductors: number;
    uranium: number;
    coal: number;
    food: number;
    energy: number; // Electrical energy stored
}

export type GovernmentType = 
    | 'democracy' 
    | 'authoritarian' 
    | 'totalitarian' 
    | 'federal_republic' 
    | 'constitutional_monarchy'
    | 'military_junta';

export type Ideology = 
    | 'liberal_democracy'
    | 'social_democracy' 
    | 'conservatism'
    | 'nationalism'
    | 'socialism'
    | 'communism'
    | 'fascism'
    | 'non_aligned';

export interface Alliance {
    id: string;
    name: string;
    leaderCountryId: string;
    memberCountryIds: string[];
    type: 'military' | 'economic' | 'mixed';
    foundedDate: GameDate;
}

export interface GameDate {
    year: number;
    month: number; // 1-12
    day: number; // 1-31
    hour: number; // 0-23
}

export interface GameState {
    currentDate: GameDate;
    isPaused: boolean;
    gameSpeed: number;
    countries: Map<string, Country>;
    alliances: Map<string, Alliance>;
    selectedCountryId: string | null;
}

// ... (Rest of the interfaces are unchanged) ...

export interface TradeAgreement {
    id: string;
    exporterCountryId: string;
    importerCountryId: string;
    resource: keyof ResourceStockpile;
    quantity: number; // Units per day
    pricePerUnit: number; // USD
    duration: number; // Days remaining
}

export interface DiplomaticAction {
    type: 'improve_relations' | 'trade_agreement' | 'alliance_offer' | 'declare_war';
    actorCountryId: string;
    targetCountryId: string;
    cost: number; // Political power cost
    duration?: number; // Days to complete
}

export interface GameEvent {
    id: string;
    title: string;
    description: string;
    targetCountryId: string;
    choices: EventChoice[];
    triggerConditions?: EventCondition[];
    triggerDate?: GameDate;
    recurring?: boolean;
    recurringInterval?: number;
    oneTriggerOnly?: boolean;
    eventType: EventType;
}

export interface EventChoice {
    id: string;
    text: string;
    effects: EventEffect[];
    politicalPowerCost?: number;
    requirements?: EventCondition[];
    tooltip?: string;
}

export interface EventEffect {
    type: EffectType;
    target: string;
    value: number;
    duration?: number;
    isPercentage?: boolean;
}

export interface EventCondition {
    type: ConditionType;
    target: string;
    operator: 'greater' | 'less' | 'equal' | 'not_equal' | 'greater_equal' | 'less_equal';
    value: number;
}

export type EventType = 
    | 'economic_crisis'
    | 'political_event' 
    | 'natural_disaster'
    | 'diplomatic_incident' 
    | 'technological_breakthrough'
    | 'social_unrest'
    | 'military_event'
    | 'random';

export type EffectType = 
    | 'modify_stat'
    | 'add_resource'
    | 'remove_resource'
    | 'trigger_event'
    | 'modify_relation'
    | 'add_political_power'
    | 'change_government'
    | 'start_war';

export type ConditionType =
    | 'country_stat'
    | 'resource_amount'
    | 'government_type'
    | 'date_after'
    | 'date_before'
    | 'has_alliance'
    | 'relation_with';

export interface ActiveEvent {
    event: GameEvent;
    triggeredAt: GameDate;
    expiresAt?: GameDate;
}

export interface ScheduledEvent {
    eventId: string;
    targetCountryId: string;
    scheduledFor: GameDate;
    recurring?: boolean;
    lastTriggered?: GameDate;
}

export interface CombatAction {
    attackerCountryId: string;
    defenderCountryId: string;
    attackingTerritoryId: string;
    defendingTerritoryId: string;
    attackerForces: number;
    startTime: GameDate;
}

export interface CombatResult {
    success: boolean;
    attackerLosses: number;
    defenderLosses: number;
    territoryTransferred?: string;
}