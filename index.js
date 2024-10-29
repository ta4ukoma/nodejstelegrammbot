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
    Имя хоста: ${JSON.stringify(status.hostname)}
    Платформа: ${JSON.stringify(status.platform)}
    Версия ОС: ${JSON.stringify(status.osrelease)}
    Состояние сервера:
    Время работы: ${status.uptime_hour} час(ы), ${status.uptime_min} минут(ы), ${status.uptime_sec} секунд(ы)
    Загрузка CPU (1 мин): ${status.cpuLoad}
    Свободная оперативная память: ${status.freeMemory.toFixed(2)} МБ
    Сетевые интерфейсы: ${status.ipv4Addresses}
    `;

    // Отправка ответа пользователю
    bot.sendMessage(msg.chat.id, responseMessage, { parse_mode: 'Markdown' });
});

console.log('Бот запущен с использованием polling');

// Функция для получения статуса сервера
function getServerStatus() {
    const networkInterfaces = os.networkInterfaces();
    const ipv4Addresses = Object.entries(networkInterfaces)
  .flatMap(([key, interfaces]) =>
    interfaces
      .filter(iface => iface.family === 'IPv4')
      .map(iface => `${key} : ${iface.address}`)
  )
  .join('\n');
    const cpuLoad = os.loadavg()[0]; // Средняя загрузка CPU за 1 минуту
    const hostname = os.hostname();
    const freeMemory = os.freemem() / (1024 * 1024); // Свободная память в МБ
    const platform = os.platform();
    const osrelease = os.release();
    
    // Printing os.uptime() value
    const uptime_sec = os.uptime();
    let uptime_min = uptime_sec / 60;
    let uptime_hour = uptime_min / 60;
    
    uptime_sec = Math.floor(uptime_sec);
    uptime_min = Math.floor(uptime_min);
    uptime_hour = Math.floor(uptime_hour);
    
    uptime_hour = uptime_hour % 60;
    uptime_min = uptime_min % 60;
    uptime_sec = uptime_sec % 60;

    return {
        ipv4Addresses,
        hostname,
        cpuLoad,
        freeMemory,
        platform,
        osrelease,
        uptime_hour,
        uptime_min,
        uptime_sec,
    };
}