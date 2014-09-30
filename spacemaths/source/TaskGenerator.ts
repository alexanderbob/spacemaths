module Spacemaths {
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
                correct_answer_index = Math.round(6 * Math.random() - 0.49);
            //preparing correct answer here
            switch (operation)
            {
                case MathOperation.Plus:
                    answers[correct_answer_index] = values[0] + values[1];
                    break;
                case MathOperation.Minus:
                    answers[correct_answer_index] = values[0] - values[1];
                    break;
            }
            //fill other suggestions
            for (var i = 0; i < 6; i++)
            {
                if (i != correct_answer_index)
                {
                    do
                    {
                        answers[i] = Math.abs(Math.round(100 * Math.random()) - 50);
                    }
                    while (answers[i] == answers[correct_answer_index]);
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