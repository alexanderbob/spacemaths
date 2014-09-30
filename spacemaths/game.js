window.onload = function () {
    var game = new Spacemaths.Game();
};
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Spacemaths;
(function (Spacemaths) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.image('preloadBar', 'assets/loader.png');
        };
        Boot.prototype.create = function () {
            //  Unless you specifically need to support multitouch I would recommend setting this to 1
            this.input.maxPointers = 1;

            //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            //this.stage.disableVisibilityChange = true;
            //this.game.scale.setScreenSize(true);
            if (this.game.device.desktop) {
                //  If you have any desktop specific settings, they can go in here
                //this.scale.pageAlignHorizontally = true;
            } else {
                //  Same goes for mobile settings.
            }

            this.game.scale.forcePortrait = true;
            this.game.scale.minWidth = 480;
            this.game.scale.minHeight = 800;
            this.game.scale.maxHeight = 1920;
            this.game.scale.maxWidth = 1080;
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.setShowAll();
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            this.game.scale.refresh();

            /*var ow = parseInt(this.game.canvas.style.width, 10);
            var oh = parseInt(this.game.canvas.style.height, 10);
            var r = Math.max(window.innerWidth / ow, window.innerHeight / oh);
            var nw = ow * r;
            var nh = oh * r;
            this.game.canvas.style.width = nw + "px";
            this.game.canvas.style.height = nh + "px";
            this.game.canvas.style.marginLeft = (window.innerWidth / 2 - nw / 2) + "px";
            this.game.canvas.style.marginTop = (window.innerHeight / 2 - nh / 2) + "px";
            document.getElementById("content").style.width = window.innerWidth + "px";
            document.getElementById("content").style.height = window.innerHeight + "px";//The css for body includes 1px top margin, I believe this is the cause for this -1
            document.getElementById("content").style.overflow = "hidden";*/
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.game.state.start('Preloader', true, false);

            var self = this;
            window.addEventListener('resize', function (event) {
                self.game.scale.setShowAll();
                self.game.scale.refresh();
            });
        };
        return Boot;
    })(Phaser.State);
    Spacemaths.Boot = Boot;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
    var EngineerActionState;
    (function (EngineerActionState) {
        EngineerActionState[EngineerActionState["IDLE"] = 0] = "IDLE";
        EngineerActionState[EngineerActionState["MOVE_IN"] = 1] = "MOVE_IN";
        EngineerActionState[EngineerActionState["MOVE_OUT"] = 2] = "MOVE_OUT";
    })(EngineerActionState || (EngineerActionState = {}));
    ;

    var Engineer = (function (_super) {
        __extends(Engineer, _super);
        function Engineer(game, x, y, move_in_callback, move_out_callback, stage_office) {
            _super.call(this, game, x, y, 'engineer', 0);
            this.action_state = 0 /* IDLE */;
            this.move_in_coords = { x: 512, y: 512 };
            this.move_out_coords = { x: 710, y: 232 };
            this.move_epsylon = 5;
            this.move_in_callback = move_in_callback;
            this.move_out_callback = move_out_callback;
            this.stage_office = stage_office;

            //this.anchor.setTo(0.5, 0);
            this.game.physics.arcade.enableBody(this);
            game.add.existing(this);
        }
        Engineer.prototype.update = function () {
        };
        Engineer.prototype.move_in = function () {
            var tween = this.game.add.tween(this.body).to({
                x: this.move_in_coords.x,
                y: this.move_in_coords.y
            }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.move_in_callback, this.stage_office);
        };
        Engineer.prototype.move_out = function () {
            var tween = this.game.add.tween(this.body).to({
                x: this.move_out_coords.x,
                y: this.move_out_coords.y
            }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.move_out_callback, this.stage_office);
        };
        return Engineer;
    })(Phaser.Sprite);
    Spacemaths.Engineer = Engineer;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            var utils = Spacemaths.Utils.getInstance(), sizes = utils.getGameSizes();

            //super(480, 800, Phaser.AUTO, 'content', null);
            _super.call(this, sizes.w, sizes.h, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Spacemaths.Boot, false);
            this.state.add('Preloader', Spacemaths.Preloader, false);

            //this.state.add('MainMenu', MainMenu, false);
            this.state.add('StageOffice', Spacemaths.StageOffice, false);

            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    Spacemaths.Game = Game;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
    //не используется
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            this.background = this.add.sprite(0, 0, 'titlepage');
            this.background.alpha = 0;

            this.logo = this.add.sprite(this.world.centerX, -300, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);

            this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
            this.add.tween(this.logo).to({ y: 220 }, 2000, Phaser.Easing.Elastic.Out, true, 2000);

            this.input.onDown.addOnce(this.fadeOut, this);
        };
        MainMenu.prototype.fadeOut = function () {
            this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        };
        MainMenu.prototype.startGame = function () {
            this.game.state.start('Level1', true, false);
        };
        return MainMenu;
    })(Phaser.State);
    Spacemaths.MainMenu = MainMenu;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
    var OfficePicture = (function () {
        function OfficePicture(stage, frame_image, picture_image, frame_xy, picture_y) {
            this.stage = stage;

            this.group = stage.add.group();
            this.group.z = 1;
            this.group.x = frame_xy.x;
            this.group.y = frame_xy.y;

            this.group.create(0, 0, frame_image);
            this.group.create(0, picture_y, picture_image);
            this.group.setAll('anchor.x', 0.5);
            this.group.setAll('anchor.y', 0);
        }
        OfficePicture.prototype.update = function () {
        };
        OfficePicture.prototype.doShatter = function () {
            var tween = this.stage.game.add.tween(this.group).to({ angle: 3 }, 200, Phaser.Easing.Linear.None, true).to({ angle: 1 }, 250, Phaser.Easing.Linear.None, true).to({ angle: 2 }, 300, Phaser.Easing.Linear.None, true).to({ angle: 0 }, 400, Phaser.Easing.Linear.None, true);
        };
        return OfficePicture;
    })();
    Spacemaths.OfficePicture = OfficePicture;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
    var OfficeTaskSheet = (function () {
        function OfficeTaskSheet(stage, answerClicked, paperMovedOut) {
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

            var paper_img = this.stage.game.cache.getImage('paper');
            this.paper_size = {
                w: paper_img.width,
                h: paper_img.height
            };
        }
        OfficeTaskSheet.prototype.loadTask = function (data) {
            var str = data.values[0].toString();
            switch (data.operations[0]) {
                case 0 /* Plus */:
                    str += ' + ';
                    break;
                case 1 /* Minus */:
                    str += ' - ';
                    break;
                case 2 /* Multiply */:
                    str += ' * ';
                    break;
                case 3 /* Divide */:
                    str += ' / ';
                    break;
            }
            str += data.values[1].toString() + ' = ';

            //every xy is based on center, using percents!
            var half_w = this.paper_size.w * 0.5, half_h = this.paper_size.h * 0.5;
            this.stage.game.add.text(0, -half_h + 0.1 * this.paper_size.h, str, this.style, this.group);

            var x, y, text, fs = OfficeTaskSheet.FONT_SIZE;
            for (var i in data.answers) {
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
        };

        OfficeTaskSheet.prototype.moveIn = function () {
            this.group.exists = true;
            this.group.visible = true;
            this.stage.game.add.tween(this.group.scale).to({ x: 1, y: 1 }, 500, Phaser.Easing.Linear.None, true);
            //.onComplete.add();
        };

        OfficeTaskSheet.prototype.moveOut = function () {
            this.stage.game.add.tween(this.group.scale).to({ x: 0.1, y: 0.1 }, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.moveOutCallback, this);
        };

        OfficeTaskSheet.prototype.answerClickHandler = function (clickedText) {
            //true -> correct answer,
            //false -> wrong answer
            this.answerClicked(this.stage, clickedText['smIsCorrectAnswer']);
        };

        OfficeTaskSheet.prototype.clearTask = function () {
            this.group.removeBetween(1, this.group.length - 1, true);
        };

        OfficeTaskSheet.prototype.moveOutCallback = function () {
            this.group.exists = false;
            this.group.visible = false;
            this.clearTask();
            this.paperMovedOut(this.stage);
        };
        OfficeTaskSheet.FONT_SIZE = 108;
        return OfficeTaskSheet;
    })();
    Spacemaths.OfficeTaskSheet = OfficeTaskSheet;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            //  Set-up our preloader sprite
            var sizes = Spacemaths.Utils.getInstance().getGameSizes(), bar_img = this.game.cache.getImage('preloadBar'), cx = (sizes.w - bar_img.width) * 0.5, cy = (sizes.h - bar_img.height) * 0.5;
            this.preloadBar = this.add.sprite(cx, cy, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);

            //  Load our actual games assets
            this.load.image('table_clock', 'assets/clock.png');
            this.load.image('table_clock_arrow', 'assets/clock_arrow.png');
            this.load.image('engineer', 'assets/engineer.png');
            this.load.image('hand_left', 'assets/hand_left.png');
            this.load.image('hand_right', 'assets/hand_right.png');
            this.load.image('paper', 'assets/paper.png');
            this.load.image('wall_picture', 'assets/picture.png');
            this.load.image('wall_picture_frame', 'assets/picture_frame.png');
            this.load.image('table', 'assets/table.png');
            this.load.image('wall', 'assets/wall.png');
            this.load.image('floor', 'assets/floor.png');
            this.load.image('battery', 'assets/battery.png');
            this.load.image('computer', 'assets/computer.png');
            this.load.image('door_back', 'assets/door_back.png');
            this.load.spritesheet('door', 'assets/door.png', 272, 650, 2);
            /*this.load.audio('music', 'assets/title.mp3', true);
            this.load.spritesheet('simon', 'assets/simon.png', 58, 96, 5);
            this.load.image('level1', 'assets/level1.png');*/
        };

        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        };

        Preloader.prototype.startMainMenu = function () {
            //this.game.state.start('MainMenu', true, false);
            this.game.state.start('StageOffice', true, false);
        };
        return Preloader;
    })(Phaser.State);
    Spacemaths.Preloader = Preloader;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
    var StageOffice = (function (_super) {
        __extends(StageOffice, _super);
        function StageOffice() {
            _super.apply(this, arguments);
            this.engineer_is_busy = false;
            this.correctAnswers = 0;
        }
        StageOffice.prototype.create = function () {
            this.task_generator = new Spacemaths.TaskGenerator;

            var wall = this.game.cache.getImage('wall'), floor = this.game.cache.getImage('floor'), battery = this.game.cache.getImage('battery'), door = this.game.cache.getImage('door'), wall_h = wall.height, floor_h = floor.height;
            this.background = {
                wall: this.add.sprite(0, 0, 'wall'),
                floor: this.add.sprite(0, wall_h, 'floor'),
                table: this.add.sprite(0, wall_h + floor_h, 'table'),
                battery: this.add.sprite(128, wall_h - battery.height, 'battery'),
                door_back: this.add.sprite(710, wall_h - door.height + 68, 'door_back', 0)
            };
            this.picture = new Spacemaths.OfficePicture(this, 'wall_picture_frame', 'wall_picture', { x: 320, y: 241 }, 133);

            this.clock = {
                base: this.add.sprite(824, 1372, 'table_clock'),
                //-217 из-за anchor.x == 1
                arrow: this.add.sprite(824 + 217, 1372, 'table_clock_arrow')
            };
            this.clock.arrow.anchor.x = 1;

            var eng = this.game.cache.getImage('engineer');
            this.engineer = new Spacemaths.Engineer(this.game, 710, wall_h - eng.height, this.engineer_moved_in, this.engineer_moved_out, this);
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
            };

            this.taskSheet = new Spacemaths.OfficeTaskSheet(this, this.answerClicked, this.paperMovedOut);

            var sizes = Spacemaths.Utils.getInstance().getGameSizes();
            this.shadow = new Phaser.Rectangle(0, 0, sizes.w, sizes.h);
            this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        };
        StageOffice.prototype.answerClicked = function (self, is_correct) {
            if (is_correct)
                self.correctAnswers++;
            self.taskSheet.moveOut();
        };
        StageOffice.prototype.paperMovedOut = function (self) {
            self.engineer.move_out();
        };
        StageOffice.prototype.render = function () {
        };
        StageOffice.prototype.engineer_moved_in = function () {
            var task = this.task_generator.generateTask();
            this.taskSheet.loadTask(task);
            this.taskSheet.moveIn();
            /*console.log(JSON.stringify(task));
            this.engineer.move_out();*/
        };
        StageOffice.prototype.engineer_moved_out = function () {
            this.engineer.exists = false;
            this.engineer_is_busy = false;
            this.door.play('closed');
            this.picture.doShatter();
        };
        StageOffice.prototype.update = function () {
            if (this.spaceKey.isDown && this.engineer_is_busy === false) {
                this.engineer_is_busy = true;
                this.engineer.exists = true;
                this.engineer.move_in();
                this.door.play('open');
            }
        };
        return StageOffice;
    })(Phaser.State);
    Spacemaths.StageOffice = StageOffice;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
    (function (MathOperation) {
        MathOperation[MathOperation["Plus"] = 0] = "Plus";
        MathOperation[MathOperation["Minus"] = 1] = "Minus";
        MathOperation[MathOperation["Multiply"] = 2] = "Multiply";
        MathOperation[MathOperation["Divide"] = 3] = "Divide";
    })(Spacemaths.MathOperation || (Spacemaths.MathOperation = {}));
    var MathOperation = Spacemaths.MathOperation;

    var TaskGenerator = (function () {
        function TaskGenerator() {
            if (TaskGenerator.instance === null)
                TaskGenerator.instance = this;
        }
        TaskGenerator.getInstance = function () {
            if (TaskGenerator.instance === null)
                TaskGenerator.instance = new TaskGenerator();
            return TaskGenerator.instance;
        };
        TaskGenerator.prototype.generateTask = function () {
            var values = [Math.round(Math.random() * 50 + 1), Math.round(Math.random() * 50 + 1)], operation = Math.round(Math.random()), answers = [], correct_answer_index = Math.round(6 * Math.random() - 0.5);
            for (var i = 0; i < 6; i++) {
                if (i == correct_answer_index) {
                    switch (operation) {
                        case 0 /* Plus */:
                            answers[i] = values[0] + values[1];
                            break;
                        case 1 /* Minus */:
                            answers[i] = values[0] - values[1];
                            break;
                    }
                } else {
                    answers[i] = Math.abs(Math.round(100 * Math.random()) - 50);
                }
            }
            return {
                answers: answers,
                correct_answer_index: correct_answer_index,
                operations: [operation],
                values: values
            };
        };
        TaskGenerator.instance = null;
        return TaskGenerator;
    })();
    Spacemaths.TaskGenerator = TaskGenerator;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
    var Utils = (function () {
        function Utils() {
            if (Utils.self === null) {
                Utils.self = this;
            }
            this.game_w = 1080 * window.devicePixelRatio;
            this.game_h = 1920 * window.devicePixelRatio;
        }
        Utils.getInstance = function () {
            if (this.self === null) {
                Utils.self = new Utils();
            }
            return this.self;
        };
        Utils.prototype.getGameSizes = function () {
            return { w: this.game_w, h: this.game_h };
        };
        Utils.self = null;
        return Utils;
    })();
    Spacemaths.Utils = Utils;
})(Spacemaths || (Spacemaths = {}));
//# sourceMappingURL=game.js.map
