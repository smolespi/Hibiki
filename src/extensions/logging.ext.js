/**
 * @fileoverview Logging extension
 * @description Loads any loggers
*/

module.exports = (bot, db) => {
  // Looks for loggers
  require("fs").readdir(`${__dirname}/loggers`, (err, files) => {
    files.forEach(l => {
      let logger;
      try {
        // Tries to load each logger
        logger = require(`${__dirname}/loggers/${l}`);
        logger(bot, db);
      } catch (err) {
        bot.log.error(`Error while loading logger ${l}: ${err}`);
      }
      if (!logger) return;
    });
  });
};