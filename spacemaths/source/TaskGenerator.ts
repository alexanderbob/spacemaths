module Spacemaths {
    export class TaskGenerator {
        private static instance: TaskGenerator = null;
        private sessionData: SessionData;

        constructor() {
            if (TaskGenerator.instance === null)
                TaskGenerator.instance = this;
        }
        public static getInstance(): TaskGenerator {
            if (TaskGenerator.instance === null)
                TaskGenerator.instance = new TaskGenerator();
            return TaskGenerator.instance;
        }
        // use it to prepare generator tasks based on previous days activity and difficulty level
        public prepare() {
            this.sessionData = GameStorage.getInstance().getSessionData();
        }
        public generateTask(): EngineerTask {
            var operation: MathOperation;
            switch (this.sessionData.currentLevel)
            {
                case GameLevel.Space:
                    operation = Math.round(Math.random());
                    break;
                case GameLevel.Moon:
                    //0, 1, 2 with nearly equal probability
                    operation = Math.round(3 * Math.random() - 0.49);
                    break;
                case GameLevel.Mars:
                    //0, 1, 2, 3
                    operation = Math.round(4 * Math.random() - 0.49);
                    break;
            }
            var values = this.prepareValues(this.sessionData, operation);
            var answers = [],
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
                correctAnswerIndex: correct_answer_index,
                operations: [operation],
                values: values
            }
        }
        private prepareValues(data: SessionData, op: MathOperation): number[] {
            return [Math.round(Math.random() * 50 + 1), Math.round(Math.random() * 50 + 1)];
        }
    }
}