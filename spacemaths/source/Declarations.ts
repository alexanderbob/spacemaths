module Spacemaths {
    export enum EngineerActionState { IDLE, MOVE_IN, MOVE_OUT };
    export enum GameLevel { Space, Moon, Mars }
    export enum MathOperation { Plus, Minus, Multiply, Divide }

    export interface OfficeTaskSheetText extends Phaser.Text {
        answerIndex: number;
        questionData: EngineerTask;
    }
    export interface SessionData {
        currentLevel: GameLevel;
        currentDay: number;
        totalDays: number;
        correctAnswers: number;
        totalQuestions: number;
        wrongAnswers: { task: EngineerTask; givenAnswerIndex: number; }[];
    }
    export interface EngineerTask {
        values: number[];
        operations: MathOperation[];
        answers: number[];
        correctAnswerIndex: number;
    }
    export interface TaskSheetAnswerClicked {
        (office: StageOffice, questionData: EngineerTask, givenAnswerIndex: number): void;
    }
    export interface TaskSheetPaperMovedOut {
        (office: StageOffice): void;
    }
}