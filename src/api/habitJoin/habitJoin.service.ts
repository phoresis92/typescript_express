import moment = require('moment');
import {Container, Service, Inject} from 'typedi';
import {promisify} from 'util';
import TokenInterface from '../../interfaces/token.interface';

import UtilsClass from '../../utils/utils';

import ConfigClass from '../../config/config.dto';
import AuthDAOClass from '../auth/auth.dao';
import MemberStatusDtoClass from './dto/memberStatus.dto';
import HabitJoinDAOClass from './habitJoin.dao';
import HabitDAOClass from '../habit/habit.dao';

import ErrorResponse from "../../utils/response/ErrorResponse";

@Service()
export default class HabitJoinService {

    @Inject()
    private Config: ConfigClass;
    @Inject()
    private HabitJoinDAO: HabitJoinDAOClass;
    @Inject()
    private HabitDAO: HabitDAOClass;
    @Inject()
    private AuthDAO: AuthDAOClass;
    // @Inject('redis')
    // private Redis: RedisClient;

    constructor() {};

    public habitJoinService = async (habitSeq: number, token: TokenInterface): Promise<any> => {

        /** Exist Check **/
        {
             const [habitData, joinData] = await this.HabitDAO.getRoomBySeq(habitSeq, token);

             if(!habitData){
                 throw new ErrorResponse(404, 'Not Exist habitSeq', '01');
                 return;
             }
            if(habitData.habit_status === 10){
                throw new ErrorResponse(400, 'Deleted Habit', '02');
                return;
            }
            if(habitData.habit_status === 20){
                throw new ErrorResponse(400, 'Rejected Habit', '03');
                return;
            }
            if(habitData.habit_status === 30){
                throw new ErrorResponse(400, 'Habit Wait For Permission', '04');
                return;
            }

            if(joinData){
                 if(joinData.join_status === 100){
                     throw new ErrorResponse(400, 'Already Joined', '11');
                     return;
                 }
                 if(joinData.join_status === 10){
                     throw new ErrorResponse(400, 'Waiting for Allow', '12');
                     return;
                 }
             }
        }

        /** Insert Habit Join **/
        {
            return await this.HabitJoinDAO.insertHabitJoin(habitSeq, token);
        }

    };

    public habitJoinCancelService = async (habitSeq: number, token: TokenInterface): Promise<any> => {

        /** Exist Check **/
        {
             const [habitData, joinData] = await this.HabitDAO.getRoomBySeq(habitSeq, token);

             if(!habitData){
                 throw new ErrorResponse(404, 'Not Exist habitSeq', '01');
                 return;
             }
             if(habitData.habit_status === 10){
                 throw new ErrorResponse(400, 'Deleted Habit', '02');
                 return;
             }
             if(habitData.habit_status === 20){
                 throw new ErrorResponse(400, 'Rejected Habit', '03');
                 return;
             }
             if(habitData.habit_status === 30){
                 throw new ErrorResponse(400, 'Habit Wait For Permission', '04');
                 return;
             }

             if(!joinData){
                 throw new ErrorResponse(400, 'Not Exist JoinData', '11');
                 return;
             }
             if(joinData.join_status === 100){
                 throw new ErrorResponse(400, 'Already Joined', '12');
                 return;
             }
             if(joinData.join_status === 30){
                 throw new ErrorResponse(400, 'Rejected Join', '13');
                 return;
             }
             if(joinData.join_status === 70){
                 throw new ErrorResponse(400, 'Withdraw Join', '14');
                 return;
             }
             if(joinData.join_status === 0){
                 throw new ErrorResponse(400, 'Already Canceled', '15');
                 return;
             }
        }

        /** Insert Habit Join **/
        {
            return await this.HabitJoinDAO.cancelHabitJoin(habitSeq, token);
        }

    };

    public withdrawHabitService = async (habitSeq: number, token: TokenInterface): Promise<any> => {

        /** Exist Check **/
        {
            const [habitData, joinData] = await this.HabitDAO.getRoomBySeq(habitSeq, token);

            if(!habitData){
                throw new ErrorResponse(404, 'Not Exist habitSeq', '01');
                return;
            }
            if(habitData.habit_status === 10){
                throw new ErrorResponse(400, 'Deleted Habit', '02');
                return;
            }
            if(habitData.habit_status === 20){
                throw new ErrorResponse(400, 'Rejected Habit', '03');
                return;
            }
            if(habitData.habit_status === 30){
                throw new ErrorResponse(400, 'Habit Wait For Permission', '04');
                return;
            }

            if(!joinData){
                throw new ErrorResponse(400, 'Not Exist JoinData', '11');
                return;
            }
            if(joinData.join_status === 70){
                throw new ErrorResponse(400, 'Already Withdraw', '12');
                return;
            }
            if(joinData.join_status === 30){
                throw new ErrorResponse(400, 'Rejected Join', '13');
                return;
            }
            if(joinData.join_status === 10){
                throw new ErrorResponse(400, 'Wait For Allow', '14');
                return;
            }
            if(joinData.join_status === 0){
                throw new ErrorResponse(400, 'Canceled Join', '15');
                return;
            }

            if(joinData.is_leader === 50){
                throw new ErrorResponse(400, 'Head Leader can not withdraw', '15');
                return;
            }
        }

        /** Withdraw Habit Join **/
        {
            return await this.HabitJoinDAO.withdrawHabitJoin(habitSeq, token);
        }

    };

