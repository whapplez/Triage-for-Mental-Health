//Get Voice Reponse object
const VoiceResponse = require('twilio').twiml.VoiceResponse;

exports.initial = (request, response) => {
    // Use the Twilio Node.js SDK to build an XML response
    const twiml = new VoiceResponse();
    twiml.say({ voice: 'alice' }, 'Hi, thank you for reaching out to Triage today and for taking the first step in your journey to bettering your mental health. I am now going to ask you a few personal question to better understand how we can help you. This call will be recorded.');
  
    //Get Basic Info about caller
    twiml.say('Please state your full name and age.')
    // Use <Record> to record the caller's message
    twiml.record({
      timeout: 60,
      action: '',
      finishOnKey: '1234567890*#',
      recordingStatusCallback: '/voice/recording',
      transcribe: true,
      transcribeCallback: '/voice/transcription'
    });
  
    twiml.hangup();
    // Render the response as XML in reply to the webhook request
    response.type('text/xml');
    response.send(twiml.toString());
  }

