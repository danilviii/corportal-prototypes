"use strict";
/* ======================================================================
   Data
   ====================================================================== */
const LS_KEY = 'gp3129-requests-proto-v9';
const TODAY = '2026-10-21';

const ICONS = {
  x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  inbox:'<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  check:'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/>',
  clip:'<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  disc:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/>',
  activity:'<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  chart:'<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
  circlecheck:'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  pen:'<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.4 2.6a2 2 0 0 1 3 3L12 15l-4 1 1-4Z"/>',
  brain:'<circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><path d="M8.5 7.5 11 16M15.5 7.5 13 16M9 6h6"/>',
  gear:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  help:'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  left:'<path d="m15 18-6-6 6-6"/>',
  right:'<path d="m9 18 6-6-6-6"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  up:'<path d="m18 15-6-6-6 6"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  kanban:'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 7v7M12 7v4M16 7v9"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  userplus:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
  clipfile:'<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  file:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  cal:'<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>',
  mail:'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  dots:'<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  ok:'<path d="M20 6 9 17l-5-5"/>',
  phone:'<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
  reset:'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  book:'<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  eyeoff:'<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/>',
  lock:'<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  layers:'<path d="m12 2 10 5-10 5L2 7Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
  tag:'<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4Z"/><circle cx="7.5" cy="7.5" r=".5"/>',
  cart:'<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  cap:'<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  stamp:'<path d="M5 22h14M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77"/><path d="M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-6 0c0 2 1 2 1 3.5V13"/>',
  pulse:'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M17 12h-2l-2 5-2-10-2 5H7"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  grip:'<circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/>',
  trash:'<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  archive:'<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
  undo:'<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
  ext:'<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  case:'<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>'
};

const ORDINARY_TASKS = [
  {t:'[Product] Oct 2026: Активы — видимость актива по тенанту склада', p:'Средний', st:'Выполняется', o:'Шевченко Никита', a:'Гордиенко Даниил', d:'08.10.2026 14:38'},
  {t:'[Product] Tracker: Analyze Lachkopiani Enhancement Requests', p:'Высокий', st:'Выполняется', o:'Инденбом Сергей', a:'Гордиенко Даниил', d:'06.10.2026 19:43'},
  {t:'[Product] Tracker: Define Requests and Forms Functionality', p:'Высокий', st:'Выполняется', o:'Инденбом Сергей', a:'Гордиенко Даниил', d:'06.10.2026 19:43'},
  {t:'[Product] Store: Clarify and Approve ERP Logistics Requirements', p:'Самый высокий', st:'Выполняется', o:'Инденбом Сергей', a:'Гордиенко Даниил', d:'06.10.2026 19:43'},
  {t:'[Product] Product Operations — Oct 2026', p:'Самый высокий', st:'Выполняется', o:'Инденбом Сергей', a:'Гордиенко Даниил', d:'08.10.2026 22:10'},
  {t:'[Product] Tracker: Документация по новой структуре таск-трекера', p:'Средний', st:'Ждёт проверки', o:'Инденбом Сергей', a:'Гордиенко Даниил', d:'24.08.2026 13:29'}
];
const LINKABLE_TASKS = ['Настроить роль «Менеджер» в УТ', 'Обновить конфигурацию УТ до 11.5.18', 'Права доступа к отчётам портала', 'Закупка ноутбуков Q4', 'Справочник филиалов: синхронизация с 1С'];