    // ========================================================================================================================

    public memberListService = async (habitSeq: number, token: TokenInterface, page: number, listType: number): Promise<any> => {

        /** Exist Check **/
        let permission: string[] = ['100'];
        {
            const [habitData, joinData] = await this.HabitDAO.getRoomBySeq(habitSeq, token);

            if(!habitData){
                throw new ErrorResponse(404, 'Not Exist habitSeq', '01');
                return;
            }
            if(habitData.habit_status === 10){
                throw new ErrorResponse(400, 'Deleted Habit', '02');
                return;
            }
            if(habitData.habit_status === 20){
                throw new ErrorResponse(400, 'Rejected Habit', '03');
                return;
            }
            if(habitData.habit_status === 30){
                throw new ErrorResponse(400, 'Habit Wait For Permission', '04');
                return;
            }

            if(!joinData){
                throw new ErrorResponse(400, 'Not Exist JoinData', '11');
                return;
            }
            if(joinData.join_status === 70){
                throw new ErrorResponse(400, 'Withdraw Habit', '12');
                return;
            }
            if(joinData.join_status === 30){
                throw new ErrorResponse(400, 'Rejected Join', '13');
                return;
            }
            if(joinData.join_status === 10){
                throw new ErrorResponse(400, 'Wait For Allow', '14');
                return;
            }
            if(joinData.join_status === 0){
                throw new ErrorResponse(400, 'Canceled Join', '15');
                return;
            }

            if(joinData.is_leader === 50){
                permission.push('10')
            }else if(listType !== 1){
                throw new ErrorResponse(403, 'Permission Deny (listType)', '403')
            }
        }

        return await this.HabitJoinDAO.memberList(habitSeq, token, page, listType, permission);

    };

    public memberStatusService = async (MemberStatusDto: MemberStatusDtoClass, token: TokenInterface): Promise<any> => {

        /** Exist Check **/
        {
            const [habitData, joinData] = await this.HabitDAO.getRoomBySeq(MemberStatusDto.habitSeq, token);

            if(!habitData){
                throw new ErrorResponse(404, 'Not Exist habitSeq', '01');
                return;
            }
            if(habitData.habit_status === 10){
                throw new ErrorResponse(400, 'Deleted Habit', '02');
                return;
            }
            if(habitData.habit_status === 20){
                throw new ErrorResponse(400, 'Rejected Habit', '03');
                return;
            }
            if(habitData.habit_status === 30){
                throw new ErrorResponse(400, 'Habit Wait For Permission', '04');
                return;
            }

            if(!joinData){
                throw new ErrorResponse(400, 'Not Exist JoinData', '11');
                return;
            }
            if(joinData.join_status === 70){
                throw new ErrorResponse(400, 'Withdraw Habit', '12');
                return;
            }
            if(joinData.join_status === 30){
                throw new ErrorResponse(400, 'Rejected Join', '13');
                return;
            }
            if(joinData.join_status === 10){
                throw new ErrorResponse(400, 'Wait For Allow', '14');
                return;
            }
            if(joinData.join_status === 0){
                throw new ErrorResponse(400, 'Canceled Join', '15');
                return;
            }

            if(joinData.is_leader !== 50){
                throw new ErrorResponse(403, 'Not Head Leader', '21');
                return;
            }
        }

        const targetUserData = await this.AuthDAO.getUserByUuid(MemberStatusDto.uuid);

        const targetJoinData = await this.HabitJoinDAO.getTargetStatus(MemberStatusDto, token, targetUserData);

        if(!targetJoinData){
            throw new ErrorResponse(400, 'Target is not exist', '31');
            return;
        }

        switch (MemberStatusDto.statusType) {
            case 'APPROVE' :
                console.log(targetJoinData);
                if (targetJoinData.join_status !== 10) {
                    throw new ErrorResponse(400, 'Bad Status', '41');
                    return;
                }

                await this.HabitJoinDAO.changeTargetStatus(MemberStatusDto.habitSeq, targetUserData.user_id, 100);

                // Alarm.funcSendAlarm('GROUP_JOIN_APPROVE', data.groupSeq, '', data.targetKey, '', '', '');

                break;

            case 'REFUSE' :
                if (targetJoinData.join_status != 10) {
                    throw new ErrorResponse(400, 'Bad Status', '41');
                    return;
                }

                await this.HabitJoinDAO.changeTargetStatus(MemberStatusDto.habitSeq, targetUserData.user_id, 30);

                break;

            case 'FORCE_DROP' :
                if (targetJoinData.join_status != 100) {
                    throw new ErrorResponse(400, 'Bad Status', '41');
                    return;
                }

                await this.HabitJoinDAO.changeTargetStatus(MemberStatusDto.habitSeq, targetUserData.user_id, 70);

                break;

        }

        if(targetJoinData.join_status)

        return true;

    };

}
