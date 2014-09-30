﻿module Spacemaths {
    export enum MathOperation {
        Plus, Minus, Multiply, Divide
    }

    export interface EngineerTask {
        values: number[];
        operations: MathOperation[];
        answers: number[];
        correct_answer_index: number;
    }

    export class TaskGenerator {
        private static instance: TaskGenerator = null;
        constructor() {
            if (TaskGenerator.instance === null)
                TaskGenerator.instance = this;
        }
        public static getInstance(): TaskGenerator {
            if (TaskGenerator.instance === null)
                TaskGenerator.instance = new TaskGenerator();
            return TaskGenerator.instance;
        }
        public generateTask(): EngineerTask {
            var values = [Math.round(Math.random() * 50 + 1), Math.round(Math.random() * 50 + 1)],
                operation: MathOperation = Math.round(Math.random()),
                answers = [],
                correct_answer_index = Math.round(6 * Math.random() - 0.5);
            for (var i = 0; i < 6; i++)
            {
                if (i == correct_answer_index)
                {
                    switch (operation)
                    {
                        case MathOperation.Plus:
                            answers[i] = values[0] + values[1];
                            break;
                        case MathOperation.Minus:
                            answers[i] = values[0] - values[1];
                            break;
                    }
                }
                else
                {
                    answers[i] = Math.abs(Math.round(100 * Math.random()) - 50);
                }
            }
            return {
                answers: answers,
                correct_answer_index: correct_answer_index,
                operations: [operation],
                values: values
            }
        }
    }
}