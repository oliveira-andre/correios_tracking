require('dotenv/config');

const { rastro } = require('rastrojs');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.telegram_token;
const bot = new TelegramBot(token, { polling: true });

let trackingNumber = '';
let lastTrack = {};
let trackList = [];

async function setTrackObject(trackName) {
  let trackObject = {
    name: trackName,
    number: trackingNumber
  };

  trackList.push(trackObject);
}

async function lastTrackResponse(index) {
  if (index) {
    trackingNumber = trackList[index].trackingNumber;
  }

  if(trackingNumber === '' || trackingNumber === 'undefined') { return }

  let trackResponse = await rastro.track(trackingNumber);
  let tracks = trackResponse[0].tracks;

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
  let trackListMessage = '';

  if (trackList.length !== 0) {
    trackList.forEach(track => {
      trackListMessage = trackListMessage + `name: ${track.name},\nnumber: ${track.number}\n---\n`
    });
  } else {
    return 'No track object into the list';
  }
  return trackListMessage;
}

function removeTrackFromList(index) {
  trackList.splice(index, 1);
  return 'Removed with success';
}

async function app() {
  bot.onText(/\/setTrack (.+);(.+)/, (msg, match) => {	
    trackingNumber = match[1];
    setTrackObject(match[2]);
    bot.sendMessage(msg.chat.id, 'new tracking number was setted with success');
  });

  bot.onText(/\/getTrack (.+)/, (msg, match) => {
    lastTrackResponse(match[1]);
    bot.sendMessage(msg.chat.id, trackDetailsMessage());
  });

  bot.onText(/\/getTrackList/, (msg) => {
    bot.sendMessage(msg.chat.id, trackListMessage());
  });

  bot.onText(/\/rmTrack (.+)/, (msg, match) => {
    bot.sendMessage(msg.chat.id, removeTrackFromList(match[1]));
  });
};

lastTrackResponse();
app();
