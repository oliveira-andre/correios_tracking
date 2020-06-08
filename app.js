const { rastro } = require('rastrojs');

async function lastTrackResponse(trackingNumber) {
  const track = await rastro.track(trackingNumber);
  const tracks = track[0].tracks;

  if (tracks.length == 0) { return }

  console.log( tracks[tracks.length - 1]);
};

lastTrackResponse('OD309610299BR');
