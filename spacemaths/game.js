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
                this.game.scale.forcePortrait = true;
            }

            this.game.scale.minWidth = 480;
            this.game.scale.minHeight = 800;
            this.game.scale.maxHeight = 1920;
            this.game.scale.maxWidth = 1080;
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            //this.game.scale.setShowAll();
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            this.game.scale.refresh();
            this.game.scale.setScreenSize(true);
            this.game.scale.setExactFit();

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
            //this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.game.state.start('Preloader', true, false);

            var self = this;
            window.addEventListener('resize', function (event) {
                self.game.scale.setExactFit();
                self.game.scale.refresh();
            });
        };
        return Boot;
    })(Phaser.State);
    Spacemaths.Boot = Boot;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
    var Const = (function () {
        function Const() {
        }
        Const.STAGE_OFFICE = {
            STAGE_LENGTH: 60000,
            ENGINEER_WAIT_TIME: 500
        };

        Const.LEVEL_DAYS = (function () {
            var ret = [];
            ret[0 /* Space */] = { min: 1, max: 3 };
            ret[1 /* Moon */] = { min: 2, max: 4 };
            ret[2 /* Mars */] = { min: 4, max: 7 };
            return ret;
        })();
        return Const;
    })();
    Spacemaths.Const = Const;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
    (function (EngineerActionState) {
        EngineerActionState[EngineerActionState["IDLE"] = 0] = "IDLE";
        EngineerActionState[EngineerActionState["MOVE_IN"] = 1] = "MOVE_IN";
        EngineerActionState[EngineerActionState["MOVE_OUT"] = 2] = "MOVE_OUT";
    })(Spacemaths.EngineerActionState || (Spacemaths.EngineerActionState = {}));
    var EngineerActionState = Spacemaths.EngineerActionState;
    ;
    (function (GameLevel) {
        GameLevel[GameLevel["Space"] = 0] = "Space";
        GameLevel[GameLevel["Moon"] = 1] = "Moon";
        GameLevel[GameLevel["Mars"] = 2] = "Mars";
    })(Spacemaths.GameLevel || (Spacemaths.GameLevel = {}));
    var GameLevel = Spacemaths.GameLevel;
    (function (MathOperation) {
        MathOperation[MathOperation["Plus"] = 0] = "Plus";
        MathOperation[MathOperation["Minus"] = 1] = "Minus";
        MathOperation[MathOperation["Multiply"] = 2] = "Multiply";
        MathOperation[MathOperation["Divide"] = 3] = "Divide";
    })(Spacemaths.MathOperation || (Spacemaths.MathOperation = {}));
    var MathOperation = Spacemaths.MathOperation;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
    var Engineer = (function (_super) {
        __extends(Engineer, _super);
        function Engineer(game, x, y, move_in_callback, move_out_callback, stage_office) {
            _super.call(this, game, x, y, 'engineer', 0);
            this.action_state = 0 /* IDLE */;
            this.move_in_coords = { x: 0, y: 0 };
            this.move_out_coords = { x: 0, y: 0 };
            this.move_epsylon = 5;
            this.move_in_callback = move_in_callback;
            this.move_out_callback = move_out_callback;
            this.stage_office = stage_office;
            this.anchor.setTo(0.5, 0.5);

            /*this.game.physics.arcade.enableBody(this);*/
            game.add.existing(this);

            this.game.add.tween(this).to({ rotation: Math.PI / 50 }, 250, Phaser.Easing.Linear.None, true).to({ rotation: -Math.PI / 50 }, 250, Phaser.Easing.Linear.None, true).loop().start();
        }
        Engineer.prototype.update = function () {
        };
        Engineer.prototype.move_in = function () {
            var tween = this.game.add.tween(this).to({
                x: this.move_in_coords.x,
                y: this.move_in_coords.y
            }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.move_in_callback, this.stage_office);
        };
        Engineer.prototype.move_out = function () {
            var tween = this.game.add.tween(this).to({
                x: this.move_out_coords.x,
                y: this.move_out_coords.y
            }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.move_out_callback, this.stage_office);
        };
        Engineer.prototype.setMoveInXY = function (x, y) {
            this.move_in_coords.x = x;
            this.move_in_coords.y = y;
        };
        Engineer.prototype.setMoveOutXY = function (x, y) {
            this.move_out_coords.x = x;
            this.move_out_coords.y = y;
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
            this.state.add('MainMenu', Spacemaths.MainMenu, false);
            this.state.add('StageOffice', Spacemaths.StageOffice, false);
            this.state.add('StageDayResults', Spacemaths.StageDayResults, false);
            this.state.add('StageLevelSelect', Spacemaths.StageLevelSelect, false);
            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    Spacemaths.Game = Game;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
    var GameSessionData = (function () {
        function GameSessionData(data) {
            this._currentLevel = data.currentLevel;
            this._currentDay = data.currentDay;
            this._totalDays = data.totalDays;
            this._correctAnswers = data.correctAnswers;
            this._totalQuestions = data.totalQuestions;
            this._wrongAnswers = data.wrongAnswers;
        }
        GameSessionData.prototype.getSessionData = function () {
            return {
                correctAnswers: this._correctAnswers,
                currentDay: this._currentDay,
                currentLevel: this._currentLevel,
                totalDays: this._totalDays,
                totalQuestions: this._totalQuestions,
                wrongAnswers: this._wrongAnswers
            };
        };
        GameSessionData.prototype.wrongAnswersCount = function () {
            return this._wrongAnswers;
        };
        GameSessionData.prototype.pushAnswer = function (task, givenAnswerIndex) {
            this._totalQuestions++;
            if (givenAnswerIndex == task.correct_answer_index) {
                this._correctAnswers++;
            } else {
                this._wrongAnswers.push({ task: task, givenAnswerIndex: givenAnswerIndex });
            }
        };
        return GameSessionData;
    })();
    Spacemaths.GameSessionData = GameSessionData;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
    var GameStorage = (function () {
        function GameStorage() {
            if (GameStorage.self === null) {
                GameStorage.self = this;
                this.initialLoad();
            }
        }
        GameStorage.getInstance = function () {
            if (this.self === null) {
                GameStorage.self = new GameStorage();
            }
            return this.self;
        };
        GameStorage.prototype.hasLevelAccess = function (level) {
            return this.levelAccess[level];
        };
        GameStorage.prototype.getSessionData = function () {
            return this.sessionData;
        };
        GameStorage.prototype.saveSessionData = function () {
            this.save(GameStorage.KEY_GAME_SESSION, this.sessionData);
        };

        GameStorage.prototype.initialLoad = function () {
            //load level access
            var data = this.load(GameStorage.KEY_LEVEL_ACCESS);
            if (data) {
                this.levelAccess = data;
            } else {
                this.levelAccess = [];
                this.levelAccess[0 /* Space */] = true;
                this.levelAccess[1 /* Moon */] = false;
                this.levelAccess[2 /* Mars */] = false;
                this.save(GameStorage.KEY_LEVEL_ACCESS, this.levelAccess);
                //localStorage.setItem(GameStorage.KEY_LEVEL_ACCESS, JSON.stringify(this.levelAccess));
            }

            //load last game session data to continue playing
            data = this.load(GameStorage.KEY_GAME_SESSION); //localStorage.getItem(GameStorage.KEY_GAME_SESSION);
            if (data) {
                this.sessionData = data; //JSON.parse(data);
            } else {
                this.sessionData = {
                    correctAnswers: 0,
                    currentDay: 0,
                    currentLevel: 0 /* Space */,
                    totalDays: 0,
                    totalQuestions: 0,
                    wrongAnswers: []
                };

                //localStorage.setItem(GameStorage.KEY_GAME_SESSION, JSON.stringify(this.sessionData));
                this.save(GameStorage.KEY_GAME_SESSION, this.sessionData);
            }
        };
        GameStorage.prototype.save = function (key, value) {
            localStorage.setItem(key, (typeof value).toLowerCase() === 'object' ? JSON.stringify(value) : value);
        };
        GameStorage.prototype.load = function (key) {
            var d = localStorage.getItem(key);
            if (typeof d !== 'undefined') {
                d = JSON.parse(d);
            }
            return d;
        };
        GameStorage.KEY_LEVEL_ACCESS = 'levelAccess';
        GameStorage.KEY_GAME_SESSION = 'gameSessionData';

        GameStorage.self = null;
        return GameStorage;
    })();
    Spacemaths.GameStorage = GameStorage;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            this.playButton = this.add.button(this.game.world.centerX, this.game.world.centerY, 'button_startgame', this.playClicked, this, 0, 1, 2);
            this.playButton.anchor.setTo(0.5, 0.5);
            /*this.background = this.add.sprite(0, 0, 'titlepage');
            this.background.alpha = 0;
            
            this.logo = this.add.sprite(this.world.centerX, -300, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);
            
            this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
            this.add.tween(this.logo).to({ y: 220 }, 2000, Phaser.Easing.Elastic.Out, true, 2000);*/
            //this.input.onDown.addOnce(this.fadeOut, this);
        };
        MainMenu.prototype.playClicked = function () {
            this.fadeOut();
        };
        MainMenu.prototype.fadeOut = function () {
            this.add.tween(this.playButton).to({ y: this.game.world.height + this.playButton.height }, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.startGame, this);
        };
        MainMenu.prototype.startGame = function () {
            //this.game.state.start('StageOffice', true, false);
            this.game.transitions.to('StageLevelSelect');
        };
        return MainMenu;
    })(Phaser.State);
    Spacemaths.MainMenu = MainMenu;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
    var OfficeClock = (function () {
        function OfficeClock(stage, base_img_key, arrow_img_key, xy) {
            this.callback_time = 0;
            var b_img = stage.game.cache.getImage(base_img_key), a_img = stage.game.cache.getImage(arrow_img_key);
            this.base = stage.add.sprite(xy.x, xy.y, base_img_key);
            var x = xy.x + a_img.width + 0.2 * b_img.width, y = xy.y + 0.5 * a_img.height + 0.375 * b_img.height;
            this.arrow = stage.add.sprite(x, y, arrow_img_key);
            this.arrow.anchor.x = 1;
            this.arrow.anchor.y = 0.5;
            this.stage = stage;
        }
        OfficeClock.prototype.resetTimeOut = function (new_time_ms, callback) {
            this.timeout_callback = callback;
            this.callback_time = new_time_ms;
            this.arrow.angle = 0;
            this.timer_elapsed_time = 0;
            if (this.timer) {
                this.timer.stop();
                this.timer.removeAll();
                this.timer.destroy();
            }
            this.timer = this.stage.game.time.create(false);
            this.timer_tick_time = new_time_ms / OfficeClock.TICKS_NUMBER;
            this.timer.loop(this.timer_tick_time, this.timerEvent, this);
            this.timer.start();
        };

        OfficeClock.prototype.timerEvent = function () {
            this.timer_elapsed_time += this.timer_tick_time;
            this.arrow.rotation = 1.5 * Math.PI * (this.timer_elapsed_time / this.callback_time);
            if (this.timer_elapsed_time >= this.callback_time) {
                this.timeout_callback(this.stage);
                this.timer.removeAll();
                this.timer.destroy();
            }
        };
        OfficeClock.TICKS_NUMBER = 45;
        return OfficeClock;
    })();
    Spacemaths.OfficeClock = OfficeClock;
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
            var tween = this.stage.game.add.tween(this.group).to({ rotation: Math.PI / 60 }, 200, Phaser.Easing.Linear.None, true).to({ rotation: Math.PI / 180 }, 250, Phaser.Easing.Linear.None, true).to({ rotation: Math.PI / 90 }, 300, Phaser.Easing.Linear.None, true).to({ rotation: 0 }, 400, Phaser.Easing.Linear.None, true);
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
                text.isCorrectAnswer = i == data.correctAnswerIndex;
                text.questionData = data;
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
            this.answerClicked(this.stage, clickedText.questionData, clickedText.isCorrectAnswer);
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
            var game = this.game;
            game.transitions = this.game['plugins'].add(Phaser.Plugin.StateTransition);
            game.transitions.settings({
                duration: 1000,
                properties: {
                    alpha: 0,
                    scale: {
                        x: 1.5,
                        y: 1.5
                    }
                }
            });

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
            this.load.spritesheet('button_startgame', 'assets/button_startgame.png', 579, 213, 3);
            this.load.spritesheet('buttons_level', 'assets/buttons_level.png', 800, 400, 9);
            /*this.load.audio('music', 'assets/title.mp3', true);
            this.load.spritesheet('simon', 'assets/simon.png', 58, 96, 5);
            this.load.image('level1', 'assets/level1.png');*/
        };

        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloadBar).to({ alpha: -105 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        };

        Preloader.prototype.startMainMenu = function () {
            this.game.state.start('MainMenu', true, false);
            //this.game.state.start('StageOffice', true, false);
        };
        return Preloader;
    })(Phaser.State);
    Spacemaths.Preloader = Preloader;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
    var StageDayResults = (function (_super) {
        __extends(StageDayResults, _super);
        function StageDayResults() {
            _super.apply(this, arguments);
        }
        StageDayResults.prototype.create = function () {
        };
        return StageDayResults;
    })(Phaser.Stage);
    Spacemaths.StageDayResults = StageDayResults;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
    var StageLevelSelect = (function (_super) {
        __extends(StageLevelSelect, _super);
        function StageLevelSelect() {
            _super.apply(this, arguments);
        }
        StageLevelSelect.prototype.create = function () {
            var height = this.game.world.height, storage = Spacemaths.GameStorage.getInstance(), isMoonEnabled = storage.hasLevelAccess(1 /* Moon */), isMarsEnabled = storage.hasLevelAccess(2 /* Mars */);

            this.button_space = this.add.button(this.game.world.centerX, 0.1 * height, 'buttons_level', this.selectSpace, this, 0, 0, 2, 0);
            if (isMoonEnabled) {
                this.button_moon = this.add.button(this.game.world.centerX, 0.4 * height, 'buttons_level', this.selectMoon, this, 3, 3, 5, 3);
            } else {
                this.button_moon = this.add.button(this.game.world.centerX, 0.4 * height, 'buttons_level', this.purchaseMoonAccess, this, 4, 4, 4, 4);
            }
            if (isMarsEnabled) {
                this.button_mars = this.add.button(this.game.world.centerX, 0.7 * height, 'buttons_level', this.selectMars, this, 6, 6, 8, 6);
            } else {
                this.button_mars = this.add.button(this.game.world.centerX, 0.7 * height, 'buttons_level', this.purchaseMarsAccess, this, 7, 7, 7, 7);
            }
            this.button_space.anchor.x = 0.5;
            this.button_mars.anchor.x = 0.5;
            this.button_moon.anchor.x = 0.5;
        };

        StageLevelSelect.prototype.purchaseMoonAccess = function () {
            alert('Purchase moon access here!');
        };

        StageLevelSelect.prototype.purchaseMarsAccess = function () {
            alert('Purchase mars access here!');
        };

        StageLevelSelect.prototype.selectSpace = function () {
            //(<Game>this.game).transitions.to('StageOffice');
            this.startStage(0 /* Space */);
        };

        StageLevelSelect.prototype.selectMoon = function () {
            //(<Game>this.game).transitions.to('StageOffice');
            this.startStage(1 /* Moon */);
        };

        StageLevelSelect.prototype.selectMars = function () {
            //(<Game>this.game).transitions.to('StageOffice');
            this.startStage(2 /* Mars */);
        };

        StageLevelSelect.prototype.startStage = function (level) {
            var sessionData = {
                correctAnswers: 0,
                currentDay: 0,
                currentLevel: level,
                totalDays: this.game.rnd.integerInRange(Spacemaths.Const.LEVEL_DAYS[level].min, Spacemaths.Const.LEVEL_DAYS[level].max),
                totalQuestions: 0,
                wrongAnswers: []
            };

            this.stage.game.add.tween(this.button_space).to({
                x: -this.button_space.width
            }, 500, Phaser.Easing.Linear.None, true);
            this.stage.game.add.tween(this.button_moon).to({
                x: this.game.world.width + this.button_moon.width
            }, 500, Phaser.Easing.Linear.None, true);
            this.stage.game.add.tween(this.button_mars).to({
                y: this.game.world.height
            }, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.loadOffice, this);
        };

        StageLevelSelect.prototype.loadOffice = function () {
            this.game.state.start('StageOffice', true, false);
        };
        return StageLevelSelect;
    })(Phaser.State);
    Spacemaths.StageLevelSelect = StageLevelSelect;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
    var StageOffice = (function (_super) {
        __extends(StageOffice, _super);
        function StageOffice() {
            _super.apply(this, arguments);
            //isEngineerBusy: boolean = false;
            this.correctAnswers = 0;
            this.isTimeOut = false;
        }
        StageOffice.prototype.create = function () {
            this.correctAnswers = 0;
            this.isTimeOut = false;
            this.task_generator = Spacemaths.TaskGenerator.getInstance();
            var wall = this.game.cache.getImage('wall'), floor = this.game.cache.getImage('floor'), battery = this.game.cache.getImage('battery'), door = this.game.cache.getImage('door'), wall_h = wall.height, floor_h = floor.height;
            this.background = {
                wall: this.add.sprite(0, 0, 'wall'),
                floor: this.add.sprite(0, wall_h, 'floor'),
                table: this.add.sprite(0, wall_h + floor_h, 'table'),
                battery: this.add.sprite(128, wall_h - battery.height, 'battery'),
                door_back: this.add.sprite(710, wall_h - door.height + 68, 'door_back', 0)
            };
            this.picture = new Spacemaths.OfficePicture(this, 'wall_picture_frame', 'wall_picture', { x: 320, y: 241 }, 133);

            this.clock = new Spacemaths.OfficeClock(this, 'table_clock', 'table_clock_arrow', { x: 824, y: 1372 });

            var eng = this.game.cache.getImage('engineer'), x = 710 + eng.width * 0.5, y = wall_h - eng.height * 0.5;
            this.engineer = new Spacemaths.Engineer(this.game, x, y, this.engineer_moved_in, this.engineer_moved_out, this);
            this.engineer.exists = false;
            this.engineer.z = 3;
            this.engineer.setMoveOutXY(x, y);
            this.engineer.setMoveInXY(this.game.world.centerX, this.game.world.centerY - 0.5 * eng.height);

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

            //clock initialization here
            this.clock.resetTimeOut(Spacemaths.Const.STAGE_OFFICE.STAGE_LENGTH, this.timeIsOutCallback);
            this.timer = this.game.time.create(false);
            this.timer.loop(Spacemaths.Const.STAGE_OFFICE.ENGINEER_WAIT_TIME, this.sendEngineer, this);
            this.timer.start();
        };
        StageOffice.prototype.sendEngineer = function () {
            this.timer.pause();
            this.engineer.exists = true;
            this.engineer.move_in();
            this.door.play('open');
        };
        StageOffice.prototype.answerClicked = function (self, data, isCorrect) {
            if (isCorrect)
                self.correctAnswers++;
            self.taskSheet.moveOut();
        };
        StageOffice.prototype.paperMovedOut = function (self) {
            self.engineer.move_out();
        };
        StageOffice.prototype.timeIsOutCallback = function (self) {
            self.isTimeOut = true;
        };

        /*render() {
        
        }*/
        StageOffice.prototype.engineer_moved_in = function () {
            var task = this.task_generator.generateTask();
            this.taskSheet.loadTask(task);
            this.taskSheet.moveIn();
            /*console.log(JSON.stringify(task));
            this.engineer.move_out();*/
        };
        StageOffice.prototype.engineer_moved_out = function () {
            this.engineer.exists = false;

            //this.isEngineerBusy = false;
            this.door.play('closed');
            this.picture.doShatter();
            if (this.isTimeOut) {
                this.timer.stop();
                console.log("Correct answers: " + this.correctAnswers);
                this.game.transitions.to('StageLevelSelect');
            } else {
                this.timer.resume();
            }
        };
        StageOffice.prototype.render = function () {
        };
        StageOffice.prototype.update = function () {
            /*if (this.spaceKey.isDown && this.isEngineerBusy === false)
            {
            this.isEngineerBusy = true;
            this.engineer.exists = true;
            this.engineer.move_in();
            this.door.play('open');
            }*/
        };
        StageOffice.prototype.shutdown = function () {
        };
        return StageOffice;
    })(Phaser.State);
    Spacemaths.StageOffice = StageOffice;
})(Spacemaths || (Spacemaths = {}));
var Spacemaths;
(function (Spacemaths) {
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
            var values = [Math.round(Math.random() * 50 + 1), Math.round(Math.random() * 50 + 1)], operation = Math.round(Math.random()), answers = [], correct_answer_index = Math.round(6 * Math.random() - 0.49);

            switch (operation) {
                case 0 /* Plus */:
                    answers[correct_answer_index] = values[0] + values[1];
                    break;
                case 1 /* Minus */:
                    answers[correct_answer_index] = values[0] - values[1];
                    break;
            }

            for (var i = 0; i < 6; i++) {
                if (i != correct_answer_index) {
                    do {
                        answers[i] = Math.abs(Math.round(100 * Math.random()) - 50);
                    } while(answers[i] == answers[correct_answer_index]);
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
