var TEXT_GAMEOVER = "CONGRATULATION! YOU WON!";
var TEXT_LOSE = "SORRY, THE PLAYER %s WON THIS GAME";
var TEXT_SCORE = "YOUR SCORE";
var TEXT_RESTART = "RESTART";
var TEXT_ARE_SURE = "ARE YOU SURE?";
var TEXT_SELECT_PLAYERS = "SELECT THE NUMBER OF PLAYERS!";
var TEXT_SELECT_COLOR = "SELECT A COLOR";
var TEXT_WELCOME = "WELCOME TO FOUR COLORS!";
var TEXT_TUTORIAL1 =
  "MATCH CARDS BY COLOR OR NUMBER AND BE THE FIRST TO GET RID OF THEM!\n\nTHE WINNER'S SCORE WILL BE THE SAME AS THE VALUE OF OTHER PLAYERS CARDS. REACH %s PTS TO WIN THE GAME!\n\nNUMBER CARDS VALUE: DIGIT ON THE CARD";
var TEXT_TUTORIAL2 =
  "ACTION CARDS WILL MIX THE GAME UP!\n\nDRAW TWO FORCES THE NEXT PLAYER TO PICK TWO CARDS AND FORFEIT THE TURN\n\nVALUE: +%s pts";
var TEXT_TUTORIAL3 = "SKIP CARD STOPS THE NEXT PLAYER\n\nVALUE: +%s pts";
var TEXT_TUTORIAL4 = "REVERSE CARD SWITCHES THE GAME WISE\n\nVALUE: +%s pts";
var TEXT_TUTORIAL5 =
  "THE WILD CARD CAN BE PLACED ON ANY CARD AT ANY TIME AND ALLOWS YOU TO CHANGE THE COLOR TO PLAY\n\nVALUE: +%s pts";
var TEXT_TUTORIAL6 =
  "THE WILD DRAW THREE IS A SPECIAL WILD THAT ALLOWS YOU TO CHANGE THE COLOR AND FORCES THE NEXT PLAYER TO PICK 3 CARDS. TO USE THIS CARD YOU MUST HAVE NO OTHER ALTERNATIVE CARDS TO PLAY\n\nVALUE: +%s pts";
var TEXT_TUTORIAL7 =
  "DO NOT FORGET TO PRESS THE ' 1 ' BUTTON WHEN YOU'LL HAVE ONLY ONE CARD LEFT OR YOU'LL PICK %s PENALTY CARDS!";
var TEXT_PLAYER_1 = "PLAYER 1";
var TEXT_PLAYER_2 = "PLAYER 2";
var TEXT_PLAYER_3 = "PLAYER 3";
var TEXT_PLAYER_4 = "PLAYER 4";
var TEXT_ALERT_1 =
  "YOU MUST PRESS ' 1 ' BUTTON WHEN YOU HAVE JUST ONE CARD LEFT. YOU GET %s PENALTY CARDS";
var TEXT_ALERT_2 = "%s GOT %s PENALTY CARDS FOR NOT SAYING ' 1 ' ";
var TEXT_PRELOADER_CONTINUE = "START";
var TEXT_DEVELOPED = "DEVELOPED BY";
var TEXT_SUMMARY = "SUMMARY";
var TEXT_PTS_TO_WINNER = "%s pts to winner";
var TEXT_WINNER = "WINNER!";
var TEXT_PLAYER_WON = "%s WON THE GAME!";

///////////// GAME MULTIPLAYER TEXT
var TEXT_WAIT_OPPONENT = "WAITING OPPONENT...";
var TEXT_OPPONENT_LEFT = "OPPONENT LEFT!";
var TEXT_PLAYER_DISCONNECTED = "YOU LEFT!";
var TEXT_REMATCH = "do you want the re-match?";
var TEXT_QUIT_FROM_GAME = "%s QUIT THE GAME";

///////////// LOGIN ROOM SYSTEM TEXT
var TEXT_SYS_CHOOSENICK = "Choose nickname";
var TEXT_SYS_UPDATE = "update";
var TEXT_SYS_MATCH_LIST = "Match list";
var TEXT_SYS_QUICKMATCH = "quick match";
var TEXT_SYS_CREATEMATCH = "create match";
var TEXT_SYS_BACK = "back";
var TEXT_SYS_OK = "ok";
var TEXT_SYS_CREATE = "create";
var TEXT_SYS_CLOSE = "close";
var TEXT_SYS_LOADING = "Loading...";
var TEXT_SYS_NAMEROOM = "Name Room";
var TEXT_SYS_FINDROOM = "find a room...";
var TEXT_SYS_CREATEROOM = "Create Room";
var TEXT_SYS_DEFAULTROOMNAME = "%s's room";
var TEXT_SYS_PASSWORD = "Password";
var TEXT_SYS_INFOPASS = "If you don't set a password this room will be public.";
var TEXT_SYS_TYPEROOMPASS = "Type Room Password";
var TEXT_WRONG_PASSWORD = "Wrong Password!";
var TEXT_NETWORK_CONNECTING = "connecting...";
var TEXT_ROOM_IS_FULL = "Room is full!";
var TEXT_ROOM_IS_EXPIRED = "Room Expired!";
var TEXT_MATCH_FOUND = "Match found!";
var TEXT_FIND_OPPONENT = "finding opponent...";
var TEXT_VS = "VS";
var TEXT_CONNECT_TO_LOBBY = "Connect to lobby...";
var TEXT_ROOM_DOESNT_EXIST = "Room doesn't exist!";
var TEXT_WAITING_FOR_OPPONENT_IN_ROOM = "waiting for opponent in room: ";
var TEXT_WAITING_FOR_PLAYERS_IN_ROOM = "waiting for players in room: ";
var TEXT_PLAY_NOW = "play now";
var TEXT_WAITING_ROOM_MESSAGE = "This room can contain max %d players";
var TEXT_SYS_MAXPLAYERS = "Max Players";
var TEXT_SYS_CHOOSEMAXNUMPLAYERS =
  "Choose the maximum number of players in room.";
var TEXT_NO_CONNECTION =
  "NO CONNECTION<br/>(Connect to find someone to play online)";
var TEXT_SYS_ADD_BOT = "ADD BOT";
var TEXT_SYS_REMOVE_BOT = "REMOVE BOT";
var TEXT_SOMETHING_WENT_WRONG = "CONNECTION ERROR. SOMETHING WENT WRONG";
var TEXT_SYS_INVITE = "INVITE";
var TEXT_INVALID_NAME = "INVALID NAME!";
var TEXT_THINKING = "WAITING OPPONENT";
var KEYBOARD_ALPHABET = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
];
var TEXT_PLAYER_KICKED = "You were kicked from the game due to inactivity.";
var TEXT_SYS_COPIED_TO_CLIPBOARD =
  "Game link copied to your Clipboard. Share it with your friends!";

