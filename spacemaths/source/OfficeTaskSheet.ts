module Spacemaths {
    export class OfficeTaskSheet {
        private group: Phaser.Group;
        private stage: StageOffice;
        private style: Object;
        private answerClicked: (office: StageOffice, correct: boolean) => void;
        private paperMovedOut: Function;
        private paper_size: { w: number; h: number; };

        private static FONT_SIZE = 108;

        constructor(stage: StageOffice, answerClicked: TaskSheetAnswerClicked, paperMovedOut: TaskSheetPaperMovedOut) {
            this.stage = stage;
            this.group = stage.game.add.group();
            this.style = { font: OfficeTaskSheet.FONT_SIZE + "px Arial", fill: "#000000", align: "center" };
            this.group.z = 100;
            this.group.create(0, 0, 'paper');
            this.group.scale.set(0.1, 0.1);
            this.group.exists = false;
            this.group.visible = false;
            //this.group.position
            this.answerClicked = answerClicked;
            this.paperMovedOut = paperMovedOut;

            var paper_img = <HTMLImageElement>this.stage.game.cache.getImage('paper');
            this.paper_size = {
                w: paper_img.width,
                h: paper_img.height
            };
        }

        public loadTask(data: EngineerTask) {
            var str = data.values[0].toString();
            switch (data.operations[0])
            {
                case MathOperation.Plus: str += ' + '; break;
                case MathOperation.Minus: str += ' - '; break;
                case MathOperation.Multiply: str += ' * '; break;
                case MathOperation.Divide: str += ' / '; break;
            }
            str += data.values[1].toString() + ' = ';
            //every xy is based on center, using percents!
            var half_w = this.paper_size.w * 0.5,
                half_h = this.paper_size.h * 0.5;
            this.stage.game.add.text(
                0/*-half_w + 0.01 * this.paper_size.w*/,
                -half_h + 0.1 * this.paper_size.h,
                str, this.style, this.group);

            var x: number, y: number, text: Phaser.Text,
                fs = OfficeTaskSheet.FONT_SIZE;
            for (var i in data.answers)
            {
                x = -0.5 * half_w + half_w * (i & 1);
                y = -fs + ((i > 1) ? (i > 3) ? 4 * fs : 2 * fs : 0);
                text = this.stage.game.add.text(x, y, data.answers[i].toString(), this.style, this.group);
                text.inputEnabled = true;
                text.events.onInputDown.addOnce(this.answerClickHandler, this);
                text['smIsCorrectAnswer'] = i == data.correct_answer_index;
            }
            this.group.setAll('anchor.x', 0.5);
            this.group.setAll('anchor.y', 0.5);
            this.group.x = this.stage.game.world.centerX;
            this.group.y = this.stage.game.world.centerY;
        }

        public moveIn() {
            this.group.exists = true;
            this.group.visible = true;
            this.stage.game.add.tween(this.group.scale)
                .to({ x: 1, y: 1 }, 500, Phaser.Easing.Linear.None, true);
                //.onComplete.add();
        }

        public moveOut() {
            this.stage.game.add.tween(this.group.scale)
                .to({ x: 0.1, y: 0.1 }, 500, Phaser.Easing.Linear.None, true)
                .onComplete.add(this.moveOutCallback, this);
        }

        private answerClickHandler(clickedText: Phaser.Text) {
            //true -> correct answer,
            //false -> wrong answer
            this.answerClicked(this.stage, clickedText['smIsCorrectAnswer']);
        }

        private clearTask() {
            this.group.removeBetween(1, this.group.length - 1, true);
        }

        private moveOutCallback() {
            this.group.exists = false;
            this.group.visible = false;
            this.clearTask();
            this.paperMovedOut(this.stage);
        }
    }
}