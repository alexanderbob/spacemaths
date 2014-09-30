module Spacemaths {

    export class StageOffice extends Phaser.State {
        private static STAGE_LENGTH = 60000;
        private static ENGINEER_WAIT_TIME = 500;

        taskSheet: OfficeTaskSheet;
        picture: OfficePicture;
        clock: OfficeClock;
        door: Phaser.Sprite;
        hands: {
            left: Phaser.Sprite;
            right: Phaser.Sprite;
        };
        background: {
            table: Phaser.Sprite;
            wall: Phaser.Sprite;
            door_back: Phaser.Sprite;
            floor: Phaser.Sprite;
            battery: Phaser.Sprite;
        }
        engineer: Engineer;
        paper: Phaser.Sprite;
        computer: Phaser.Sprite;
        spaceKey: Phaser.Key;
        shadow: Phaser.Rectangle;
        task_generator: TaskGenerator;
        //isEngineerBusy: boolean = false;
        correctAnswers: number = 0;
        isTimeOut: boolean = false;
        timer: Phaser.Timer;

        create() {
            this.correctAnswers = 0;
            this.isTimeOut = false;
            this.task_generator = new TaskGenerator;
            var wall = <HTMLImageElement>this.game.cache.getImage('wall'),
                floor = <HTMLImageElement>this.game.cache.getImage('floor'),
                battery = <HTMLImageElement>this.game.cache.getImage('battery'),
                door = <HTMLImageElement>this.game.cache.getImage('door'),
                wall_h = wall.height,
                floor_h = floor.height;
            this.background = {
                wall: this.add.sprite(0, 0, 'wall'),
                floor: this.add.sprite(0, wall_h, 'floor'),
                table: this.add.sprite(0, wall_h + floor_h, 'table'),
                battery: this.add.sprite(128, wall_h - battery.height, 'battery'),
                door_back: this.add.sprite(710, wall_h - door.height + 68, 'door_back', 0)
            }
            this.picture = new OfficePicture(this, 'wall_picture_frame', 'wall_picture', {x: 320, y: 241}, 133);

            this.clock = new OfficeClock(this, 'table_clock', 'table_clock_arrow', { x: 824, y: 1372 });

            var eng = <HTMLImageElement>this.game.cache.getImage('engineer'),
                x = 710 + eng.width * 0.5,
                y = wall_h - eng.height * 0.5;
            this.engineer = new Engineer(this.game, x, y, this.engineer_moved_in, this.engineer_moved_out, this);
            this.engineer.exists = false;
            this.engineer.z = 3;
            this.engineer.setMoveOutXY(x, y);
            this.engineer.setMoveInXY(
                this.game.world.centerX,
                this.game.world.centerY - 0.5 * eng.height
            );

            this.computer = this.add.sprite(21, 1097, 'computer');
            this.door = this.add.sprite(710, wall_h - door.height + 68, 'door', 0);
            this.door.z = 2;
            this.door.animations.add('open', [1]);
            this.door.animations.add('closed', [0]);

            this.hands = {
                left: this.add.sprite(200, 1523, 'hand_left'),
                right: this.add.sprite(630, 1542, 'hand_right')
            }

            this.taskSheet = new OfficeTaskSheet(this, this.answerClicked, this.paperMovedOut);

            var sizes = Utils.getInstance().getGameSizes();
            this.shadow = new Phaser.Rectangle(0, 0, sizes.w, sizes.h);
            this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            //clock initialization here
            this.clock.resetTimeOut(StageOffice.STAGE_LENGTH, this.timeIsOutCallback);
            this.timer = this.game.time.create(false);
            this.timer.loop(StageOffice.ENGINEER_WAIT_TIME, this.sendEngineer, this);
            this.timer.start();
        }
        sendEngineer() {
            this.timer.pause();
            this.engineer.exists = true;
            this.engineer.move_in();
            this.door.play('open');
        }
        answerClicked(self: StageOffice, is_correct: boolean) {
            if (is_correct)
                self.correctAnswers++;
            self.taskSheet.moveOut();
        }
        paperMovedOut(self: StageOffice) {
            self.engineer.move_out();
        }
        timeIsOutCallback(self: StageOffice) {
            self.isTimeOut = true;
        }
        /*render() {

        }*/
        engineer_moved_in() {
            var task = this.task_generator.generateTask();
            this.taskSheet.loadTask(task);
            this.taskSheet.moveIn();
            /*console.log(JSON.stringify(task));
            this.engineer.move_out();*/
        }
        engineer_moved_out() {
            this.engineer.exists = false;
            //this.isEngineerBusy = false;
            this.door.play('closed');
            this.picture.doShatter();
            if (this.isTimeOut)
            {
                this.timer.stop();
                this.timer.removeAll();
                this.timer.destroy();
                console.log("Correct answers: " + this.correctAnswers);
                (<Game>this.game).transitions.to('StageLevelSelect');
            }
            else
            {
                this.timer.resume();
            }
        }
        render() {
            
        }
        update() {
            /*if (this.spaceKey.isDown && this.isEngineerBusy === false)
            {
                this.isEngineerBusy = true;
                this.engineer.exists = true;
                this.engineer.move_in();
                this.door.play('open');
            }*/
        }
    }
}

