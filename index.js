const os = require('node:os');
const TelegramBot = require('node-telegram-bot-api');
var config = require('./config.json');

// Вставьте свой токен бота
const TOKEN = config.bot_token;

// Создаем экземпляр бота
const bot = new TelegramBot(TOKEN, { polling: true });

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет! Я ваш бот.');
});

// Обработчик команды /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Помощь: используйте /start для начала.');
});

bot.onText(/\/status/, (msg) => {
    const status = getServerStatus();
    const responseMessage = `
Состояние сервера:
Сетевые интерфейсы: ${JSON.stringify(status.interfaces)}
Модель процессора: ${JSON.stringify(status.cpuModel)}
Загрузка CPU (1 мин): ${status.cpuLoad}
Свободная оперативная память: ${status.freeMemory.toFixed(2)} МБ
    `;

    // Отправка ответа пользователю
    bot.sendMessage(msg.chat.id, responseMessage, { parse_mode: 'Markdown' });
});

console.log('Бот запущен с использованием polling');



// Обработчик текстовых сообщений
// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     // Ответ на любое текстовое сообщение
//     bot.sendMessage(chatId, 'Вы написали: ' + msg.text);
// });

// Функция для получения статуса сервера
function getServerStatus() {
    const interfaces = os.networkInterfaces();
    const cpuLoad = os.loadavg()[0]; // Средняя загрузка CPU за 1 минуту
    const cpus = os.cpus();
    const cpuModel = cpus[0].model;
    const freeMemory = os.freemem() / (1024 * 1024); // Свободная память в МБ

    return {
        interfaces,
        cpuModel,
        cpuLoad,
        freeMemory,
    };
}
