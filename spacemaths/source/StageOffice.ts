﻿module Spacemaths {

    export class StageOffice extends Phaser.State {
        taskSheet: OfficeTaskSheet;
        picture: OfficePicture;
        door: Phaser.Sprite;
        clock: {
            base: Phaser.Sprite;
            arrow: Phaser.Sprite;
        };
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
        engineer_is_busy: boolean = false;
        correctAnswers: number = 0;
        create() {
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

            this.clock = {
                base: this.add.sprite(824, 1372, 'table_clock'),
                //-217 из-за anchor.x == 1
                arrow: this.add.sprite(824 + 217, 1372, 'table_clock_arrow')
            }
            this.clock.arrow.anchor.x = 1;

            var eng = <HTMLImageElement>this.game.cache.getImage('engineer');
            this.engineer = new Engineer(this.game, 710, wall_h - eng.height, this.engineer_moved_in, this.engineer_moved_out, this);
            this.engineer.exists = false;
            this.engineer.z = 3;

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
        }
        answerClicked(self: StageOffice, is_correct: boolean) {
            if (is_correct)
                self.correctAnswers++;
            self.taskSheet.moveOut();
        }
        paperMovedOut(self: StageOffice) {
            self.engineer.move_out();
        }
        render() {

        }
        engineer_moved_in() {
            var task = this.task_generator.generateTask();
            this.taskSheet.loadTask(task);
            this.taskSheet.moveIn();
            /*console.log(JSON.stringify(task));
            this.engineer.move_out();*/
        }
        engineer_moved_out() {
            this.engineer.exists = false;
            this.engineer_is_busy = false;
            this.door.play('closed');
            this.picture.doShatter();
        }
        update() {
            if (this.spaceKey.isDown && this.engineer_is_busy === false)
            {
                this.engineer_is_busy = true;
                this.engineer.exists = true;
                this.engineer.move_in();
                this.door.play('open');
            }
        }
    }
}
