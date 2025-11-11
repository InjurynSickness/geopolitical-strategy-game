export type Color = [number, number, number];
export interface Position {
    x: number;
    y: number;
}
export interface Country {
    id: string;
    name: string;
    code: string;
    position: Position;
    territories: string[];
    color: string;
    gdp: number;
    gdpPerCapita: number;
    population: number;
    unemploymentRate: number;
    inflationRate: number;
    nationalDebt: number;
    interestRate: number;
    resources: ResourceStockpile;
    militaryStrength: number;
    militarySpending: number;
    politicalPower: number;
    politicalPowerGain: number;
    stability: number;
    warSupport: number;
    government: GovernmentType;
    ideology: Ideology;
    relations: Map<string, number>;
    alliances: string[];
    corruptionLevel: number;
    economicGrowthRate: number;
}
export interface Territory {
    id: string;
    name: string;
    countryId: string;
    position: Position;
    population: number;
    infrastructureLevel: number;
    civilianFactories: number;
    militaryFactories: number;
    officeComplexes: number;
    resourceDeposits: Partial<ResourceStockpile>;
    garrison: number;
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
    energy: number;
}
export type GovernmentType = 'democracy' | 'authoritarian' | 'totalitarian' | 'federal_republic' | 'constitutional_monarchy' | 'military_junta';
export type Ideology = 'liberal_democracy' | 'social_democracy' | 'conservatism' | 'nationalism' | 'socialism' | 'communism' | 'fascism' | 'non_aligned';
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
    month: number;
    day: number;
    hour: number;
}
export interface GameState {
    currentDate: GameDate;
    isPaused: boolean;
    gameSpeed: number;
    countries: Map<string, Country>;
    alliances: Map<string, Alliance>;
    selectedCountryId: string | null;
}
export interface TradeAgreement {
    id: string;
    exporterCountryId: string;
    importerCountryId: string;
    resource: keyof ResourceStockpile;
    quantity: number;
    pricePerUnit: number;
    duration: number;
}
export interface DiplomaticAction {
    type: 'improve_relations' | 'trade_agreement' | 'alliance_offer' | 'declare_war';
    actorCountryId: string;
    targetCountryId: string;
    cost: number;
    duration?: number;
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
export type EventType = 'economic_crisis' | 'political_event' | 'natural_disaster' | 'diplomatic_incident' | 'technological_breakthrough' | 'social_unrest' | 'military_event' | 'random';
export type EffectType = 'modify_stat' | 'add_resource' | 'remove_resource' | 'trigger_event' | 'modify_relation' | 'add_political_power' | 'change_government' | 'start_war';
export type ConditionType = 'country_stat' | 'resource_amount' | 'government_type' | 'date_after' | 'date_before' | 'has_alliance' | 'relation_with';
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