function defaultRequestStatuses(){
  return [{id:'new', name:'Новая', color:'#778297'}, {id:'done', name:'Решена', color:'#357f3e', final:true}];
}
function seed() {
  return {
    seq: 1012,
    arch: [],
    admins: ['alexey'],
    people: [
      {id:'anton', name:'Антон Смирнов', pos:'Менеджер по продажам, Москва'},
      {id:'sergey', name:'Сергей Орлов', pos:'Руководитель отдела продаж, начальник Антона'},
      {id:'marina', name:'Марина Ковалёва', pos:'Специалист 1С'},
      {id:'igor', name:'Игорь Белов', pos:'Программист 1С'},
      {id:'olga', name:'Ольга Новикова', pos:'Руководитель группы 1С'},
      {id:'ilya', name:'Илья Соколов', pos:'Руководитель ИТ-поддержки'},
      {id:'alexey', name:'Алексей Кузнецов', pos:'Администратор портала'},
      {id:'kirill', name:'Кирилл Морозов', pos:'Руководитель поддержки портала'},
      {id:'petr', name:'Пётр Лебедев', pos:'Аналитик поддержки портала'},
      {id:'denis', name:'Денис Павлов', pos:'Системный администратор'},
      {id:'natalia', name:'Наталья Волкова', pos:'Директор по персоналу'},
      {id:'elena', name:'Елена Фёдорова', pos:'Руководитель кадровой службы'},
      {id:'daria', name:'Дарья Зайцева', pos:'Ведущий HR-специалист'},
      {id:'vera', name:'Вера Климова', pos:'Бухгалтер, Екатеринбург'},
      {id:'oksana', name:'Оксана Петрова', pos:'Специалист по обучению персонала'}
    ],
    spaces: [
      {id:'it', name:'IT', leadId:'ilya', statuses:[{id:'new',name:'Новая',color:'#778297'},{id:'work',name:'В работе',color:'#2e60f2'},{id:'wait',name:'Ждём ответа',color:'#c58909'},{id:'done',name:'Решена',color:'#357f3e',final:true},{id:'rej',name:'Отклонена',color:'#d22422',final:true}]},
      {id:'hr', name:'HR', leadId:'natalia', statuses:[{id:'new',name:'Новая',color:'#778297'},{id:'work',name:'В работе',color:'#2e60f2'},{id:'done',name:'Готова',color:'#357f3e',final:true}]}
    ],
    projects: [
      {id:'portal', spaceId:'it', name:'Поддержка корпоративного портала', leadId:'kirill', memberIds:['petr']},
      {id:'onec', spaceId:'it', name:'1С', leadId:'olga', memberIds:['marina','igor']},
      {id:'assets', spaceId:'it', name:'ИТ-оборудование', leadId:'denis', memberIds:[]},
      {id:'b24', spaceId:'it', name:'Bitrix24 CRM', leadId:'kirill', memberIds:['petr']},
      {id:'phone', spaceId:'it', name:'Телефония', leadId:'denis', memberIds:[]},
      {id:'hrhire', spaceId:'hr', name:'Подбор персонала', leadId:'natalia', memberIds:['daria']},
      {id:'hrlearn', spaceId:'hr', name:'Обучение и развитие', leadId:'oksana', memberIds:[]}
    ],
    fields: [
      {id:'f_branch', spaceId:'it', name:'Филиал', kind:'string'},
      {id:'f_db', spaceId:'it', name:'База 1С', kind:'select', options:['Бухгалтерия','УТ (торговля)','ЗУП']},
      {id:'f_fio', spaceId:'it', name:'ФИО сотрудника', kind:'string'},
      {id:'f_access', spaceId:'it', name:'Какие права нужны', kind:'string'},
      {id:'f_url', spaceId:'it', name:'Ссылка на страницу', kind:'string'},
      {id:'f_just', spaceId:'it', name:'Обоснование', kind:'select', options:['Блокирует работу','Обязательное требование','Влияет на деньги','Улучшение']},
      {id:'f_expected', spaceId:'it', name:'Ожидаемый результат', kind:'string'},
      {id:'f_actual', spaceId:'it', name:'Фактический результат', kind:'string'},
      {id:'f_steps', spaceId:'it', name:'Шаги воспроизведения', kind:'string'},
      {id:'f_brand', spaceId:'it', name:'Бренд', kind:'select', options:['Sharmax','Globaldrive','Другое']},
      {id:'f_device', spaceId:'it', name:'Оборудование', kind:'multi', options:['Ноутбук','Монитор','Гарнитура','Мышь и клавиатура','Другое']},
      {id:'f_qty', spaceId:'it', name:'Количество', kind:'number'},
      {id:'f_old', spaceId:'it', name:'Код филиала (старый)', kind:'string', hidden:true},
      {id:'h_fio', spaceId:'hr', name:'ФИО сотрудника', kind:'string'},
      {id:'h_period', spaceId:'hr', name:'Период', kind:'string'},
      {id:'h_copies', spaceId:'hr', name:'Способ получения', kind:'select', options:['Электронно','Бумажный оригинал']},
      {id:'h_position', spaceId:'hr', name:'Должность', kind:'string'},
      {id:'h_dept', spaceId:'hr', name:'Подразделение', kind:'string'},
      {id:'h_start', spaceId:'hr', name:'Желаемая дата выхода', kind:'string'},
      {id:'h_course', spaceId:'hr', name:'Курс или программа', kind:'string'},
      {id:'h_format', spaceId:'hr', name:'Формат обучения', kind:'select', options:['Онлайн','Очно']},
      {id:'h_cost', spaceId:'hr', name:'Стоимость, ₽', kind:'number'}
    ],
    types: [
      {id:'t1', projectId:'onec', name:'Создание пользователя 1С', fields:[{f:'f_branch',r:true},{f:'f_db',r:true},{f:'f_fio',r:true},{f:'f_access',r:false}], exec:['marina']},
      {id:'t2', projectId:'onec', name:'Изменение прав пользователя 1С', fields:[{f:'f_branch',r:true},{f:'f_db',r:true},{f:'f_fio',r:true},{f:'f_access',r:true}], exec:['marina','igor']},
      {id:'t3', projectId:'onec', name:'Доработка 1С', fields:[{f:'f_branch',r:true},{f:'f_db',r:false},{f:'f_just',r:true}], exec:[]},
      {id:'t4', projectId:'onec', name:'Другой вопрос по 1С', fields:[{f:'f_branch',r:true}], exec:[]},
      {id:'t5', projectId:'portal', name:'Ошибка в работе портала', fields:[{f:'f_url',r:true},{f:'f_just',r:true},{f:'f_steps',r:true},{f:'f_expected',r:true},{f:'f_actual',r:true}], exec:['petr']},
      {id:'t6', projectId:'portal', name:'Доступ к разделу или смена роли', fields:[{f:'f_url',r:true},{f:'f_access',r:true},{f:'f_branch',r:false}], exec:['petr']},
      {id:'t7', projectId:'portal', name:'Исправление данных', fields:[{f:'f_url',r:true},{f:'f_expected',r:true},{f:'f_actual',r:true},{f:'f_branch',r:false}], exec:[]},
      {id:'t8', projectId:'assets', name:'Заказ оборудования', fields:[{f:'f_branch',r:true},{f:'f_device',r:true},{f:'f_qty',r:false},{f:'f_just',r:false}], exec:['denis']},
      {id:'t9', projectId:'assets', name:'Ремонт или замена оборудования', fields:[{f:'f_branch',r:true},{f:'f_device',r:true}], exec:['denis']},
      {id:'t10', projectId:'assets', name:'Оплата и продление ИТ-сервисов', fields:[{f:'f_branch',r:true}], exec:['denis'], hidden:true},
      {id:'t12', projectId:'phone', name:'Не работает телефон', fields:[{f:'f_branch',r:true}], exec:['denis']},
      {id:'t11', projectId:'b24', name:'Что-то не работает в Bitrix24', fields:[{f:'f_brand',r:false},{f:'f_url',r:false}], exec:[]},
      {id:'th1', projectId:'hrhire', name:'Подбор нового сотрудника', fields:[{f:'h_position',r:true},{f:'h_dept',r:true},{f:'h_start',r:false}], exec:['daria']},
      {id:'th2', projectId:'hrhire', name:'Замена уволившегося сотрудника', fields:[{f:'h_position',r:true},{f:'h_dept',r:true}], exec:['daria']},
      {id:'th3', projectId:'hrlearn', name:'Заявка на обучение', fields:[{f:'h_course',r:true},{f:'h_format',r:true},{f:'h_cost',r:false},{f:'h_period',r:false}], exec:['oksana']}
    ],
    requests: [
      {id:1001, projectId:'onec', typeId:'t1', title:'Создать пользователя 1С для нового менеджера', description:'В отдел продаж 22.10 выходит новый менеджер. Нужен пользователь в 1С: УТ с правами как у остальных менеджеров.', requesterId:'anton', participantIds:[], executorIds:['marina'], status:'work', createdAt:'2026-10-19T11:20', deadline:'2026-10-23', files:['Заявление о приёме Ковалева.pdf'],
        values:{f_branch:'Москва, Каширское ш.', f_db:'УТ (торговля)', f_fio:'Ковалев Дмитрий Андреевич', f_access:'Роль «Менеджер по продажам», склад «Москва-1»'}, submitted:['f_branch','f_db','f_fio'],
        links:['Настроить роль «Менеджер» в УТ'],
        comments:[{id:'c1', a:'marina', at:'2026-10-20T15:05', text:'Антон, добрый день! К какому складу дать доступ новому сотруднику: «Москва-1» или «Москва-2»?', files:[]}],
        history:[{at:'2026-10-19T11:20', by:'anton', text:'подал заявку'},{at:'2026-10-19T11:20', by:null, text:'исполнитель по умолчанию из типа: Марина Ковалёва'},{at:'2026-10-20T15:00', by:'marina', text:'заполнила поле «Какие права нужны»'},{at:'2026-10-20T15:02', by:'marina', text:'поставила срок 23.10.2026'},{at:'2026-10-20T15:03', by:'marina', text:'связала с задачей «Настроить роль «Менеджер» в УТ»'}]},
      {id:1002, projectId:'portal', typeId:'t6', title:'Нет доступа к разделу «Склады» на портале', description:'При открытии раздела «Склады» пишет «Недостаточно прав».', requesterId:'anton', participantIds:[], executorIds:['petr'], status:'done', createdAt:'2026-10-08T10:02', deadline:null,
        values:{f_url:'https://my.globaldrive.ru/app/warehouses', f_access:'Просмотр остатков по складам Москвы', f_branch:''}, submitted:['f_url','f_access'], links:[],
        comments:[{id:'c2', a:'petr', at:'2026-10-09T12:10', text:'Доступ выдан, проверьте, пожалуйста.', files:[]},{id:'c3', a:'anton', at:'2026-10-09T12:40', text:'Спасибо, всё открывается.', files:[]}],
        history:[{at:'2026-10-08T10:02', by:'anton', text:'подал заявку'},{at:'2026-10-09T12:41', by:'petr', text:'сменил статус: «Решена»'}]},
      {id:1003, projectId:'onec', typeId:'t4', title:'Ошибка при проведении реализации в 1С', description:'При проведении документа «Реализация товаров» выходит ошибка «Не заполнен склад». Склад заполнен.', requesterId:'vera', participantIds:[], executorIds:[], status:'new', createdAt:'2026-10-21T09:40', deadline:null,
        values:{f_branch:'Екатеринбург'}, submitted:['f_branch'], links:[], comments:[],
        history:[{at:'2026-10-21T09:40', by:'vera', text:'подала заявку'},{at:'2026-10-21T09:40', by:null, text:'на типе нет исполнителей по умолчанию, заявка ждёт в очереди'}]},
      {id:1004, projectId:'onec', typeId:'t4', title:'Не открываются отчёты', description:'В разделе «Отчёты» на корпоративном портале пишет «Нет прав». В самой 1С всё работает.', requesterId:'anton', participantIds:[], executorIds:[], status:'new', createdAt:'2026-10-21T10:15', deadline:null,
        values:{f_branch:'Москва, Каширское ш.'}, submitted:['f_branch'], links:[], comments:[],
        history:[{at:'2026-10-21T10:15', by:'anton', text:'подал заявку'}]},
      {id:1005, projectId:'onec', typeId:'t2', title:'Права на ЗУП для нового бухгалтера', description:'Нужен просмотр начислений по филиалу Екатеринбург.', requesterId:'vera', participantIds:[], executorIds:['marina','olga'], status:'new', createdAt:'2026-10-17T14:00', deadline:'2026-10-22',
        values:{f_branch:'Екатеринбург', f_db:'ЗУП', f_fio:'Климова Вера Сергеевна', f_access:'Просмотр начислений'}, submitted:['f_branch','f_db','f_fio','f_access'], links:[], comments:[],
        history:[{at:'2026-10-17T14:00', by:'vera', text:'подала заявку'},{at:'2026-10-17T14:05', by:'olga', text:'назначила исполнителем: Ольга Новикова'}]},
      {id:1006, projectId:'assets', typeId:'t8', title:'Ноутбук для нового менеджера', description:'Новый сотрудник выходит 22.10, нужен рабочий ноутбук и гарнитура.', requesterId:'anton', participantIds:['sergey'], executorIds:['denis'], status:'work', createdAt:'2026-10-15T09:10', deadline:'2026-10-24',
        values:{f_branch:'Москва, Каширское ш.', f_device:['Ноутбук','Гарнитура'], f_qty:'1', f_just:'Блокирует работу'}, submitted:['f_branch','f_device','f_qty','f_just'], links:['Закупка ноутбуков Q4'],
        comments:[{id:'c4', a:'denis', at:'2026-10-16T10:00', text:'Ноутбук заказан, ориентировочно привезут 24.10.', files:[]}],
        history:[{at:'2026-10-15T09:10', by:'anton', text:'подал заявку'},{at:'2026-10-15T09:12', by:'anton', text:'добавил участника запроса Сергей Орлов'}]},
      {id:1007, projectId:'portal', typeId:'t7', title:'Неверный телефон филиала в справочнике', description:'В карточке филиала Екатеринбург указан старый номер.', requesterId:'vera', participantIds:[], executorIds:['petr'], status:'work', createdAt:'2026-10-16T12:30', deadline:null,
        values:{f_url:'https://my.globaldrive.ru/app/branches/12', f_expected:'+7 343 000-00-00', f_actual:'+7 343 111-11-11', f_branch:'Екатеринбург'}, submitted:['f_url','f_expected','f_actual','f_branch'], links:[], comments:[],
        history:[{at:'2026-10-16T12:30', by:'vera', text:'подала заявку'}]},
      {id:1008, projectId:'b24', typeId:'t11', title:'Не работает воронка «Опт»', description:'Сделки не переходят из стадии «Счёт» в «Оплата».', requesterId:'vera', participantIds:[], executorIds:[], status:'new', createdAt:'2026-10-20T16:45', deadline:null,
        values:{f_brand:'Sharmax', f_url:'https://crm.sharmax.example/funnel/opt'}, submitted:['f_brand','f_url'], links:[], comments:[],
        history:[{at:'2026-10-20T16:45', by:'vera', text:'подала заявку'}]},
      {id:1009, projectId:'hrhire', typeId:'th1', title:'Нужен бухгалтер в Екатеринбург', description:'Нагрузка выросла, нужен ещё один бухгалтер на участок расчётов с поставщиками.', requesterId:'vera', participantIds:[], executorIds:['daria'], status:'work', createdAt:'2026-10-14T11:00', deadline:'2026-11-14',
        values:{h_position:'Бухгалтер', h_dept:'Бухгалтерия, Екатеринбург', h_start:'Ноябрь 2026'}, submitted:['h_position','h_dept','h_start'], links:[], comments:[{id:'c5', a:'daria', at:'2026-10-15T09:30', text:'Вакансия опубликована, первые собеседования на следующей неделе.', files:[]}],
        history:[{at:'2026-10-14T11:00', by:'vera', text:'подала заявку'},{at:'2026-10-14T11:00', by:null, text:'исполнитель по умолчанию из типа: Дарья Зайцева'}]},
      {id:1010, projectId:'hrlearn', typeId:'th3', title:'Курс по Excel для отдела продаж', description:'Хотим обучить трёх менеджеров сводным таблицам.', requesterId:'sergey', participantIds:[], executorIds:['oksana'], status:'new', createdAt:'2026-10-20T13:15', deadline:null,
        values:{h_course:'Excel для анализа продаж', h_format:'Онлайн', h_cost:'15000'}, submitted:['h_course','h_format','h_cost'], links:[], comments:[],
        history:[{at:'2026-10-20T13:15', by:'sergey', text:'подал заявку'},{at:'2026-10-20T13:15', by:null, text:'исполнитель по умолчанию из типа: Оксана Петрова'}]},
      {id:1011, projectId:'onec', typeId:'t4', title:'Не печатается счёт из 1С', description:'При печати счёта 1С зависает. Скриншот ошибки приложила.', requesterId:'vera', participantIds:[], executorIds:['marina'], status:'done', createdAt:'2026-10-12T10:30', deadline:'2026-10-14', files:['Скриншот ошибки печати.png'],
        values:{f_branch:'Екатеринбург'}, submitted:['f_branch'], links:[],
        comments:[{id:'c6', a:'marina', at:'2026-10-13T16:20', text:'Обновили драйвер принтера, печать работает.', files:[]}],
        history:[{at:'2026-10-12T10:30', by:'vera', text:'подала заявку'},{at:'2026-10-13T16:21', by:'marina', text:'сменила статус: «Решена»'}]}
    ],
    notifs: [
      {id:'n1', to:'anton', at:'2026-10-20T15:05', kind:'bell', text:'Марина Ковалёва прокомментировала заявку «Создать пользователя 1С для нового менеджера»', req:1001, read:false},
      {id:'n2', to:'anton', at:'2026-10-09T12:41', kind:'bell', text:'Статус заявки «Нет доступа к разделу «Склады» на портале»: Решена', req:1002, read:true},
      {id:'n3', to:'sergey', at:'2026-10-15T09:12', kind:'bell', text:'Вас добавили участником запроса в заявку «Ноутбук для нового менеджера»', req:1006, read:false},
      {id:'n4', to:'marina', at:'2026-10-19T11:20', kind:'mail', text:'Пришла новая заявка «Создать пользователя 1С для нового менеджера» (1С, «Создание пользователя 1С»)', req:1001, read:true},
      {id:'n5', to:'denis', at:'2026-10-15T09:10', kind:'mail', text:'Пришла новая заявка «Ноутбук для нового менеджера» (ИТ-оборудование, «Заказ оборудования»)', req:1006, read:true}
    ],
    subs: {}
  };
}

