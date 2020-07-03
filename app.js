require('dotenv/config');

const { rastro } = require('rastrojs');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.telegram_token;
const bot = new TelegramBot(token, { polling: true });

let trackingNumber = '';
let lastTrack = '';

let trackList = [];

async function setTrackObject(trackName) {
  let trackObject = {
    name: trackName,
    number: trackingNumber
  };

  trackList.push(trackObject);
}

async function lastTrackResponse() {
  if(trackingNumber === '') { return }

  const track = await rastro.track(trackingNumber);
  const tracks = track[0].tracks;

  if (tracks.length == 0) { return }

  lastTrack = tracks[tracks.length - 1];
  return lastTrack;
};

function trackDetailsMessage() {
  let { locale, status, observation, trackedAt } = lastTrack;

  return `is on: ${locale},\nstatus: ${status},\n\
description: ${observation},\nupdatedAt: ${trackedAt}`;
}

function trackListMessage() {
  let trackListMessage = trackList.map(
    track => `name: ${track.name},\nnumber: ${track.number}\n---\n`
  );

  return trackListMessage[0];
}

async function app() {
  bot.onText(/\/setTrack (.+);(.+)/, (msg, match) => {	
    trackingNumber = match[1];

    setTrackObject(match[2]);
    lastTrackResponse()

    bot.sendMessage(msg.chat.id, 'new tracking number was setted with success');
  });

  bot.onText(/\/getTrack$/, (msg) => {
    bot.sendMessage(msg.chat.id, trackDetailsMessage());
  });

  bot.onText(/\/getTrackList/, (msg) => {
    bot.sendMessage(msg.chat.id, trackListMessage());
  });

};

lastTrackResponse();
app();
