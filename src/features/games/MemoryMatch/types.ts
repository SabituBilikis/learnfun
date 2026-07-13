export type MatchCardState = "hidden" | "revealed" | "matched";

export interface MatchCard {
  uid: string;
  id: string;
  emoji: string;
  color: string;
  bg: string;
  state: MatchCardState;
}
