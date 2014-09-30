module Spacemaths {
    export enum EngineerActionState { IDLE, MOVE_IN, MOVE_OUT };
    export enum GameLevels { Space, Moon, Mars }
    export enum MathOperation { Plus, Minus, Multiply, Divide }
    
    export interface GameSessionData {

    }
    export interface EngineerTask {
        values: number[];
        operations: MathOperation[];
        answers: number[];
        correct_answer_index: number;
    }
    export interface TaskSheetAnswerClicked {
        (office: StageOffice, is_correct: boolean): void;
    }
    export interface TaskSheetPaperMovedOut {
        (office: StageOffice): void;
    }
}