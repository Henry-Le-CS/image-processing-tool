export enum TrafficConditionEnum {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
}

export enum TrafficConditionDetailEnum {
  A = 'A - Free flow',
  B = 'B - Reasonably free flow',
  C = 'C - Stable flow',
  D = 'D - Approaching unstable flow',
  E = 'E - Unstable flow',
  F = 'F - Forced / Breakdown flow',
}

export type TrafficConditionKeyAsString = keyof typeof TrafficConditionEnum;