const ROLES = [
  {label:'Заявитель', u:'anton'},
  {label:'Участник запроса', u:'sergey'},
  {label:'Исполнитель', u:'marina'},
  {label:'Участник проекта без роли', u:'igor'},
  {label:'Руководитель проекта', u:'olga'},
  {label:'Руководитель пространства', u:'ilya'},
  {label:'Администратор', u:'alexey'}
];

const plural = (n, one, few, many) => { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && (b < 12 || b > 14) ? few : many; };
const KIND_LABEL = {string:'Строка', number:'Число', bool:'Да/нет', select:'Список', multi:'Мультисписок'};
const isList = k => k === 'select' || k === 'multi';
let S, UI;
(function init(){
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch(e) {}
  S = saved && saved.S ? saved.S : seed();
  S.spaces.forEach(s => { if (!s.statuses) s.statuses = defaultRequestStatuses(); });
  UI = {user: (saved && saved.user) || 'anton', mobile: !!(saved && saved.mobile), fr: saved ? saved.fr !== false : true, ph: saved ? saved.ph !== false : true,
        submit:null, notifOpen:false, scen:false, picker:null, confirm:null, menu:false, cardTab:'comments', typeDraft:null, toasts:[], renameField:null};
})();
function save(){ try { localStorage.setItem(LS_KEY, JSON.stringify({S, user:UI.user, mobile:UI.mobile, fr:UI.fr, ph:UI.ph})); } catch(e) {} }
