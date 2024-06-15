// import { BoardName } from "./BoardName";
import { Card } from "./card";

export type Board = {
    id: string,
    name: string,
    cards: Card[],
}