module Spacemaths {
    export class Const {
        public static STAGE_OFFICE = {
            STAGE_LENGTH: 60000, //продолжительность одного дня, мс
            ENGINEER_WAIT_TIME: 500 //время простоя между уходом предыдущего и заходом текущего инженера, мс
        }
        //диапазон длительностей для прохождения сессии, количество дней для разных уровней
        public static LEVEL_DAYS = (() => {
            var ret: { min: number; max: number}[] = [];
            ret[GameLevel.Space] = { min: 1, max: 3 };
            ret[GameLevel.Moon] = { min: 2, max: 4 };
            ret[GameLevel.Mars] = { min: 4, max: 7 };
            return ret;
        })();
    }
}