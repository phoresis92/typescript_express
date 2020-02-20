import { Container } from 'typedi';
import LoggerInstance from './logger';
// import agendaFactory from './agenda';
import config from '../config';
import { SuccessResponse, Utils } from '../utils';
import mysql from './MysqlTemplate';
// import mailgun from 'mailgun-js';

export default ({ /*mongoConnection*/ models }: { /*mongoConnection;*/ models: { name: string; model: any }[] }) => {
  try {
    models.forEach(m => {
      Container.set(m.name, m.model);
    });

    // const agendaInstance = agendaFactory({ mongoConnection });

    // Container.set('agendaInstance', agendaInstance);
    Container.set('logger', LoggerInstance);
    Container.set('config', config);
    Container.set('utils', Utils);
    Container.set('success', SuccessResponse);
    Container.set('mysql', mysql);
    // Container.set('emailClient', mailgun({ apiKey: config.emails.apiKey, domain: config.emails.domain }));

    // LoggerInstance.info('✌️ Agenda injected into container');

    // return { agenda: agendaInstance };
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