function refreshLanguage() {
  if (s_iCurLang === LANG_AR) {
    s_oCanvas.setAttribute("dir", "rtl");
  } else {
    s_oCanvas.setAttribute("dir", "ltr");
  }

  switch (s_iCurLang) {
    case LANG_EN: {
      TEXT_GAMEOVER = "CONGRATULATION! YOU WON!";
      TEXT_LOSE = "SORRY, THE PLAYER %s WON THIS GAME";
      TEXT_SCORE = "YOUR SCORE";
      TEXT_RESTART = "RESTART";
      TEXT_ARE_SURE = "ARE YOU SURE?";
      TEXT_SELECT_PLAYERS = "SELECT THE NUMBER OF PLAYERS!";
      TEXT_SELECT_COLOR = "SELECT A COLOR";
      TEXT_WELCOME = "WELCOME TO FOUR COLORS!";
      TEXT_TUTORIAL1 =
        "MATCH CARDS BY COLOR OR NUMBER AND BE THE FIRST TO GET RID OF THEM!\n\nTHE WINNER'S SCORE WILL BE THE SAME AS THE VALUE OF OTHER PLAYERS CARDS. REACH %s PTS TO WIN THE GAME!\n\nNUMBER CARDS VALUE: DIGIT ON THE CARD";
      TEXT_TUTORIAL2 =
        "ACTION CARDS WILL MIX THE GAME UP!\n\nDRAW TWO FORCES THE NEXT PLAYER TO PICK TWO CARDS AND FORFEIT THE TURN\n\nVALUE: +%s pts";
      TEXT_TUTORIAL3 = "SKIP CARD STOPS THE NEXT PLAYER\n\nVALUE: +%s pts";
      TEXT_TUTORIAL4 = "REVERSE CARD SWITCHES THE GAME WISE\n\nVALUE: +%s pts";
      TEXT_TUTORIAL5 =
        "THE WILD CARD CAN BE PLACED ON ANY CARD AT ANY TIME AND ALLOWS YOU TO CHANGE THE COLOR TO PLAY\n\nVALUE: +%s pts";
      TEXT_TUTORIAL6 =
        "THE WILD DRAW THREE IS A SPECIAL WILD THAT ALLOWS YOU TO CHANGE THE COLOR AND FORCES THE NEXT PLAYER TO PICK 3 CARDS. TO USE THIS CARD YOU MUST HAVE NO OTHER ALTERNATIVE CARDS TO PLAY\n\nVALUE: +%s pts";
      TEXT_TUTORIAL7 =
        "DO NOT FORGET TO PRESS THE ' 1 ' BUTTON WHEN YOU'LL HAVE ONLY ONE CARD LEFT OR YOU'LL PICK %s PENALTY CARDS!";
      TEXT_PLAYER_1 = "PLAYER 1";
      TEXT_PLAYER_2 = "PLAYER 2";
      TEXT_PLAYER_3 = "PLAYER 3";
      TEXT_PLAYER_4 = "PLAYER 4";
      TEXT_ALERT_1 =
        "YOU MUST PRESS ' 1 ' BUTTON WHEN YOU HAVE JUST ONE CARD LEFT. YOU GET %s PENALTY CARDS";
      TEXT_ALERT_2 = "%s GOT %s PENALTY CARDS FOR NOT SAYING ' 1 ' ";
      TEXT_PRELOADER_CONTINUE = "START";
      TEXT_DEVELOPED = "DEVELOPED BY";
      TEXT_SUMMARY = "SUMMARY";
      TEXT_PTS_TO_WINNER = "%s pts to winner";
      TEXT_WINNER = "WINNER!";
      TEXT_PLAYER_WON = "%s WON THE GAME!";

      ///////////// GAME MULTIPLAYER TEXT
      TEXT_WAIT_OPPONENT = "WAITING OPPONENT...";
      TEXT_OPPONENT_LEFT = "OPPONENT LEFT!";
      TEXT_PLAYER_DISCONNECTED = "YOU LEFT!";
      TEXT_REMATCH = "do you want the re-match?";
      TEXT_QUIT_FROM_GAME = "%s QUIT THE GAME";

      ///////////// LOGIN ROOM SYSTEM TEXT
      TEXT_SYS_CHOOSENICK = "Choose nickname";
      TEXT_SYS_UPDATE = "update";
      TEXT_SYS_MATCH_LIST = "Match list";
      TEXT_SYS_QUICKMATCH = "quick match";
      TEXT_SYS_CREATEMATCH = "create match";
      TEXT_SYS_BACK = "back";
      TEXT_SYS_OK = "ok";
      TEXT_SYS_CREATE = "create";
      TEXT_SYS_CLOSE = "close";
      TEXT_SYS_LOADING = "Loading...";
      TEXT_SYS_NAMEROOM = "Name Room";
      TEXT_SYS_FINDROOM = "find a room...";
      TEXT_SYS_CREATEROOM = "Create Room";
      TEXT_SYS_DEFAULTROOMNAME = "%s's room";
      TEXT_SYS_PASSWORD = "Password";
      TEXT_SYS_INFOPASS =
        "If you don't set a password this room will be public.";
      TEXT_SYS_TYPEROOMPASS = "Type Room Password";
      TEXT_WRONG_PASSWORD = "Wrong Password!";
      TEXT_NETWORK_CONNECTING = "connecting...";
      TEXT_ROOM_IS_FULL = "Room is full!";
      TEXT_ROOM_IS_EXPIRED = "Room Expired!";
      TEXT_MATCH_FOUND = "Match found!";
      TEXT_FIND_OPPONENT = "finding opponent...";
      TEXT_VS = "VS";
      TEXT_CONNECT_TO_LOBBY = "Connect to lobby...";
      TEXT_ROOM_DOESNT_EXIST = "Room doesn't exist!";
      TEXT_WAITING_FOR_OPPONENT_IN_ROOM = "waiting for opponent in room: ";
      TEXT_WAITING_FOR_PLAYERS_IN_ROOM = "waiting for players in room: ";
      TEXT_PLAY_NOW = "play now";
      TEXT_WAITING_ROOM_MESSAGE = "This room can contain max %d players";
      TEXT_SYS_MAXPLAYERS = "Max Players";
      TEXT_SYS_CHOOSEMAXNUMPLAYERS =
        "Choose the maximum number of players in room.";
      TEXT_NO_CONNECTION =
        "NO CONNECTION<br/>(Connect to find someone to play online)";
      TEXT_SYS_ADD_BOT = "ADD BOT";
      TEXT_SYS_REMOVE_BOT = "REMOVE BOT";
      TEXT_SOMETHING_WENT_WRONG = "CONNECTION ERROR. SOMETHING WENT WRONG";
      TEXT_SYS_INVITE = "INVITE";
      TEXT_INVALID_NAME = "INVALID NAME!";
      TEXT_THINKING = "WAITING OPPONENT";
      KEYBOARD_ALPHABET = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
      ];

      TEXT_PLAYER_KICKED = "You were kicked from the game due to inactivity.";
      TEXT_SYS_COPIED_TO_CLIPBOARD =
        "Game link copied to your Clipboard. Share it with your friends!";
      break;
    }
    case LANG_RU: {
      TEXT_GAMEOVER = "ПОЗДРАВЛЯЕМ! ВЫ ВЫИГРАЛИ!";
      TEXT_LOSE = "СОЖАЛЕЕМ, ИГРОК %s ПОБЕЖДАЕТ";
      TEXT_SCORE = "ВАШ СЧЕТ";
      TEXT_RESTART = "ЗАНОВО";
      TEXT_ARE_SURE = "УВЕРЕНЫ?";
      TEXT_SELECT_PLAYERS = "ВЫБЕРИТЕ КОЛИЧЕСТВО ИГРОКОВ";
      TEXT_SELECT_COLOR = "ВЫБЕРИТЕ ЦВЕТ ";
      TEXT_WELCOME = "ДОБРО ПОЖАЛОВАТЬ В ИГРУ!";
      TEXT_TUTORIAL1 =
        "СБРАСЫВАЙТЕ ОДИНАКОВЫЕ ПО ЦВЕТУ ИЛИ ДОСТОИНСТВУ КАРТЫ.\n\nСЧЕТ ПОБЕДИТЕЛЯ БУДЕТ РАВЕН ЦЕННОСТИ КАРТ ДРУГИХ ИГРОКОВ. НАБЕРИТЕ %s ОЧКОВ, ЧТОБЫ ВЫИГРАТЬ!\n\nЦЕННОСТЬ КАРТ: ЧИСЛО НА КАРТЕ.\n";
      TEXT_TUTORIAL2 =
        "ОСОБЫЕ КАРТЫ НЕ ДАДУТ ЗАСКУЧАТЬ!\n\n«ТЯНИ ДВЕ» — СЛЕДУЮЩЕМУ ИГРОКУ ПРИДЕТСЯ ВЫТАЩИТЬ ДВЕ КАРТЫ И ПРОПУСТИТЬ ХОД.\n\nЦЕННОСТЬ: +%s очков";
      TEXT_TUTORIAL3 =
        "«ПРОПУСК» — ПРОТИВНИК ЛИШАЕТСЯ ХОДА.\n\nЦЕННОСТЬ: +%s очков";
      TEXT_TUTORIAL4 =
        "«ХОД ОБРАТНО» МЕНЯЕТ ОЧЕРЕДНОСТЬ ХОДА ИГРОКОВ.\n\nЦЕННОСТЬ: +%s очков";
      TEXT_TUTORIAL5 =
        "«ВЫБОР ЦВЕТА» МОЖНО ПОЛОЖИТЬ НА ЛЮБУЮ КАРТУ, ЧТОБЫ СМЕНИТЬ ЦВЕТ.\n\nЦЕННОСТЬ: +%s очков";
      TEXT_TUTORIAL6 =
        "«ТЯНИ 3» — ОСОБАЯ КАРТА. С НЕЙ ВЫ МОЖЕТЕ ПОМЕНЯТЬ ЦВЕТ, А СЛЕДУЮЩЕМУ ИГРОКУ ПРИДЕТСЯ ТЯНУТЬ 3 КАРТЫ. НО ИСПОЛЬЗОВАТЬ ЕЕ МОЖНО ТОЛЬКО ТОГДА, КОГДА У ВАС НЕТ ДРУГИХ ХОДОВ.\n\nЦЕННОСТЬ: +%s очков";
      TEXT_TUTORIAL7 =
        "НЕ ЗАБУДЬТЕ НАЖАТЬ КНОПКУ 1, КОГДА У ВАС ОСТАНЕТСЯ ТОЛЬКО ОДНА КАРТА, ИНАЧЕ ВОЗЬМЕТЕ %s ШТРАФНЫЕ!";
      TEXT_PLAYER_1 = "ИГРОК 1";
      TEXT_PLAYER_2 = "ИГРОК 2";
      TEXT_PLAYER_3 = "ИГРОК 3";
      TEXT_PLAYER_4 = "ИГРОК 4";
      TEXT_ALERT_1 =
        "ЕСЛИ ОСТАЛАСЬ ОДНА КАРТА, НАЖИМАЙТЕ КНОПКУ «1». ИНАЧЕ ВЫ ВОЗЬМЕТЕ %s ШТРАФНЫЕ КАРТЫ.";
      TEXT_ALERT_2 =
        "%s ВОЗЬМИТЕ %s ШТРАФНЫЕ КАРТЫ ЗА ТО, ЧТО НЕ СКАЗАЛИ «УНО!». ";
      TEXT_PRELOADER_CONTINUE = "ИГРАТЬ";
      TEXT_DEVELOPED = "РАЗРАБОТЧИК";
      TEXT_SUMMARY = "ИТОГО";
      TEXT_PTS_TO_WINNER = "%s очк. за победу";
      TEXT_WINNER = "ПОБЕДА!";
      TEXT_PLAYER_WON = "%s ПОБЕЖДАЕТ В ИГРЕ!";

      ///////////// GAME MULTIPLAYER TEXT
      TEXT_WAIT_OPPONENT = "ОЖИДАНИЕ ПРОТИВНИКА...";
      TEXT_OPPONENT_LEFT = "ПРОТИВНИК ВЫШЕЛ!";
      TEXT_PLAYER_DISCONNECTED = "ВЫ ВЫШЛИ!";
      TEXT_REMATCH = "Сыграть заново?";
      TEXT_QUIT_FROM_GAME = "%s вышел из игры";

      ///////////// LOGIN ROOM SYSTEM TEXT
      TEXT_SYS_CHOOSENICK = "Выберите никнейм";
      TEXT_SYS_UPDATE = "Обновить";
      TEXT_SYS_MATCH_LIST = "Список игр";
      TEXT_SYS_QUICKMATCH = "быстрая игра";
      TEXT_SYS_CREATEMATCH = "создать игру";
      TEXT_SYS_BACK = "назад";
      TEXT_SYS_OK = "ok";
      TEXT_SYS_CREATE = "создать";
      TEXT_SYS_CLOSE = "закрыть";
      TEXT_SYS_LOADING = "Загрузка...";
      TEXT_SYS_NAMEROOM = "Назовите игру";
      TEXT_SYS_FINDROOM = "найти комнату...";
      TEXT_SYS_CREATEROOM = "Создать игру";
      TEXT_SYS_DEFAULTROOMNAME = "Комната игрока %s";
      TEXT_SYS_PASSWORD = "Пароль";
      TEXT_SYS_INFOPASS =
        "Если вы не установите пароль, эта игра будет общедоступной.";
      TEXT_SYS_TYPEROOMPASS = "Введите пароль для игры";
      TEXT_WRONG_PASSWORD = "Неверный пароль!";
      TEXT_NETWORK_CONNECTING = "подключение...";
      TEXT_ROOM_IS_FULL = "Нет места!";
      TEXT_ROOM_IS_EXPIRED = "Комната закрылась!";
      TEXT_MATCH_FOUND = "Игра найдена!";
      TEXT_FIND_OPPONENT = "Поиск противника...";
      TEXT_VS = "VS";
      TEXT_CONNECT_TO_LOBBY = "Подключение...";
      TEXT_ROOM_DOESNT_EXIST = "Такой комнаты нет!";
      TEXT_WAITING_FOR_OPPONENT_IN_ROOM = "Ожидание противника в комнате: ";
      TEXT_WAITING_FOR_PLAYERS_IN_ROOM = "Ожидание игроков в комнате: ";
      TEXT_PLAY_NOW = "Играть";
      TEXT_WAITING_ROOM_MESSAGE = "Максимум игроков в комнате: %d";
      TEXT_SYS_MAXPLAYERS = "Максимум игроков";
      TEXT_SYS_CHOOSEMAXNUMPLAYERS =
        "Выберите максимальное число игроков в комнате.";
      TEXT_NO_CONNECTION =
        "НЕТ СОЕДИНЕНИЯ<br/>Подключитесь, чтобы найти других игроков и начать игру";
      TEXT_SYS_ADD_BOT = "ДОБАВИТЬ БОТА";
      TEXT_SYS_REMOVE_BOT = "УДАЛИТЬ БОТА";
      TEXT_SOMETHING_WENT_WRONG = "ОШИБКА СОЕДИНЕНИЯ. ЧТО-ТО ПОШЛО НЕ ТАК";
      TEXT_SYS_INVITE = "INVITE";
      var TEXT_INVALID_NAME = "ОШИБКА ИМЕНИ!";
      TEXT_THINKING = "ОЖИДАНИЕ ПРОТИВНИКА";
      KEYBOARD_ALPHABET = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "Й",
        "Ц",
        "У",
        "К",
        "Е",
        "Н",
        "Г",
        "Ш",
        "Щ",
        "З",
        "Х",
        "Ъ",
        "Ф",
        "Ы",
        "В",
        "А",
        "П",
        "Р",
        "О",
        "Л",
        "Д",
        "Ж",
        "Э",
        "Ё",
        "Я",
        "Ч",
        "С",
        "М",
        "И",
        "Т",
        "Ь",
        "Б",
        "Ю",
      ];

      TEXT_PLAYER_KICKED = "Вас исключили из игры за неактивность.";
      TEXT_SYS_COPIED_TO_CLIPBOARD =
        "Ссылка на игру скопирована в буфер обмена. Поделитесь ей со своими друзьями!";
      break;
    }
    case LANG_ES: {
      TEXT_GAMEOVER = "¡ENHORABUENA! ¡HAS GANADO!";
      TEXT_LOSE = "LO SIENTO, EL JUGADOR %s HA GANADO ESTA PARTIDA";
      TEXT_SCORE = "TU PUNTUACIÓN";
      TEXT_RESTART = "REINICIAR";
      TEXT_ARE_SURE = "¿ESTÁS SEGURO?";
      TEXT_SELECT_PLAYERS = "SELECCIONA EL NÚMERO DE JUGADORES";
      TEXT_SELECT_COLOR = "SELECCIONA UN COLOR";
      TEXT_WELCOME = "¡BIENVENIDO A CUATRO COLORES!";
      TEXT_TUTORIAL1 =
        "COMBINA CARTAS POR COLOR O NÚMERO Y SÉ EL PRIMERO EN DESHACERTE DE ELLAS.\n\nLA PUNTUACIÓN DEL GANADOR SERÁ LA MISMA QUE EL VALOR DE LAS CARTAS DE LOS DEMÁS JUGADORES. ¡LLEGA A %s PUNTOS PARA GANAR LA PARTIDA!\n\nVALOR DE LAS CARTAS NUMÉRICAS: DÍGITO DE LA CARTA";
      TEXT_TUTORIAL2 =
        "¡LAS CARTAS DE ACCIÓN ALTERARÁN EL JUEGO!\n\nROBAR DOS OBLIGA AL SIGUIENTE JUGADOR A COGER DOS CARTAS Y PERDER EL TURNO\n\nVALOR: +%s puntos";
      TEXT_TUTORIAL3 =
        "SALTAR CARTA DETIENE AL SIGUIENTE JUGADOR\n\nVALOR: +%s puntos";
      TEXT_TUTORIAL4 = "LA CARTA INVERSA CAMBIA EL JUEGO\n\nVALOR: +%s puntos";
      TEXT_TUTORIAL5 =
        "EL COMODÍN PUEDE COLOCARSE EN CUALQUIER CARTA EN CUALQUIER MOMENTO Y PERMITE CAMBIAR EL COLOR PARA JUGAR\n\nVALOR: +%s puntos";
      TEXT_TUTORIAL6 =
        "EL COMODÍN 'ROBAR TRES' ES UN COMODÍN ESPECIAL QUE TE PERMITE CAMBIAR EL COLOR Y OBLIGA AL SIGUIENTE JUGADOR A ELEGIR 3 CARTAS. PARA USAR ESTA CARTA NO DEBES TENER OTRAS CARTAS ALTERNATIVAS PARA JUGAR\n\nVALOR: +%s puntos";
      TEXT_TUTORIAL7 =
        "¡NO OLVIDES PULSAR EL BOTÓN '1' CUANDO SÓLO TE QUEDE UNA CARTA O COGERÁS %s CARTAS DE PENALIZACIÓN!";
      TEXT_PLAYER_1 = "JUGADOR 1";
      TEXT_PLAYER_2 = "JUGADOR 2";
      TEXT_PLAYER_3 = "JUGADOR 3";
      TEXT_PLAYER_4 = "JUGADOR 4";
      TEXT_ALERT_1 =
        "TIENES QUE PULSAR EL BOTÓN '1' CUANDO SÓLO TE QUEDE UNA CARTA. RECIBES %s CARTAS DE PENALIZACIÓN";
      TEXT_ALERT_2 = "%s RECIBIÓ %s CARTAS DE PENALIZACIÓN POR NO DECIR '1'";
      TEXT_PRELOADER_CONTINUE = "EMPEZAR";
      TEXT_DEVELOPED = "DESARROLLADO POR";
      TEXT_SUMMARY = "RESUMEN";
      TEXT_PTS_TO_WINNER = "%s puntos al ganador";
      TEXT_WINNER = "¡GANADOR!";
      TEXT_PLAYER_WON = "¡%s HA GANADO LA PARTIDA!";

      ///////////// GAME MULTIPLAYER TEXT
      TEXT_WAIT_OPPONENT = "ESPERANDO OPONENTE...";
      TEXT_OPPONENT_LEFT = "¡EL OPONENTE SE FUE!";
      TEXT_PLAYER_DISCONNECTED = "¡TE HAS IDO!";
      TEXT_REMATCH = "¿quieres la revancha?";
      TEXT_QUIT_FROM_GAME = "%s SALIÓ DEL JUEGO";

      ///////////// LOGIN ROOM SYSTEM TEXT
      TEXT_SYS_CHOOSENICK = "Elige apodo";
      TEXT_SYS_UPDATE = "actualizar";
      TEXT_SYS_MATCH_LIST = "Lista de partidas";
      TEXT_SYS_QUICKMATCH = "partida rápida";
      TEXT_SYS_CREATEMATCH = "crear partida";
      TEXT_SYS_BACK = "volver";
      TEXT_SYS_OK = "ok";
      TEXT_SYS_CREATE = "crear";
      TEXT_SYS_CLOSE = "cerrar";
      TEXT_SYS_LOADING = "Cargando...";
      TEXT_SYS_NAMEROOM = "Nombrar la sala";
      TEXT_SYS_FINDROOM = "encuentra una sala...";
      TEXT_SYS_CREATEROOM = "Crear sala";
      TEXT_SYS_DEFAULTROOMNAME = "sala de %s";
      TEXT_SYS_PASSWORD = "Contraseña";
      TEXT_SYS_INFOPASS =
        "Si no estableces una contraseña esta sala será pública.";
      TEXT_SYS_TYPEROOMPASS = "Escribe la contraseña de la sala";
      TEXT_WRONG_PASSWORD = "¡Contraseña incorrecta!";
      TEXT_NETWORK_CONNECTING = "conectando...";
      TEXT_ROOM_IS_FULL = "¡La sala está llena!";
      TEXT_ROOM_IS_EXPIRED = "¡La sala expiró!";
      TEXT_MATCH_FOUND = "¡Oponente encontrado!";
      TEXT_FIND_OPPONENT = "encontrando oponente...";
      TEXT_VS = "CONTRA";
      TEXT_CONNECT_TO_LOBBY = "Conectar al lobby...";
      TEXT_ROOM_DOESNT_EXIST = "¡La sala no existe!";
      TEXT_WAITING_FOR_OPPONENT_IN_ROOM = "esperando al oponente en la sala: ";
      TEXT_WAITING_FOR_PLAYERS_IN_ROOM =
        "esperando a los jugadores en la sala: ";
      TEXT_PLAY_NOW = "jugar ahora";
      TEXT_WAITING_ROOM_MESSAGE =
        "Esta sala puede albergar un máximo de %d jugadores";
      TEXT_SYS_MAXPLAYERS = "Máximo de jugadores";
      TEXT_SYS_CHOOSEMAXNUMPLAYERS =
        "Elige el número máximo de jugadores en la sala.";
      TEXT_NO_CONNECTION =
        "SIN CONEXIÓN<br/>(Conéctate para encontrar a alguien para jugar en línea)";
      TEXT_SYS_ADD_BOT = "AÑADIR BOT";
      TEXT_SYS_REMOVE_BOT = "ELIMINAR BOT";
      TEXT_SOMETHING_WENT_WRONG = "ERROR DE CONEXIÓN. ALGO SALIÓ MAL...";
      TEXT_SYS_INVITE = "INVITAR";
      TEXT_INVALID_NAME = "¡NOMBRE NO VÁLIDO!";
      TEXT_THINKING = "ESPERANDO OPONENTE";
      KEYBOARD_ALPHABET = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
      ];

      TEXT_PLAYER_KICKED = "Se te ha expulsado de la partida por inactividad.";
      TEXT_SYS_COPIED_TO_CLIPBOARD =
        "Enlace de partida copiado al portapapeles. ¡Compártelo con tus amigos!";
      break;
    }
    case LANG_FR: {
      TEXT_GAMEOVER = "FÉLICITATIONS ! VOUS AVEZ GAGNÉ !";
      TEXT_LOSE = "DÉSOLÉ, LE JOUEUR %s A REMPORTÉ CETTE PARTIE";
      TEXT_SCORE = "VOTRE SCORE";
      TEXT_RESTART = "REDÉMARRER";
      TEXT_ARE_SURE = "ÊTES-VOUS SÛR(E) ?";
      TEXT_SELECT_PLAYERS = "SÉLECTIONNEZ LE NOMBRE DE JOUEURS !";
      TEXT_SELECT_COLOR = "SÉLECTIONNEZ UNE COULEUR";
      TEXT_WELCOME = "BIENVENUE AUX QUATRE COULEURS !";
      TEXT_TUTORIAL1 =
        "ASSOCIEZ DES CARTES PAR COULEUR OU PAR NOMBRE ET SOYEZ LE PREMIER À VOUS EN DÉBARRASSER !\n\nLE SCORE DU GAGNANT SERA ÉQUIVALENT À LA VALEUR DES CARTES DES AUTRES JOUEURS. ATTEIGNEZ %s PTS AFIN DE REMPORTER LA PARTIE !\n\nVALEUR DES CARTES NUMÉROTÉES : CHIFFRE SUR LA CARTE";
      TEXT_TUTORIAL2 =
        "LES CARTES D’ACTION PERMETTENT DE VARIER LE JEU !\n\nTIRER DEUX CARTES OBLIGE LE JOUEUR SUIVANT À CHOISIR DEUX CARTES ET À RENONCER À SON TOUR\n\nVALEUR : +%s pts";
      TEXT_TUTORIAL3 =
        "LA CARTE PASSER ARRÊTE LE JOUEUR SUIVANT\n\nVALEUR : +%s pts";
      TEXT_TUTORIAL4 =
        "LA CARTE INVERSION CHANGE LE SENS DU JEU\n\nVALEUR : +%s pts";
      TEXT_TUTORIAL5 =
        "LE JOKER PEUT ÊTRE PLACÉ À TOUT MOMENT SUR N’IMPORTE QUELLE CARTE ET VOUS PERMET DE MODIFIER LA COULEUR À JOUER\n\nVALEUR : +%s pts";
      TEXT_TUTORIAL6 =
        "LE JOKER TIRER 3 EST UN JOKER SPÉCIAL QUI VOUS PERMET DE MODIFIER LA COULEUR ET OBLIGE LE JOUEUR SUIVANT À CHOISIR 3 CARTES. POUR POUVOIR UTILISER CETTE CARTE, VOUS NE DEVEZ PAS AVOIR D’AUTRES CARTES À JOUER\n\nVALEUR : +%s pts";
      TEXT_TUTORIAL7 =
        "N’OUBLIEZ PAS D’APPUYER SUR LE BOUTON « 1 » LORSQU’IL NE VOUS RESTE PLUS QU’UNE SEULE CARTE OU VOUS RECEVEZ %s DES CARTES PÉNALITÉS !";
      TEXT_PLAYER_1 = "JOUEUR 1";
      TEXT_PLAYER_2 = "JOUEUR 2";
      TEXT_PLAYER_3 = "JOUEUR 3";
      TEXT_PLAYER_4 = "JOUEUR 4";
      TEXT_ALERT_1 =
        "VOUS DEVEZ APPUYER SUR LE BOUTON « 1 » LORSQU’IL NE VOUS RESTE PLUS QU’UNE SEULE CARTE. VOUS OBTENEZ %s CARTES DE PÉNALITÉ";
      TEXT_ALERT_2 =
        "%s A REÇU %s CARTES DE PÉNALITÉ POUR NE PAS AVOIR DIT « 1 »";
      TEXT_PRELOADER_CONTINUE = "DÉMARRER";
      TEXT_DEVELOPED = "DÉVELOPPÉ PAR";
      TEXT_SUMMARY = "RÉSUMÉ";
      TEXT_PTS_TO_WINNER = "%s pts au vainqueur";
      TEXT_WINNER = "VAINQUEUR !";
      TEXT_PLAYER_WON = "%s A REMPORTÉ LA PARTIE !";

      ///////////// GAME MULTIPLAYER TEXT
      TEXT_WAIT_OPPONENT = "EN ATTENTE DE L’ ADVERSAIRE...";
      TEXT_OPPONENT_LEFT = "VOTRE ADVERSAIRE A QUITTÉ LA PARTIE !";
      TEXT_PLAYER_DISCONNECTED = "VOUS AVEZ QUITTÉ LA PARTIE !";
      TEXT_REMATCH = "voulez-vous faire une nouvelle partie ?";
      TEXT_QUIT_FROM_GAME = "%s A QUITTÉ LA PARTIE";

      ///////////// LOGIN ROOM SYSTEM TEXT
      TEXT_SYS_CHOOSENICK = "Choisissez un pseudo";
      TEXT_SYS_UPDATE = "mettre à jour";
      TEXT_SYS_MATCH_LIST = "Liste des parties";
      TEXT_SYS_QUICKMATCH = "partie rapide";
      TEXT_SYS_CREATEMATCH = "créer une partie";
      TEXT_SYS_BACK = "retour";
      TEXT_SYS_OK = "ok";
      TEXT_SYS_CREATE = "créer";
      TEXT_SYS_CLOSE = "fermer";
      TEXT_SYS_LOADING = "Chargement...";
      TEXT_SYS_NAMEROOM = "Nom de la chambre";
      TEXT_SYS_FINDROOM = "trouver une salle...";
      TEXT_SYS_CREATEROOM = "Créer une salle";
      TEXT_SYS_DEFAULTROOMNAME = "Salle de %s";
      TEXT_SYS_PASSWORD = "Mot de passe";
      TEXT_SYS_INFOPASS =
        "Si vous ne créez pas de mot de passe, cette salle sera publique.";
      TEXT_SYS_TYPEROOMPASS = "Saisissez le mot de passe";
      TEXT_WRONG_PASSWORD = "Mot de passe erroné !";
      TEXT_NETWORK_CONNECTING = "connexion en cours...";
      TEXT_ROOM_IS_FULL = "La salle est complète !";
      TEXT_ROOM_IS_EXPIRED = "La salle a expiré !";
      TEXT_MATCH_FOUND = "Partie trouvée !";
      TEXT_FIND_OPPONENT = "en recherche d’un adversaire...";
      TEXT_VS = "VS";
      TEXT_CONNECT_TO_LOBBY = "Connexion au salon...";
      TEXT_ROOM_DOESNT_EXIST = "La salle n’existe pas !";
      TEXT_WAITING_FOR_OPPONENT_IN_ROOM =
        "en attente d’un adversaire dans la salle : ";
      TEXT_WAITING_FOR_PLAYERS_IN_ROOM =
        "en attente de joueurs dans la salle : ";
      TEXT_PLAY_NOW = "jouer maintenant";
      TEXT_WAITING_ROOM_MESSAGE =
        "Cette salle peut accueillir %d joueurs au maximum";
      TEXT_SYS_MAXPLAYERS = "Maximum de joueurs";
      TEXT_SYS_CHOOSEMAXNUMPLAYERS =
        "Choisissez le nombre maximum de joueurs dans la salle.";
      TEXT_NO_CONNECTION =
        "HORS CONNEXION<br/>(connectez-vous pour trouver des joueurs en ligne)";
      TEXT_SYS_ADD_BOT = "AJOUTER BOT";
      TEXT_SYS_REMOVE_BOT = "SUPPRIMER BOT";
      TEXT_SOMETHING_WENT_WRONG =
        "ERREUR DE CONNEXION. UNE ERREUR S’EST PRODUITE";
      TEXT_SYS_INVITE = "INVITER";
      TEXT_INVALID_NAME = "NOM INVALIDE !";
      TEXT_THINKING = "EN ATTENTE D’UN ADVERSAIRE";
      KEYBOARD_ALPHABET = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
      ];

      TEXT_PLAYER_KICKED =
        "Votre inactivité a entraîné votre expulsion de la partie.";
      TEXT_SYS_COPIED_TO_CLIPBOARD =
        "Le lien du jeu a été copié dans votre Presse-papiers. Envoyez-le à vos amis !";
      break;
    }
    case LANG_DE: {
      TEXT_GAMEOVER = "GLÜCKWUNSCH! SIE HABEN GEWONNEN!";
      TEXT_LOSE = "TUT UNS LEID, ABER DER SPIELER %sHAT DAS SPIEL GEWONNEN";
      TEXT_SCORE = "IHRE PUNKTZAHL";
      TEXT_RESTART = "NEU STARTEN";
      TEXT_ARE_SURE = "GANZ SICHER?";
      TEXT_SELECT_PLAYERS = "WÄHLEN SIE DIE ANZAHL DER SPIELER!";
      TEXT_SELECT_COLOR = "WÄHLEN SIE EINE FARBE";
      TEXT_WELCOME = "WILLKOMMEN BEI DEN VIER FARBEN!";
      TEXT_TUTORIAL1 =
        "ORDNEN SIE DIE KARTEN NACH FARBE ODER ZAHL UND WERDE SIE ALS ERSTER LOS!\n\nDER GEWINNER ERHÄLT DIE GLEICHE PUNKTZAHL WIE DER WERT DER ANDEREN SPIELERKARTEN. ERREICHEN SIE %sPUNKTE, UM DAS SPIEL ZU GEWINNEN!\n\nANZAHL KARTEN WERT: ZIFFER AUF DER KARTE";
      TEXT_TUTORIAL2 =
        "AKTIONSKARTEN MISCHEN DAS SPIEL AUF!\n\nWENN MAN ZWEI KARTEN ZIEHT, MUSS DER NÄCHSTE SPIELER ZWEI KARTEN ZIEHEN UND VERLIERT DEN ZUG\n\nWERT: +%s Punkte";
      TEXT_TUTORIAL3 =
        "KARTE ÜBERSPRINGEN HÄLT DEN NÄCHSTEN SPIELER AN\n\nWERT: +%s Punkte";
      TEXT_TUTORIAL4 =
        "UMGEKEHRTE KARTE WECHSELT DIE SPIELWEISE\n\nWERT: +%s Punkte";
      TEXT_TUTORIAL5 =
        "DER JOKER KANN JEDERZEIT AUF EINE BELIEBIGE KARTE GELEGT WERDEN UND ERMÖGLICHT ES IHNEN, DIE FARBE ZU ÄNDERN, UM ZU SPIELEN\n\nWERT: +%s Punkte";
      TEXT_TUTORIAL6 =
        "DER JOKER „DREI ZIEHEN“ IST EIN SPEZIELLER JOKER, MIT DEM SIE DIE FARBE ÄNDERN KÖNNEN UND DER DEN NÄCHSTEN SPIELER ZWINGT, 3 KARTEN ZU ZIEHEN. UM DIESE KARTE ZU BENUTZEN, DÜRFEN SIE KEINE ANDEREN KARTEN SPIELEN\n\nWERT: +%s Punkte";
      TEXT_TUTORIAL7 =
        "VERGESSEN SIE NICHT, DIE TASTE „1“ ZU DRÜCKEN, WENN SIE NUR NOCH EINE KARTE HABEN, SONST BEKOMMEN SIE %s STRAFKARTEN!";
      TEXT_PLAYER_1 = "SPIELER 1";
      TEXT_PLAYER_2 = "SPIELER 2";
      TEXT_PLAYER_3 = "SPIELER 3";
      TEXT_PLAYER_4 = "SPIELER 4";
      TEXT_ALERT_1 =
        "SIE MÜSSEN DIE TASTE „1“ DRÜCKEN, WENN SIE NUR NOCH EINE KARTE HABEN. SIE BEKOMMEN%sSTRAFKARTEN";
      TEXT_ALERT_2 =
        "%sSIE HABEN %s STRAFKARTEN BEKOMMEN, DA SIE NICHT „1“ GEDRÜCKT HABEN";
      TEXT_PRELOADER_CONTINUE = "START";
      TEXT_DEVELOPED = "ENTWICKELT VON";
      TEXT_SUMMARY = "ZUSAMMENFASSUNG";
      TEXT_PTS_TO_WINNER = "%s Punkte für den Gewinner";
      TEXT_WINNER = "GEWINNER!";
      TEXT_PLAYER_WON = "%sSIE HABEN DAS SPIEL GEWONNEN!";

      ///////////// GAME MULTIPLAYER TEXT
      TEXT_WAIT_OPPONENT = "WARTENDER GEGNER...";
      TEXT_OPPONENT_LEFT = "DER GEGNER HAT DAS SPIEL VERLASSEN!";
      TEXT_PLAYER_DISCONNECTED = "SIE HABEN DAS SPIEL VERLASSEN!";
      TEXT_REMATCH = "Wollen Sie ein Rematch?";
      TEXT_QUIT_FROM_GAME = "%sDAS SPIEL BEENDEN";

      ///////////// LOGIN ROOM SYSTEM TEXT
      TEXT_SYS_CHOOSENICK = "Spitzname wählen";
      TEXT_SYS_UPDATE = "Update";
      TEXT_SYS_MATCH_LIST = "Matchliste";
      TEXT_SYS_QUICKMATCH = "Schnelles Match";
      TEXT_SYS_CREATEMATCH = "Match erstellen";
      TEXT_SYS_BACK = "Zurück";
      TEXT_SYS_OK = "OK";
      TEXT_SYS_CREATE = "Erstellen";
      TEXT_SYS_CLOSE = "Schließen";
      TEXT_SYS_LOADING = "Laden …";
      TEXT_SYS_NAMEROOM = "Raum benennen";
      TEXT_SYS_FINDROOM = "Suche einen Raum ...";
      TEXT_SYS_CREATEROOM = "Raum erstellen";
      TEXT_SYS_DEFAULTROOMNAME = "Raum von%s";
      TEXT_SYS_PASSWORD = "Passwort";
      TEXT_SYS_INFOPASS =
        "Wenn du kein Passwort einstellst, ist dieser Raum öffentlich.";
      TEXT_SYS_TYPEROOMPASS = "Passwort für Raum eingeben";
      TEXT_WRONG_PASSWORD = "Falsches Passwort!";
      TEXT_NETWORK_CONNECTING = "Verbinde...";
      TEXT_ROOM_IS_FULL = "Raum ist voll!";
      TEXT_ROOM_IS_EXPIRED = "Raum ist abgelaufen!";
      TEXT_MATCH_FOUND = "Match gefunden!";
      TEXT_FIND_OPPONENT = "Ein Gegner wird gesucht..";
      TEXT_VS = "VS";
      TEXT_CONNECT_TO_LOBBY = "Verbinde mit der Lobby ...";
      TEXT_ROOM_DOESNT_EXIST = "Raum existiert nicht!";
      TEXT_WAITING_FOR_OPPONENT_IN_ROOM = "Warte auf Gegner in Raum: ";
      TEXT_WAITING_FOR_PLAYERS_IN_ROOM = "Warte auf Spieler in Raum: ";
      TEXT_PLAY_NOW = "Jetzt spielen";
      TEXT_WAITING_ROOM_MESSAGE = "Dieser Raum darf max. %d Spieler haben";
      TEXT_SYS_MAXPLAYERS = "Max. Spieler";
      TEXT_SYS_CHOOSEMAXNUMPLAYERS =
        "Wähle die maximale Anzahl von Spielern im Raum.";
      TEXT_NO_CONNECTION =
        "KEINE VERBINDUNG<br/> (Verbinden Sie sich, um jemanden zum Online-Spielen zu finden)";
      TEXT_SYS_ADD_BOT = "BOT HINZUFÜGEN";
      TEXT_SYS_REMOVE_BOT = "BOT ENTFERNEN";
      TEXT_SOMETHING_WENT_WRONG = "VERBINDUNGSFEHLER. ETWAS IST SCHIEFGELAUFEN";
      TEXT_SYS_INVITE = "EINLADEN";
      TEXT_INVALID_NAME = "UNGÜLTIGER NAME!";
      TEXT_THINKING = "WARTENDER GEGNER";
      KEYBOARD_ALPHABET = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
      ];

      TEXT_PLAYER_KICKED =
        "Du wurdest wegen Inaktivität aus dem Spiel geworfen.";
      TEXT_SYS_COPIED_TO_CLIPBOARD =
        "Spiel-Link wurde in deine Zwischenablage kopiert. Teile ihn mit deinen Freunden!";

      break;
    }
    case LANG_PT: {
      TEXT_GAMEOVER = "PARABÉNS! GANHASTE!";
      TEXT_LOSE = "DESCULPA, O JOGADOR %s GANHOU ESTE JOGO";
      TEXT_SCORE = "A TUA PONTUAÇÃO";
      TEXT_RESTART = "REINICIAR";
      TEXT_ARE_SURE = "TENS CERTEZA?";
      TEXT_SELECT_PLAYERS = "SELECCIONA O NÚMERO DE JOGADORES";
      TEXT_SELECT_COLOR = "SELECCIONA UMA COR";
      TEXT_WELCOME = "BEM-VINDO A QUATRO CORES!";
      TEXT_TUTORIAL1 =
        "COMBINA CARTAS POR COR OU NÚMERO E SÊ O PRIMEIRO A SE LIVRAR DELAS!\n\nA PONTUAÇÃO DO VENCEDOR SERÁ A MESMA QUE O VALOR DAS CARTAS DOS OUTROS JOGADORES. ALCANÇA %s PONTOS PARA GANHAR A PARTIDA!\n\nVALOR DO NÚMERO DE CARTAS: DÍGITO NA CARTA";
      TEXT_TUTORIAL2 =
        "CARTAS DE ACÇÃO VÃO REMEXER O JOGO!\n\nTIRAR DUAS FORÇA O JOGADOR SEGUINTE A ESCOLHER DUAS CARTAS E A PERDER A VEZ\n\nVALOR: +%s pontos";
      TEXT_TUTORIAL3 =
        "SALTAR A CARTA PÁRA O JOGADOR SEGUINTE\n\nVALOR: +%s pontos";
      TEXT_TUTORIAL4 =
        "INVERTER AS CARTAS MUDA O SENTIDO JOGO\n\nVALOR: +%s pontos";
      TEXT_TUTORIAL5 =
        "O 'WILD CARD' PODE SER COLOCADA SOBRE QUALQUER CARTA EM QUALQUER ALTURA E PERMITE-TE MUDAR A COR A JOGAR\n\nVALOR: +%s pontos";
      TEXT_TUTORIAL6 =
        "O WILD 'TIRA TRÊS' É UM WILD ESPECIAL QUE TE PERMITE MUDAR A COR E OBRIGA O JOGADOR SEGUINTE A ESCOLHER 3 CARTAS. PARA UTILIZAR ESTE CARTA NÃO PODES TER OUTRAS CARTAS ALTERNATIVAS PARA JOGAR\n\nVALOR: +%s pontos";
      TEXT_TUTORIAL7 =
        "NÃO TE ESQUEÇAS DE PREMIR O BOTÃO '1' QUANDO SÓ TE RESTE UMA CARTA OU APANHARÁS %s CARTAS DE PENALIDADE!";
      TEXT_PLAYER_1 = "JOGADOR 1";
      TEXT_PLAYER_2 = "JOGADOR 2";
      TEXT_PLAYER_3 = "JOGADOR 3";
      TEXT_PLAYER_4 = "JOGADOR 4";
      TEXT_ALERT_1 =
        "DEVES PREMIR O BOTÃO '1' QUANDO TE RESTE APENAS UMA CARTA. APANHAS %s CARTAS DE PENALIZAÇÃO";
      TEXT_ALERT_2 = "%s APANHASTE %s CARTAS DE PENALIZAÇÃO POR NÃO DIZER '1'";
      TEXT_PRELOADER_CONTINUE = "COMEÇAR";
      TEXT_DEVELOPED = "DESENVOLVIDO POR";
      TEXT_SUMMARY = "RESUMO";
      TEXT_PTS_TO_WINNER = "%s pontos para o vencedor";
      TEXT_WINNER = "VENCEDOR!";
      TEXT_PLAYER_WON = "%s GANHOU O JOGO!";

      ///////////// GAME MULTIPLAYER TEXT
      TEXT_WAIT_OPPONENT = "A AGUARDAR PELO ADVERSÁRIO...";
      TEXT_OPPONENT_LEFT = "O ADVERSÁRIO FOI EMBORA!";
      TEXT_PLAYER_DISCONNECTED = "FOSTE-TE EMBORA!";
      TEXT_REMATCH = "queres a desforra?";
      TEXT_QUIT_FROM_GAME = "%s SAIU DO JOGO";

      ///////////// LOGIN ROOM SYSTEM TEXT
      TEXT_SYS_CHOOSENICK = "Escolhe nome de utilizador";
      TEXT_SYS_UPDATE = "actualizar";
      TEXT_SYS_MATCH_LIST = "Lista de jogos";
      TEXT_SYS_QUICKMATCH = "partida rápida";
      TEXT_SYS_CREATEMATCH = "criar partida";
      TEXT_SYS_BACK = "voltar";
      TEXT_SYS_OK = "ok";
      TEXT_SYS_CREATE = "criar";
      TEXT_SYS_CLOSE = "fechar";
      TEXT_SYS_LOADING = "A carregar...";
      TEXT_SYS_NAMEROOM = "Nomear sala";
      TEXT_SYS_FINDROOM = "encontra uma sala...";
      TEXT_SYS_CREATEROOM = "Criar sala";
      TEXT_SYS_DEFAULTROOMNAME = "quarto de %s";
      TEXT_SYS_PASSWORD = "Senha";
      TEXT_SYS_INFOPASS = "Se não definires uma senha, esta sala será pública.";
      TEXT_SYS_TYPEROOMPASS = "Digita a senha da sala";
      TEXT_WRONG_PASSWORD = "Senha errada!";
      TEXT_NETWORK_CONNECTING = "a conectar...";
      TEXT_ROOM_IS_FULL = "A sala está cheia!";
      TEXT_ROOM_IS_EXPIRED = "O quarto expirou!";
      TEXT_MATCH_FOUND = "Correspondência encontrada!";
      TEXT_FIND_OPPONENT = "a encontrar adversário...";
      TEXT_VS = "VS";
      TEXT_CONNECT_TO_LOBBY = "Conectar com o lobby...";
      TEXT_ROOM_DOESNT_EXIST = "A sala não existe!";
      TEXT_WAITING_FOR_OPPONENT_IN_ROOM =
        "a aguardar pelo adversário na sala: ";
      TEXT_WAITING_FOR_PLAYERS_IN_ROOM = "à espera dos jogadores na sala: ";
      TEXT_PLAY_NOW = "jogar agora";
      TEXT_WAITING_ROOM_MESSAGE =
        "Esta sala pode conter um máximo de %d jogadores";
      TEXT_SYS_MAXPLAYERS = "Máximo de jogadores";
      TEXT_SYS_CHOOSEMAXNUMPLAYERS =
        "Escolhe o número máximo de jogadores na sala.";
      TEXT_NO_CONNECTION =
        "SEM LIGAÇÃO<br/>(Conecta-te para encontrares alguém para jogar online)";
      TEXT_SYS_ADD_BOT = "ADICIONAR BOT";
      TEXT_SYS_REMOVE_BOT = "REMOVER BOT";
      TEXT_SOMETHING_WENT_WRONG = "ERRO DE LIGAÇÃO. ALGO DEU ERRADO";
      TEXT_SYS_INVITE = "CONVIDAR";
      TEXT_INVALID_NAME = "NOME INVÁLIDO!";
      TEXT_THINKING = "A AGUARDAR PELO ADVERSÁRIO";
      KEYBOARD_ALPHABET = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
      ];

      TEXT_PLAYER_KICKED = "Foste expulso do jogo devido a inatividade.";
      TEXT_SYS_COPIED_TO_CLIPBOARD =
        "Ligação do jogo copiada para a tua área de transferências. Partilha-a com os amigos!";
      break;
    }
    case LANG_IT: {
      TEXT_GAMEOVER = "CONGRATULAZIONI! HAI VINTO!";
      TEXT_LOSE = "IL GIOCATORE %s HA VINTO QUESTA PARTITA";
      TEXT_SCORE = "IL TUO PUNTEGGIO";
      TEXT_RESTART = "RIAVVIA";
      TEXT_ARE_SURE = "SICURO?";
      TEXT_SELECT_PLAYERS = "SELEZIONA IL NUMERO DI GIOCATORI!";
      TEXT_SELECT_COLOR = "SELEZIONA UN COLORE";
      TEXT_WELCOME = "BENVENUTI IN QUATTRO COLORI!";
      TEXT_TUTORIAL1 =
        "ABBINA LE CARTE PER COLORE O NUMERO E DIVENTA IL PRIMO A LIBERARSI DEL MAZZO!\n\nIL PUNTEGGIO DEL VINCITORE SARÀ PARI AL VALORE DELLE CARTE DEGLI ALTRI GIOCATORI. RAGGIUNGI %s PUNTI PER VINCERE LA PARTITA!\n\nVALORE DELLA CARTA = CIFRA SULLA CARTA";
      TEXT_TUTORIAL2 =
        "LE CARTE AZIONE RENDERANNO CAOTICO IL GIOCO!\n\nPESCA DUE COSTRINGE IL GIOCATORE SUCCESSIVO A PESCARE DUE CARTE E PERDERE IL TURNO\n\nVALORE: +%s pt";
      TEXT_TUTORIAL3 =
        "LA CARTA SALTA FERMA IL GIOCATORE SUCCESSIVO\n\nVALORE: +%s pt";
      TEXT_TUTORIAL4 =
        "LA CARTA INVERTI CAMBIA IL SENSO DEL GIOCO\n\nVALORE: +%s pt";
      TEXT_TUTORIAL5 =
        "LE CARTE JOLLY POSSONO ESSERE POSIZIONATE SU QUALSIASI CARTA IN QUALSIASI MOMENTO E CONSENTONO DI CAMBIARE IL COLORE DI GIOCO\n\nVALORE: +%s pt";
      TEXT_TUTORIAL6 =
        "IL JOLLY PESCA TRE È UN JOPLLY SPECIALE CHE TI PERMETTE DI CAMBIARE IL COLORE E COSTRINGE IL GIOCATORE SUCCESSIVO A PESCARE 3 CARTE. PER USARE QUESTA CARTA NON DEVI AVERE ALTRE CARTE ALTERNATIVE DA GIOCARE \n\nVALORE: +%s pt";
      TEXT_TUTORIAL7 =
        "NON DIMENTICARE DI PREMERE IL PULSANTE '1' QUANDO AVRAI SOLO UNA CARTA NEL MAZZO O DOVRAI PESCARE %s CARTE DI PENALITÀ!";
      TEXT_PLAYER_1 = "GIOCATORE 1";
      TEXT_PLAYER_2 = "GIOCATORE 2";
      TEXT_PLAYER_3 = "GIOCATORE 3";
      TEXT_PLAYER_4 = "GIOCATORE 4";
      TEXT_ALERT_1 =
        "È NECESSARIO PREMERE IL PULSANTE '1' QUANDO SI DISPONE DI UNA SOLA CARTA NEL MAZZO. OTTIENI %s CARTE DI PENALITÀ";
      TEXT_ALERT_2 =
        "%s HA OTTENUTO %s CARTE DI PENALITÀ PER NON AVER DETTO '1'";
      TEXT_PRELOADER_CONTINUE = "INIZIA";
      TEXT_DEVELOPED = "SVILUPPATO DA";
      TEXT_SUMMARY = "RIEPILOGO";
      TEXT_PTS_TO_WINNER = "%s pt al vincitore";
      TEXT_WINNER = "VINCITORE!";
      TEXT_PLAYER_WON = "%s HA VINTO LA PARTITA!";

      ///////////// GAME MULTIPLAYER TEXT
      TEXT_WAIT_OPPONENT = "IN ATTESA DELL'AVVERSARIO...";
      TEXT_OPPONENT_LEFT = "L'AVVERSARIO HA ABBANDONATO!";
      TEXT_PLAYER_DISCONNECTED = "HAI ABBANDONATO!";
      TEXT_REMATCH = "vuoi la rivincita?";
      TEXT_QUIT_FROM_GAME = "%s ESCI DAL GIOCO";

      ///////////// LOGIN ROOM SYSTEM TEXT
      TEXT_SYS_CHOOSENICK = "Scegli nickname";
      TEXT_SYS_UPDATE = "Aggiorna";
      TEXT_SYS_MATCH_LIST = "Lista partite";
      TEXT_SYS_QUICKMATCH = "partita veloce";
      TEXT_SYS_CREATEMATCH = "crea partita";
      TEXT_SYS_BACK = "indietro";
      TEXT_SYS_OK = "ok";
      TEXT_SYS_CREATE = "crea";
      TEXT_SYS_CLOSE = "chiudi";
      TEXT_SYS_LOADING = "Caricamento…";
      TEXT_SYS_NAMEROOM = "Nome stanza";
      TEXT_SYS_FINDROOM = "trova una stanza...";
      TEXT_SYS_CREATEROOM = "Crea stanza";
      TEXT_SYS_DEFAULTROOMNAME = "Stanza di %s";
      TEXT_SYS_PASSWORD = "Password";
      TEXT_SYS_INFOPASS =
        "Se non si imposta una password questa stanza sarà pubblica.";
      TEXT_SYS_TYPEROOMPASS = "Inserisci password stanza";
      TEXT_WRONG_PASSWORD = "Password errata!";
      TEXT_NETWORK_CONNECTING = "collegamento...";
      TEXT_ROOM_IS_FULL = "La stanza è piena!";
      TEXT_ROOM_IS_EXPIRED = "Stanza scaduta!";
      TEXT_MATCH_FOUND = "Partita trovata!";
      TEXT_FIND_OPPONENT = "ricerca avversario...";
      TEXT_VS = "VS";
      TEXT_CONNECT_TO_LOBBY = "Connessione alla lobby...";
      TEXT_ROOM_DOESNT_EXIST = "La stanza non esiste!";
      TEXT_WAITING_FOR_OPPONENT_IN_ROOM =
        "in attesa di avversario nella stanza: ";
      TEXT_WAITING_FOR_PLAYERS_IN_ROOM =
        "aspettando i giocatori nella stanza: ";
      TEXT_PLAY_NOW = "gioca ora";
      TEXT_WAITING_ROOM_MESSAGE =
        "Questa stanza può contenere max %d giocatori";
      TEXT_SYS_MAXPLAYERS = "Max Giocatori";
      TEXT_SYS_CHOOSEMAXNUMPLAYERS =
        "Scegli il numero massimo di giocatori nella stanza.";
      TEXT_NO_CONNECTION =
        "NESSUNA CONNESSIONE<br/>(Connettiti per trovare qualcuno con cui giocare online)";
      TEXT_SYS_ADD_BOT = "AGGIUNGI BOT";
      TEXT_SYS_REMOVE_BOT = "RIMUOVI BOT";
      TEXT_SOMETHING_WENT_WRONG =
        "ERRORE DI CONNESSIONE. SI È VERIFICATO UN ERRORE";
      TEXT_SYS_INVITE = "INVITA";
      TEXT_INVALID_NAME = "NOME NON VALIDO!";
      TEXT_THINKING = "IN ATTESA DELL'AVVERSARIO";
      KEYBOARD_ALPHABET = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
      ];

      TEXT_PLAYER_KICKED = "Sei uscito dal gioco per inattività.";
      TEXT_SYS_COPIED_TO_CLIPBOARD =
        "Link di gioco copiato tra i tuoi appunti. Condividilo con i tuoi amici!";
      break;
    }
    case LANG_TR: {
      TEXT_GAMEOVER = "TEBRİKLER! KAZANDIN!";
      TEXT_LOSE = "BU OYUNU %s KAZANDI";
      TEXT_SCORE = "SKORUN";
      TEXT_RESTART = "YENİDEN BAŞLA";
      TEXT_ARE_SURE = "EMİN MİSİN?";
      TEXT_SELECT_PLAYERS = "OYUNCU SAYISINI SEÇ!";
      TEXT_SELECT_COLOR = "RENK SEÇ";
      TEXT_WELCOME = "DÖRT RENGE HOŞ GELDİN!";
      TEXT_TUTORIAL1 =
        "KARTLARI RENK VEYA SAYIYA GÖRE EŞLEŞTİR, ELİNDEKİ KARTLARI İLK BİTİREN SEN OL!\n\nKAZANAN OYUNCU, DİĞER OYUNCULARIN ELİNDE KALAN KARTLARIN DEĞERİ KADAR PUAN KAZANIR. OYUNU KAZANMAK İÇİN %s PUANA ULAŞ!\n\nKART SAYISI DEĞERİ: KARTTAKİ RAKAM";
      TEXT_TUTORIAL2 =
        "AKSİYON KARTLARI OYUNU KARIŞTIRACAK!\n\n2 ÇEK: SIRADAKİ OYUNCUYU 2 KART ÇEKMEYE ZORLAR VE SIRASINI ATLATIR\n\nDEĞER: +%s puan";
      TEXT_TUTORIAL3 =
        "ATLAMA KARTI: SIRADAKİ OYUNCUNUN SIRASINI ATLATIR\n\nDEĞER: +%s puan";
      TEXT_TUTORIAL4 =
        "YÖN DEĞİŞTİRME: OYUNUN İLERLEME YÖNÜNÜ DEĞİŞTİRİR\n\nDEĞER: +%s puan";
      TEXT_TUTORIAL5 =
        "JOKER TÜM KARTLARIN ÜSTÜNE ATILABİLİR VE KARTLARIN RENGİNİ DEĞİŞTİRMEYİ SAĞLAR\n\nDEĞER: +%s puan";
      TEXT_TUTORIAL6 =
        "JOKER 3: KARTLARIN RENGİNİ DEĞİŞTİRMEYİ VE SIRADAKİ OYUNCUYA 3 KART ÇEKTİRMEYİ SAĞLAYAN ÖZEL BİR KARTTIR. BU KARTI KULLANABİLMEK İÇİN OYNAYABİLECEĞİN BAŞKA KART KALMAMIŞ OLMALIDIR\n\nDEĞER: +%s puan";
      TEXT_TUTORIAL7 =
        "ELİNDE TEK KART KALDIĞINDA ' 1 ' BUTONUNA BASMAYI UNUTMA YOKSA %s CEZA KARTI ÇEKERSİN!";
      TEXT_PLAYER_1 = "OYUNCU 1";
      TEXT_PLAYER_2 = "OYUNCU 2";
      TEXT_PLAYER_3 = "OYUNCU 3";
      TEXT_PLAYER_4 = "OYUNCU 4";
      TEXT_ALERT_1 =
        "SADECE BİR KARTIN KALDIĞINDA '1' BUTONUNA BASMALISIN. %s CEZA KARTI ÇEKERSİN";
      TEXT_ALERT_2 = "%s, '1' DEMEDİĞİ İÇİN %s CEZA KARTI ÇEKTİ";
      TEXT_PRELOADER_CONTINUE = "BAŞLA";
      TEXT_DEVELOPED = "GELİŞTİREN:";
      TEXT_SUMMARY = "ÖZET";
      TEXT_PTS_TO_WINNER = "Kazanana %s puan";
      TEXT_WINNER = "KAZANAN!";
      TEXT_PLAYER_WON = "%s OYUNU KAZANDI!";

      ///////////// GAME MULTIPLAYER TEXT
      TEXT_WAIT_OPPONENT = "RAKİP BEKLENİYOR...";
      TEXT_OPPONENT_LEFT = "RAKİP TERK ETTİ!";
      TEXT_PLAYER_DISCONNECTED = "TERK ETTİN!";
      TEXT_REMATCH = "Yeniden maç yapmak ister misin?";
      TEXT_QUIT_FROM_GAME = "%s OYUNDAN ÇIK";

      ///////////// LOGIN ROOM SYSTEM TEXT
      TEXT_SYS_CHOOSENICK = "Takma ad seç";
      TEXT_SYS_UPDATE = "güncelle";
      TEXT_SYS_MATCH_LIST = "Maç listesi";
      TEXT_SYS_QUICKMATCH = "hızlı maç";
      TEXT_SYS_CREATEMATCH = "eşleşme oluştur";
      TEXT_SYS_BACK = "geri";
      TEXT_SYS_OK = "tamam";
      TEXT_SYS_CREATE = "oluştur";
      TEXT_SYS_CLOSE = "kapat";
      TEXT_SYS_LOADING = "Yükleniyor...";
      TEXT_SYS_NAMEROOM = "Odaya ad ver";
      TEXT_SYS_FINDROOM = "oda bul...";
      TEXT_SYS_CREATEROOM = "Oda oluştur";
      TEXT_SYS_DEFAULTROOMNAME = "%s'in odası";
      TEXT_SYS_PASSWORD = "Şifre";
      TEXT_SYS_INFOPASS = "Şifre girmezsen oda herkese açık olacak.";
      TEXT_SYS_TYPEROOMPASS = "Oda Şifresini Yaz";
      TEXT_WRONG_PASSWORD = "Yanlış Şifre!";
      TEXT_NETWORK_CONNECTING = "bağlanıyor...";
      TEXT_ROOM_IS_FULL = "Oda dolu!";
      TEXT_ROOM_IS_EXPIRED = "Odanın Süresi Doldu!";
      TEXT_MATCH_FOUND = "Eşleşme bulundu!";
      TEXT_FIND_OPPONENT = "rakip bulunuyor...";
      TEXT_VS = "VS";
      TEXT_CONNECT_TO_LOBBY = "Lobiye bağlan...";
      TEXT_ROOM_DOESNT_EXIST = "Oda yok!";
      TEXT_WAITING_FOR_OPPONENT_IN_ROOM = "odada rakip bekleniyor: ";
      TEXT_WAITING_FOR_PLAYERS_IN_ROOM = "odada oyuncular bekleniyor: ";
      TEXT_PLAY_NOW = "şimdi oyna";
      TEXT_WAITING_ROOM_MESSAGE = "Bu oda en fazla %d oyuncu alabilir";
      TEXT_SYS_MAXPLAYERS = "Maksimum Oyuncu Sayısı";
      TEXT_SYS_CHOOSEMAXNUMPLAYERS = "Odadaki maksimum oyuncu sayısını seç.";
      TEXT_NO_CONNECTION =
        "BAĞLANTI YOK<br/>(Çevrimiçi oynayacak birini bulmak için bağlan)";
      TEXT_SYS_ADD_BOT = "BOT EKLE";
      TEXT_SYS_REMOVE_BOT = "BOTU KALDIR";
      TEXT_SOMETHING_WENT_WRONG = "BAĞLANTI HATASI. HATA OLUŞTU";
      TEXT_SYS_INVITE = "DAVET ET";
      TEXT_INVALID_NAME = "GEÇERSİZ İSİM!";
      TEXT_THINKING = "RAKİP BEKLENİYOR";
      KEYBOARD_ALPHABET = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
      ];
      TEXT_PLAYER_KICKED = "Eylemsizlik yüzünden oyundan atıldın.";
      TEXT_SYS_COPIED_TO_CLIPBOARD =
        "Oyun bağlantısı panoya kopyalandı. Arkadaşlarınla paylaş!";
      break;
    }
    case LANG_AR: {
      TEXT_GAMEOVER = "تهانينا! لقد فزت!";
      TEXT_LOSE = "عذرًا، فاز اللاعب %s بهذه المباراة";
      TEXT_SCORE = "نتائجك";
      TEXT_RESTART = "إعادة البدء";
      TEXT_ARE_SURE = "هل أنت متأكد؟";
      TEXT_SELECT_PLAYERS = "حدد عدد اللاعبين!";
      TEXT_SELECT_COLOR = "حدد لونًا";
      TEXT_WELCOME = "مرحبًا في FOUR COLORS!";
      TEXT_TUTORIAL1 =
        "قم بمطابقة البطاقات حسب اللون أو الرقم وكن أول من يتخلص منها!\n\nستكون نتيجة الفائز هي نفس قيمة بطاقات اللاعبين الآخرين. حقق %s نقطة للفوز باللعبة!\n\nقيمة عدد البطاقات: الرقم على البطاقة";
      TEXT_TUTORIAL2 =
        "ستمزج بطاقات العمل بين اللعبة!\n\nارسم قوتين من اللاعب التالي لاختيار بطاقتين وإلغاء\n\nالقيمة: +%s نقطة";
      TEXT_TUTORIAL3 = "تخطي بطاقة يوقف قيمة\n\nاللاعب التالي: +%s نقطة";
      TEXT_TUTORIAL4 = "البطاقة العكسية تبدل قيمة\n\nاللعبة بحكمة: +%s نقطة";
      TEXT_TUTORIAL5 =
        "يمكن وضع البطاقة البرية على أي بطاقة في أي وقت وتتيح لك تغيير اللون لتلعب\n\nالقيمة: +%s نقطة";
      TEXT_TUTORIAL6 =
        "الرسم البري الثالث هو البرية الخاصة التي تسمح لك بتغيير اللون وتجبر اللاعب التالي على سحب 3 بطاقات. لاستخدام هذه البطاقة، يجب ألا يكون لديك بطاقات بديلة أخرى لتلعب\n\nالقيمة: +%s نقطة";
      TEXT_TUTORIAL7 =
        'لا تنس الضغط على الزر "1" عندما يتبقى لديك بطاقة واحدة فقط أو ستختار %s بطاقات عقوبة!';
      TEXT_PLAYER_1 = "اللاعب 1";
      TEXT_PLAYER_2 = "اللاعب 2";
      TEXT_PLAYER_3 = "اللاعب 3";
      TEXT_PLAYER_4 = "اللاعب 4";
      TEXT_ALERT_1 =
        'يجب أن تضغط على الزر "1" عندما يتبقى لديك بطاقة واحدة فقط. ستحصل على %s بطاقات عقوبة';
      TEXT_ALERT_2 = '%s حصلت على %s بطاقات عقوبة لعدم قول "1"';
      TEXT_PRELOADER_CONTINUE = "البدء";
      TEXT_DEVELOPED = "تم تطويرها من قِبل";
      TEXT_SUMMARY = "الملخص";
      TEXT_PTS_TO_WINNER = "%s نقطة للفائز";
      TEXT_WINNER = "فائز!";
      TEXT_PLAYER_WON = "%s فاز باللعبة!";

      ///////////// GAME MULTIPLAYER TEXT
      TEXT_WAIT_OPPONENT = "انتظار الخصم...";
      TEXT_OPPONENT_LEFT = "قام الخصم بالمغادرة!";
      TEXT_PLAYER_DISCONNECTED = "لقد غادرت!";
      TEXT_REMATCH = "هل ترغب في إعادة المباراة؟";
      TEXT_QUIT_FROM_GAME = "%s خرج من اللعبة";

      ///////////// LOGIN ROOM SYSTEM TEXT
      TEXT_SYS_CHOOSENICK = "اختر اسمًا مستعارًا";
      TEXT_SYS_UPDATE = "تحديث";
      TEXT_SYS_MATCH_LIST = "قائمة المباريات";
      TEXT_SYS_QUICKMATCH = "مباراة سريعة";
      TEXT_SYS_CREATEMATCH = "إنشاء مباراة";
      TEXT_SYS_BACK = "عودة";
      TEXT_SYS_OK = "موافق";
      TEXT_SYS_CREATE = "إنشاء";
      TEXT_SYS_CLOSE = "إغلاق";
      TEXT_SYS_LOADING = "جاري التحميل...";
      TEXT_SYS_NAMEROOM = "تسمية الغرفة";
      TEXT_SYS_FINDROOM = "جارٍ البحث عن غرفة...";
      TEXT_SYS_CREATEROOM = "إنشاء غرفة";
      TEXT_SYS_DEFAULTROOMNAME = "غرفة %s";
      TEXT_SYS_PASSWORD = "كلمة المرور";
      TEXT_SYS_INFOPASS =
        "إذا لم تقم بتعيين كلمة المرور، فستكون الغرفة متاحة للجميع.";
      TEXT_SYS_TYPEROOMPASS = "اكتب كلمة المرور المخصصة للغرفة";
      TEXT_WRONG_PASSWORD = "كلمة مرور خاطئة!";
      TEXT_NETWORK_CONNECTING = "جاري الاتصال...";
      TEXT_ROOM_IS_FULL = "الغرفة ممتلئة!";
      TEXT_ROOM_IS_EXPIRED = "انتهت صلاحية الغرفة!";
      TEXT_MATCH_FOUND = "تم العثور على تطابق!";
      TEXT_FIND_OPPONENT = "جاري البحث عن خصم...";
      TEXT_VS = "اللعب ضد";
      TEXT_CONNECT_TO_LOBBY = "الاتصال بالصفحة الرئيسية...";
      TEXT_ROOM_DOESNT_EXIST = "الغرفة غير موجودة!";
      TEXT_WAITING_FOR_OPPONENT_IN_ROOM = "انتظار دخول الخصم إلى الغرفة: ";
      TEXT_WAITING_FOR_PLAYERS_IN_ROOM = "انتظار دخول اللاعبين إلى الغرفة: ";
      TEXT_PLAY_NOW = "ابدأ اللعب الآن";
      TEXT_WAITING_ROOM_MESSAGE =
        "يمكن أن تحتوي الغرفة على حد أقصي %d من اللاعبين";
      TEXT_SYS_MAXPLAYERS = "الحد الأقصى للاعبين";
      TEXT_SYS_CHOOSEMAXNUMPLAYERS =
        "اختر الحد الأقصى لعدد اللاعبين في الغرفة.";
      TEXT_NO_CONNECTION =
        "لا يوجد اتصال بالإنترنت<br/>(اتصل بالإنترنت للعثور على شخص ما للعب عبر الإنترنت)";
      TEXT_SYS_ADD_BOT = "إضافة برنامج BOT";
      TEXT_SYS_REMOVE_BOT = "إزالة برنامج BOT";
      TEXT_SOMETHING_WENT_WRONG = "خطأ في الاتصال. حدث خطأ ما";
      TEXT_SYS_INVITE = "دعوة";
      TEXT_INVALID_NAME = "لعبة غير صالحة!";
      TEXT_THINKING = "انتظار الخصم";
      KEYBOARD_ALPHABET = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
      ];
      TEXT_PLAYER_KICKED = "تم طردك من اللعبة بسبب عدم وجود نشاط لك.";
      TEXT_SYS_COPIED_TO_CLIPBOARD =
        "نسخ رابط اللعبة إلى الحافظة. شارك اللعبة مع أصدقائك!";
      break;
    }
    case LANG_HI: {
      TEXT_GAMEOVER = "बधाई हो! आप जीत गए हैं!";
      TEXT_LOSE = "माफ़ करें, खिलाड़ी %s यह गेम जीत गया";
      TEXT_SCORE = "आपका स्कोर";
      TEXT_RESTART = "रीस्टार्ट करें";
      TEXT_ARE_SURE = "क्या आप सुनिश्चित हैं?";
      TEXT_SELECT_PLAYERS = "खिलाड़ियों की संख्या चुनें!";
      TEXT_SELECT_COLOR = "एक रंग चुनें";
      TEXT_WELCOME = "चार रंगों में आपका स्वागत है!";
      TEXT_TUTORIAL1 =
        "रंग या संख्या के अनुसार कार्डों का मिलान करें और उनसे छुटकारा पाने वाले पहले व्यक्ति बनें!\n\nविजेता का स्कोर अन्य खिलाड़ियों के कार्डों के मान के समान होगा. गेम जीतने के लिए %s पॉइंट तक पहुंचें!\n\nनंबर कार्ड मान: कार्ड पर दिया डिजिट";
      TEXT_TUTORIAL2 =
        "एक्शन कार्ड गेम को मिक्स कर देंगे!\n\nड्रॉ दो अगले खिलाड़ी को दो कार्ड लेने के लिए मजबूर करता है और बारी छोड़नी पड़ती है\n\nमान: +%s पॉइंट";
      TEXT_TUTORIAL3 = "कार्ड छोड़ें अगले खिलाड़ी को रोकता है\n\nमान: +%s पॉइंट";
      TEXT_TUTORIAL4 =
        "रिवर्स कार्ड गेम के अनुसार स्विच करता है\n\nमान: +%s पॉइंट";
      TEXT_TUTORIAL5 =
        "वाइल्ड कार्ड किसी भी समय किसी भी कार्ड पर रखा जा सकता है और यह आपको खेलने के लिए रंग बदलने देता है\n\nमान: +%s पॉइंट";
      TEXT_TUTORIAL6 =
        "वाइल्ड ड्रॉ थ्री एक स्पेशल वाइल्ड है जो आपको रंग बदलने देता है और अगले खिलाड़ी को 3 कार्ड लेने के लिए मजबूर करता है. इस कार्ड का इस्तेमाल करने के लिए आपके पास खेलने के लिए कोई अन्य वैकल्पिक कार्ड नहीं होना चाहिए\n\nमान: +%s पॉइंट";
      TEXT_TUTORIAL7 =
        "जब आपके पास केवल एक कार्ड बचा होगा तो ‘ 1 ’ बटन दबाना न भूलें या आप %s पेनल्टी कार्ड चुनेंगे!";
      TEXT_PLAYER_1 = "खिलाड़ी 1";
      TEXT_PLAYER_2 = "खिलाड़ी 2";
      TEXT_PLAYER_3 = "खिलाड़ी 3";
      TEXT_PLAYER_4 = "खिलाड़ी 4";
      TEXT_ALERT_1 =
        "जब आपके पास सिर्फ एक कार्ड बचा हो तो आपको ‘ 1 ’ बटन जरूर दबाना है. आपको %s पेनल्टी कार्ड मिलते हैं";
      TEXT_ALERT_2 = "%s को नहीं कहने पर मिले %s पेनल्टी कार्ड ‘ 1 ’";
      TEXT_PRELOADER_CONTINUE = "शुरू करें";
      TEXT_DEVELOPED = "द्वारा बनाया गया";
      TEXT_SUMMARY = "सारांश";
      TEXT_PTS_TO_WINNER = "विजेता को %s पॉइंट";
      TEXT_WINNER = "विनर!";
      TEXT_PLAYER_WON = "%s गेम जीत गया!";

      ///////////// GAME MULTIPLAYER TEXT
      TEXT_WAIT_OPPONENT = "विरोधी का इंतज़ार कर रहे हैं...";
      TEXT_OPPONENT_LEFT = "विरोधी ने खेल छोड़ दिया!";
      TEXT_PLAYER_DISCONNECTED = "आप छोड़ गए हैं!";
      TEXT_REMATCH = "क्या आप फिर से मैच खेलना चाहते हैं?";
      TEXT_QUIT_FROM_GAME = "%s गेम छोड़ें";

      ///////////// LOGIN ROOM SYSTEM TEXT
      TEXT_SYS_CHOOSENICK = "उपनाम चुनें";
      TEXT_SYS_UPDATE = "अपडेट करें";
      TEXT_SYS_MATCH_LIST = "मैच की सूची";
      TEXT_SYS_QUICKMATCH = "क्विक मैच";
      TEXT_SYS_CREATEMATCH = "मैच बनाएं";
      TEXT_SYS_BACK = "पीछे";
      TEXT_SYS_OK = "ठीक है";
      TEXT_SYS_CREATE = "बनाएं";
      TEXT_SYS_CLOSE = "बंद करें";
      TEXT_SYS_LOADING = "लोड हो रहा है...";
      TEXT_SYS_NAMEROOM = "रूम को नाम दें";
      TEXT_SYS_FINDROOM = "एक रूम खोजें...";
      TEXT_SYS_CREATEROOM = "रूम बनाएं";
      TEXT_SYS_DEFAULTROOMNAME = "%s का रूम";
      TEXT_SYS_PASSWORD = "पासवर्ड";
      TEXT_SYS_INFOPASS =
        "अगर आप पासवर्ड सेट नहीं करते हैं तो यह रूम पब्लिक हो जाएगा.";
      TEXT_SYS_TYPEROOMPASS = "रूम पासवर्ड टाइप करें";
      TEXT_WRONG_PASSWORD = "गलत पासवर्ड!";
      TEXT_NETWORK_CONNECTING = "कनेक्ट हो रहा है...";
      TEXT_ROOM_IS_FULL = "रूम भर गया है!";
      TEXT_ROOM_IS_EXPIRED = "रूम की अवधि समाप्त हो गई!";
      TEXT_MATCH_FOUND = "मैच मिला!";
      TEXT_FIND_OPPONENT = "विरोधी ढूंढा जा रहा है...";
      TEXT_VS = "बनाम";
      TEXT_CONNECT_TO_LOBBY = "लॉबी से कनेक्ट करें...";
      TEXT_ROOM_DOESNT_EXIST = "रूम मौजूद नहीं है!";
      TEXT_WAITING_FOR_OPPONENT_IN_ROOM =
        "रूम में विरोधी का इंतज़ार हो रहा है: ";
      TEXT_WAITING_FOR_PLAYERS_IN_ROOM =
        "रूम में खिलाड़ियों का इंतज़ार हो रहा है: ";
      TEXT_PLAY_NOW = "अभी खेलें";
      TEXT_WAITING_ROOM_MESSAGE = "इस रूम में अधिकतम %d खिलाड़ी हो सकते हैं";
      TEXT_SYS_MAXPLAYERS = "अधिकतम खिलाड़ी";
      TEXT_SYS_CHOOSEMAXNUMPLAYERS =
        "रूम में खिलाड़ियों की अधिकतम संख्या चुनें.";
      TEXT_NO_CONNECTION =
        "कोई कनेक्शन नहीं<br/>(ऑनलाइन खेलने के लिए किसी को खोजने के लिए कनेक्ट करें)";
      TEXT_SYS_ADD_BOT = "बॉट जोड़ें";
      TEXT_SYS_REMOVE_BOT = "बॉट हटाएं";
      TEXT_SOMETHING_WENT_WRONG = "कनेक्शन में गड़बड़ी. कुछ गलत हो गया";
      TEXT_SYS_INVITE = "आमंत्रित करें";
      TEXT_INVALID_NAME = "अमान्य नाम!";
      TEXT_THINKING = "विरोधी का इंतज़ार कर रहे हैं";
      KEYBOARD_ALPHABET = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
      ];
      TEXT_PLAYER_KICKED = "निष्क्रियता के कारण आपको गेम से निकाल दिया गया था.";
      TEXT_SYS_COPIED_TO_CLIPBOARD =
        "गेम लिंक आपके क्लिपबोर्ड पर कॉपी किया गया. इसे अपने दोस्तों के साथ शेयर करें!";
      break;
    }
    case LANG_ID: {
      TEXT_GAMEOVER = "SELAMAT! KAMU MENANG!";
      TEXT_LOSE = "MAAF, PEMAIN %s MEMENANGI PERMAINAN INI";
      TEXT_SCORE = "SKOR KAMU";
      TEXT_RESTART = "MULAI ULANG";
      TEXT_ARE_SURE = "KAMU YAKIN?";
      TEXT_SELECT_PLAYERS = "PILIH JUMLAH PEMAIN!";
      TEXT_SELECT_COLOR = "PILIH WARNA";
      TEXT_WELCOME = "SELAMAT DATANG KE EMPAT WARNA!";
      TEXT_TUTORIAL1 =
        "COCOKKAN KARTU BERDASARKAN WARNA ATAU ANGKA DAN JADILAH YANG PERTAMA MENYINGKIRKAN PESAING!\n\nSKOR PEMENANG AKAN SAMA DENGAN NILAI KARTU PEMAIN LAIN. RAIH %s POIN UNTUK MEMENANGI PERMAINAN!\n\nNILAI KARTU ANGKA: DIGIT PADA KARTU";
      TEXT_TUTORIAL2 =
        "KARTU AKSI AKAN MEMERIAHKAN PERMAINAN!\n\nAMBIL DUA MEMAKSA PEMAIN BERIKUTNYA UNTUK MENGAMBIL DUA KARTU DAN MENGORBANKAN GILIRAN\n\nNILAI: +%s poin";
      TEXT_TUTORIAL3 =
        "KARTU LEWATI MENGHENTIKAN PEMAIN BERIKUTNYA\n\nNILAI: +%s poin";
      TEXT_TUTORIAL4 = "KARTU REVERSE MEMBALIK ARAH GILIRAN\n\nNILAI: +%s poin";
      TEXT_TUTORIAL5 =
        "KARTU LIAR BISA DITARUH DI ATAS KARTU APA SAJA KAPAN SAJA DAN MEMUNGKINKANMU MENGUBAH WARNA KARTU YANG DIMAINKAN\n\nNILAI: +%s poin";
      TEXT_TUTORIAL6 =
        "KARTU LIAR TIGA ADALAH KARTU LIAR SPESIAL YANG MEMUNGKINKANMU UNTUK MENGUBAH WARNA DAN MEMAKSA PEMAIN BERIKUTNYA UNTUK MENGAMBIL 3 KARTU. UNTUK MENGGUNAKAN KARTU INI, KAMU HARUS DALAM KONDISI YANG TIDAK PUNYA ALTERNATIF KARTU UNTUK DIMAINKAN\n\nNILAI: +%s poin";
      TEXT_TUTORIAL7 =
        "JANGAN LUPA UNTUK MENEKAN TOMBOL '1' SAAT KAMU HANYA MEMILIKI SATU KARTU TERSISA ATAU KAMU HARUS MENGAMBIL %s KARTU PENALTI!";
      TEXT_PLAYER_1 = "PEMAIN 1";
      TEXT_PLAYER_2 = "PEMAIN 2";
      TEXT_PLAYER_3 = "PEMAIN 3";
      TEXT_PLAYER_4 = "PEMAIN 4";
      TEXT_ALERT_1 =
        "KAMU HARUS MENEKAN TOMBOL '1' KETIKA MEMILIKI SATU KARTU TERSISA. KAMU MENERIMA %s KARTU PENALTI";
      TEXT_ALERT_2 = "%s MENERIMA %s KARTU PENALTI KARENA TIDAK MENGATAKAN '1'";
      TEXT_PRELOADER_CONTINUE = "MULAI";
      TEXT_DEVELOPED = "DIKEMBANGKAN OLEH";
      TEXT_SUMMARY = "RANGKUMAN";
      TEXT_PTS_TO_WINNER = "%s poin ke pemenang";
      TEXT_WINNER = "PEMENANG!";
      TEXT_PLAYER_WON = "%s MEMENANGI PERMAINAN!";

      ///////////// GAME MULTIPLAYER TEXT
      TEXT_WAIT_OPPONENT = "MENUNGGU LAWAN...";
      TEXT_OPPONENT_LEFT = "LAWAN TELAH PERGI!";
      TEXT_PLAYER_DISCONNECTED = "KAMU TELAH PERGI!";
      TEXT_REMATCH = "ingin bertanding ulang?";
      TEXT_QUIT_FROM_GAME = "%s KELUAR DARI GAME";

      ///////////// LOGIN ROOM SYSTEM TEXT
      TEXT_SYS_CHOOSENICK = "Pilih nama panggilan";
      TEXT_SYS_UPDATE = "perbarui";
      TEXT_SYS_MATCH_LIST = "Daftar pertandingan";
      TEXT_SYS_QUICKMATCH = "pertandingan singkat";
      TEXT_SYS_CREATEMATCH = "buat pertandingan";
      TEXT_SYS_BACK = "kembali";
      TEXT_SYS_OK = "oke";
      TEXT_SYS_CREATE = "buat";
      TEXT_SYS_CLOSE = "tutup";
      TEXT_SYS_LOADING = "Memuat...";
      TEXT_SYS_NAMEROOM = "Beri Nama Kamar";
      TEXT_SYS_FINDROOM = "temukan kamar...";
      TEXT_SYS_CREATEROOM = "Buat Kamar";
      TEXT_SYS_DEFAULTROOMNAME = "Kamar %s";
      TEXT_SYS_PASSWORD = "Kata sandi";
      TEXT_SYS_INFOPASS =
        "Kalau kamu tidak mengatur kata sandi, kamar ini akan menjadi publik.";
      TEXT_SYS_TYPEROOMPASS = "Ketik Kata Sandi Kamar";
      TEXT_WRONG_PASSWORD = "Kata Sandi Salah!";
      TEXT_NETWORK_CONNECTING = "menyambungkan...";
      TEXT_ROOM_IS_FULL = "Kamar penuh!";
      TEXT_ROOM_IS_EXPIRED = "Kamar Kedaluwarsa!";
      TEXT_MATCH_FOUND = "Pertandingan ditemukan!";
      TEXT_FIND_OPPONENT = "mencari lawan...";
      TEXT_VS = "VS";
      TEXT_CONNECT_TO_LOBBY = "Menyambungkan ke lobi...";
      TEXT_ROOM_DOESNT_EXIST = "Kamar tidak ada!";
      TEXT_WAITING_FOR_OPPONENT_IN_ROOM = "menunggu lawan dalam kamar: ";
      TEXT_WAITING_FOR_PLAYERS_IN_ROOM = "menunggu pemain dalam kamar: ";
      TEXT_PLAY_NOW = "bermain sekarang";
      TEXT_WAITING_ROOM_MESSAGE = "Kamar ini bisa diisi maks. %d pemain";
      TEXT_SYS_MAXPLAYERS = "Jumlah Maks. Pemain";
      TEXT_SYS_CHOOSEMAXNUMPLAYERS =
        "Pilih jumlah maksimum pemain dalam kamar.";
      TEXT_NO_CONNECTION =
        "TIDAK ADA KONEKSI<br/>(Sambungkan untuk menemukan lawan online)";
      TEXT_SYS_ADD_BOT = "TAMBAHKAN BOT";
      TEXT_SYS_REMOVE_BOT = "HAPUS BOT";
      TEXT_SOMETHING_WENT_WRONG = "KESALAHAN KONEKSI. ADA YANG SALAH";
      TEXT_SYS_INVITE = "UNDANG";
      TEXT_INVALID_NAME = "NAMA TIDAK VALID!";
      TEXT_THINKING = "MENUNGGU LAWAN";
      KEYBOARD_ALPHABET = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
      ];
      TEXT_PLAYER_KICKED = "Kamu dikeluarkan dari game karena tidak aktif.";
      TEXT_SYS_COPIED_TO_CLIPBOARD =
        "Tautan game disalin ke Clipboard. Bagikan ke teman-temanmu!";
      break;
    }
    case LANG_JA: {
      TEXT_GAMEOVER = "おめでとうございます！勝利！";
      TEXT_LOSE = "残念。今回は%s相手の勝利です";
      TEXT_SCORE = "自己スコア";
      TEXT_RESTART = "リスタート";
      TEXT_ARE_SURE = "本当によろしいですか？";
      TEXT_SELECT_PLAYERS = "プレイヤー数を選択してください！";
      TEXT_SELECT_COLOR = "色を選択してください";
      TEXT_WELCOME = "4 カラーにようこそ！";
      TEXT_TUTORIAL1 =
        "カードを色や数字で一 致させることで、 いち早く手持ちのカー ドを使い切ってください。\n\n勝者のスコアは、 他のプレイヤーのカードの値と等しい数値です。%s ポイントに到達してゲームに勝利しましょう！\n\n数字カードの値：カードの桁";
      TEXT_TUTORIAL2 =
        "アクションカードでゲームが混乱の渦に！\n\nドロー 2 のカードを出すと、次のプレイヤーがカードを 2 枚引き、そのターンをスキップします\n\n値：+%s ポイント";
      TEXT_TUTORIAL3 =
        "スキップのカー ドを出すと、 次のプレイヤー はそのター ンをスキップします\n\n値：+%s ポイント";
      TEXT_TUTORIAL4 =
        "リバー スのカードを出すと 、カー ドをプレイする順番が逆になります\n\n値：+%s ポイント";
      TEXT_TUTORIAL5 =
        "ワイルドのカー ドはいつでもどのカー ドに対しても使うことができ、 このカー ドを出したプレイヤー はプレイする色を変えることができます\n\n値：+%s ポイント";
      TEXT_TUTORIAL6 =
        "ワイルド・ ドロー 3 のカー ドは特殊なワイルドで、このカー ドを出したプレイヤー は色を変えることができる上に 、その次のプレイヤーに 3  枚カー ドを引かせます。このカ ードは他に出せるカ ードがない時にのみ出すことができます\n\n値：+%s ポイント";
      TEXT_TUTORIAL7 =
        "手持ちのカ ードが 1 枚になったら、 忘れずに「1」ボタンを押してください。 押さないと%sペナルティとしてカ ードを引かされます！";
      TEXT_PLAYER_1 = "プレイヤー 1";
      TEXT_PLAYER_2 = "プレイヤー 2";
      TEXT_PLAYER_3 = "プレイヤー 3";
      TEXT_PLAYER_4 = "プレイヤー 4";
      TEXT_ALERT_1 =
        "手持ちのカードが 1  枚になった時に「1」ボタンを押す必要があります。 %s  枚のペナルティカードを受け取ります";
      TEXT_ALERT_2 =
        "%s は「1」ボタンを押さなかったため、%s 枚のペナルティカードを引きました";
      TEXT_PRELOADER_CONTINUE = "スタート";
      TEXT_DEVELOPED = "開発者：";
      TEXT_SUMMARY = "要約";
      TEXT_PTS_TO_WINNER = "%s ポイントを勝者に授与";
      TEXT_WINNER = "勝者！";
      TEXT_PLAYER_WON = "%s がゲームに勝利しました！";

      ///////////// GAME MULTIPLAYER TEXT
      TEXT_WAIT_OPPONENT = "対戦相手を待っています...";
      TEXT_OPPONENT_LEFT = "対戦相手が退出しました！";
      TEXT_PLAYER_DISCONNECTED = "退出しました！";
      TEXT_REMATCH = "再度マッチしたいですか？";
      TEXT_QUIT_FROM_GAME = "%s がゲームをやめました";

      ///////////// LOGIN ROOM SYSTEM TEXT
      TEXT_SYS_CHOOSENICK = "ニックネームを選択する";
      TEXT_SYS_UPDATE = "アップデート";
      TEXT_SYS_MATCH_LIST = "マッチリスト";
      TEXT_SYS_QUICKMATCH = "クイックマッチ";
      TEXT_SYS_CREATEMATCH = "マッチを作成する";
      TEXT_SYS_BACK = "戻る";
      TEXT_SYS_OK = "OK";
      TEXT_SYS_CREATE = "作成";
      TEXT_SYS_CLOSE = "閉じる";
      TEXT_SYS_LOADING = "読み込んでいます...";
      TEXT_SYS_NAMEROOM = "部屋に名前をつける";
      TEXT_SYS_FINDROOM = "部屋を見つける...";
      TEXT_SYS_CREATEROOM = "部屋を作成する";
      TEXT_SYS_DEFAULTROOMNAME = "%s の部屋";
      TEXT_SYS_PASSWORD = "パスワード";
      TEXT_SYS_INFOPASS =
        "パスワ ードを設定しない場合は、この部屋は公開状態になります。";
      TEXT_SYS_TYPEROOMPASS = "部屋のパスワードを入力";
      TEXT_WRONG_PASSWORD = "パスワードが違います！";
      TEXT_NETWORK_CONNECTING = "接続中...";
      TEXT_ROOM_IS_FULL = "部屋は満員です！";
      TEXT_ROOM_IS_EXPIRED = "部屋は失効しました！";
      TEXT_MATCH_FOUND = "マッチを見つけました！";
      TEXT_FIND_OPPONENT = "対戦相手を探しています...";
      TEXT_VS = "VS";
      TEXT_CONNECT_TO_LOBBY = "ロビーに接続中...";
      TEXT_ROOM_DOESNT_EXIST = "部屋は存在しません！";
      TEXT_WAITING_FOR_OPPONENT_IN_ROOM = "部屋内の対戦相手を待っています： ";
      TEXT_WAITING_FOR_PLAYERS_IN_ROOM = "部屋内のプレイヤーを待っています： ";
      TEXT_PLAY_NOW = "今すぐプレイ";
      TEXT_WAITING_ROOM_MESSAGE = "この部屋は最大 %d 人まで受け入れ可能です";
      TEXT_SYS_MAXPLAYERS = "最大プレイヤー数";
      TEXT_SYS_CHOOSEMAXNUMPLAYERS =
        "部屋内の最大プレイヤ ー数を選んでください。";
      TEXT_NO_CONNECTION =
        "接続がありません<br/>（オンラインでプレイできるように接続してください）";
      TEXT_SYS_ADD_BOT = "ロボットを追加する";
      TEXT_SYS_REMOVE_BOT = "ロボットを排除する";
      TEXT_SOMETHING_WENT_WRONG = "接続エラー 。問題が発生しました";
      TEXT_SYS_INVITE = "招待する";
      TEXT_INVALID_NAME = "名前が無効です！";
      TEXT_THINKING = "対戦相手を待っています";
      KEYBOARD_ALPHABET = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
      ];
      TEXT_PLAYER_KICKED = "不活発だったためゲ ームからキックされました。";
      TEXT_SYS_COPIED_TO_CLIPBOARD =
        "ゲームリンクをクリップボードにコピ ーしました。フレンドとシェアしよう！";
      break;
    }
    case LANG_ZH: {
      TEXT_GAMEOVER = "恭喜！您赢了！";
      TEXT_LOSE = "抱歉，玩家 %s 赢了这场游戏";
      TEXT_SCORE = "您的得分";
      TEXT_RESTART = "重新开始";
      TEXT_ARE_SURE = "确定？";
      TEXT_SELECT_PLAYERS = "选择玩家数量！";
      TEXT_SELECT_COLOR = "选择颜色";
      TEXT_WELCOME = "欢迎进入 4 色纸牌游戏！";
      TEXT_TUTORIAL1 =
        "按颜色或数字匹配纸牌， 出掉这些纸牌！\n\n获胜者的得分将与其他玩家纸牌的分值相同。 达到 %s  积分即可赢得游戏！ \n\n 纸牌分值： 纸牌上的数字";
      TEXT_TUTORIAL2 =
        "行动牌行会打乱游戏局面！ \n\n 抽两张纸牌会迫使下家选择两张纸牌并放弃回合 \n\n 分值：+%s 积分";
      TEXT_TUTORIAL3 = "跳过牌可让下家停止出牌一次 \n\n 分值：+%s 积分";
      TEXT_TUTORIAL4 = "反转牌可以反转出牌方向 \n\n 分值：+%s 积分";
      TEXT_TUTORIAL5 =
        "万能牌在任何条件下均可打出 ，并改变下家出牌颜色 \n\n 分值：+%s 积分";
      TEXT_TUTORIAL6 =
        "Wild Draw 3  是一种特殊的万能牌， 它允许您改变下家出牌颜色并让下家选择  3  张纸牌。 您必须在无其他符合颜色或数 字的纸牌可出的情况下才能使用  WILD Draw 3 \n\n 分值：+%s 积分";
      TEXT_TUTORIAL7 =
        "当您只剩下一张纸牌时， 不要忘记按下  “1”  键， 否则您将被罚再摸 %s 张纸牌！";
      TEXT_PLAYER_1 = "1 号玩家";
      TEXT_PLAYER_2 = "2 号玩家";
      TEXT_PLAYER_3 = "3 号玩家";
      TEXT_PLAYER_4 = "4 号玩家";
      TEXT_ALERT_1 =
        "当您只剩下一张纸牌的时候，必须按下 “1” 键。您被罚摸 %s 张纸牌!";
      TEXT_ALERT_2 = "%s 因为没有按下 “1” 键被罚摸 %s 张纸牌";
      TEXT_PRELOADER_CONTINUE = "开始";
      TEXT_DEVELOPED = "游戏开发者";
      TEXT_SUMMARY = "总结";
      TEXT_PTS_TO_WINNER = "赢家获得 %s 积分";
      TEXT_WINNER = "赢家！";
      TEXT_PLAYER_WON = "%s 赢了这场游戏！";

      ///////////// GAME MULTIPLAYER TEXT
      TEXT_WAIT_OPPONENT = "正在等待对手......";
      TEXT_OPPONENT_LEFT = "对手离开！";
      TEXT_PLAYER_DISCONNECTED = "您离开！";
      TEXT_REMATCH = "您想重新匹配吗？";
      TEXT_QUIT_FROM_GAME = "%s 退出游戏";

      ///////////// LOGIN ROOM SYSTEM TEXT
      TEXT_SYS_CHOOSENICK = "选择昵称";
      TEXT_SYS_UPDATE = "更新";
      TEXT_SYS_MATCH_LIST = "匹配列表";
      TEXT_SYS_QUICKMATCH = "快速匹配";
      TEXT_SYS_CREATEMATCH = "创建匹配";
      TEXT_SYS_BACK = "返回";
      TEXT_SYS_OK = "确定";
      TEXT_SYS_CREATE = "创建";
      TEXT_SYS_CLOSE = "关闭";
      TEXT_SYS_LOADING = "正在加载......";
      TEXT_SYS_NAMEROOM = "命名房间";
      TEXT_SYS_FINDROOM = "找到一个房间......";
      TEXT_SYS_CREATEROOM = "创建房间";
      TEXT_SYS_DEFAULTROOMNAME = "%s 的房间";
      TEXT_SYS_PASSWORD = "密码";
      TEXT_SYS_INFOPASS = "如果您不设置密码，这个房间将是公开的。";
      TEXT_SYS_TYPEROOMPASS = "输入房间密码";
      TEXT_WRONG_PASSWORD = "密码错误！";
      TEXT_NETWORK_CONNECTING = "正在连接......";
      TEXT_ROOM_IS_FULL = "房间已满!";
      TEXT_ROOM_IS_EXPIRED = "房间已失效！";
      TEXT_MATCH_FOUND = "找到匹配!";
      TEXT_FIND_OPPONENT = "正在寻找对手......";
      TEXT_VS = "对";
      TEXT_CONNECT_TO_LOBBY = "连接到大厅......";
      TEXT_ROOM_DOESNT_EXIST = "房间不存在!";
      TEXT_WAITING_FOR_OPPONENT_IN_ROOM = "在房间里等待对手: ";
      TEXT_WAITING_FOR_PLAYERS_IN_ROOM = "在房间里等待玩家: ";
      TEXT_PLAY_NOW = "开始游戏";
      TEXT_WAITING_ROOM_MESSAGE = "这个房间最多可以容纳 %d 名玩家";
      TEXT_SYS_MAXPLAYERS = "最大玩家数量";
      TEXT_SYS_CHOOSEMAXNUMPLAYERS = "选择房间中的最大玩家数量。";
      TEXT_NO_CONNECTION = "无连接 < br/> (连接以找人在线玩)";
      TEXT_SYS_ADD_BOT = "添加机器人";
      TEXT_SYS_REMOVE_BOT = "删除机器人";
      TEXT_SOMETHING_WENT_WRONG = "连接错误。出现错误";
      TEXT_SYS_INVITE = "邀请";
      TEXT_INVALID_NAME = "名称无效！";
      TEXT_THINKING = "正在等待对手......";
      KEYBOARD_ALPHABET = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
      ];
      TEXT_PLAYER_KICKED = "你由于不活跃被踢出游戏。";
      TEXT_SYS_COPIED_TO_CLIPBOARD = "已复制游戏链接到剪贴板。向朋友分享吧！";
      break;
    }
  }
}
