//Import Patient Reponse Constructor
const Models = require('../models.js')
const { request } = require('express');
const e = require('express');

//Get Voice Reponse object
const VoiceResponse = require('twilio').twiml.VoiceResponse;

exports.initial = (request, response) => {
    // Use the Twilio Node.js SDK to build an XML response
    const twiml = new VoiceResponse();
    twiml.say({ voice: 'alice' }, 'Hi, thank you for reaching out to Triage today and for taking the first step in your journey to bettering your mental health. I am now going to ask you a few personal question to better understand how we can help you. This call will be recorded.');

    // Create new database entry for caller
    //Construct new object
    let newPatientResponse = new Models.PatientResponse(
      `${moment().format('YYYY-MM-DD HH:mm:ss')}`,
      request.body.From,
      "Voice");
    // Ingest into db
    request.app.db.collection('patient_responses').insertOne(newPatientResponse);

    // Get Basic Info about caller
    twiml.say({voice: 'alice'}, '')
    // Use <Record> to record the caller's message
    twiml.record({
      timeout: 60,
      action: '/voice/q1',
      finishOnKey: '1234567890*#',
      recordingStatusCallback: '/voice/initial/recording',
      transcribe: true,
      transcribeCallback: '/voice/initial/transcription'
    });
  
    twiml.hangup();
    // Render the response as XML in reply to the webhook request
    response.type('text/xml');
    response.send(twiml.toString());
  }

  exports.initial_transcription = (request, response) => {
    const patient_phone_number = request.body.From;

    //Check if initial response object doesn't exist
    if (request.app.db.collection('patient_responses').findOne(
      {
        phone_number: patient_phone_number,
        responses: {question_id: "initial"}
      }) == null)
    {
      // if it doesn't exists add one to the response set
      request.app.db.collection('patient_responses').updateOne(
        {phone_number: patient_phone_number},
        {$addToSet: 
          {responses: new Models.VoiceResponseObject("initial", null, request.body.TranscriptionText, request.body.TranscriptionUrl)}
        }
      );
    }
    else
    {
      //else update the existing response object for initial question
      //Hacky make better
      
      //get object
      var patient_response_doc = request.app.db.collection('patient_responses').findOne(
        {
          phone_number: patient_phone_number,
          responses:
          {
            question_id: "initial"
          }
        }
      );
      
      console.log(patient_response_doc);

      //pop old object
      request.app.db.collection('patient_responses').updateOne(
        {
          phone_number: patient_phone_number
        },
        {
          $pull: 
          { responses: 
            { 
              question_id: "initial"
            }
          }
        }
      );

      //insert updated object
      request.app.db.collection('patient_responses').updateOne(
        {phone_number: patient_phone_number},
        {$addToSet: 
          {responses: new Models.VoiceResponseObject("initial", null, request.body.TranscriptionText, request.body.TranscriptionUrl)}}
      );

    }
  }

  exports.q1 = (request, response) => {
    // Use the Twilio Node.js SDK to build an XML response
    const twiml = new VoiceResponse();

    //Ask Question
    twiml.say({ voice: 'alice' }, 'Question 1');
  
    // Use <Record> to record the caller's message
    twiml.record({
      timeout: 60,
      action: '/voice/q2',
      finishOnKey: '1234567890*#',
      recordingStatusCallback: '/voice/q1/recording',
      transcribe: true,
      transcribeCallback: '/voice/q1/transcription'
    });
  
    twiml.hangup();
    // Render the response as XML in reply to the webhook request
    response.type('text/xml');
    response.send(twiml.toString());
  }

  exports.q2 = (request, response) => {
    // Use the Twilio Node.js SDK to build an XML response
    const twiml = new VoiceResponse();

    //Ask Question
    twiml.say({ voice: 'alice' }, 'Question 2');
  
    // Use <Record> to record the caller's message
    twiml.record({
      timeout: 60,
      action: '/voice/q3',
      finishOnKey: '1234567890*#',
      recordingStatusCallback: '/voice/q2/recording',
      transcribe: true,
      transcribeCallback: '/voice/q2/transcription'
    });
  
    twiml.hangup();
    // Render the response as XML in reply to the webhook request
    response.type('text/xml');
    response.send(twiml.toString());
  }

  exports.q3 = (request, response) => {
    // Use the Twilio Node.js SDK to build an XML response
    const twiml = new VoiceResponse();

    //Ask Question
    twiml.say({ voice: 'alice' }, 'Question 3');
  
    // Use <Record> to record the caller's message
    twiml.record({
      timeout: 60,
      action: '/voice/q4',
      finishOnKey: '1234567890*#',
      recordingStatusCallback: '/voice/q3/recording',
      transcribe: true,
      transcribeCallback: '/voice/q3/transcription'
    });
  
    twiml.hangup();
    // Render the response as XML in reply to the webhook request
    response.type('text/xml');
    response.send(twiml.toString());
  }

  exports.q4 = (request, response) => {
    // Use the Twilio Node.js SDK to build an XML response
    const twiml = new VoiceResponse();

    //Ask Question
    twiml.say({ voice: 'alice' }, 'Question 1');
  
    // Use <Record> to record the caller's message
    twiml.record({
      timeout: 60,
      action: '/voice/q5',
      finishOnKey: '1234567890*#',
      recordingStatusCallback: '/voice/q4/recording',
      transcribe: true,
      transcribeCallback: '/voice/q4/transcription'
    });
  
    twiml.hangup();
    // Render the response as XML in reply to the webhook request
    response.type('text/xml');
    response.send(twiml.toString());
  }

  exports.q5 = (request, response) => {
    // Use the Twilio Node.js SDK to build an XML response
    const twiml = new VoiceResponse();

    //Ask Question
    twiml.say({ voice: 'alice' }, 'Question 5');
  
    // Use <Record> to record the caller's message
    twiml.record({
      timeout: 60,
      action: '/voice/end',
      finishOnKey: '1234567890*#',
      recordingStatusCallback: '/voice/q5/recording',
      transcribe: true,
      transcribeCallback: '/voice/q5/transcription'
    });
  
    twiml.hangup();
    // Render the response as XML in reply to the webhook request
    response.type('text/xml');
    response.send(twiml.toString());
  }

  exports.end = (request, response) => {
    // Use the Twilio Node.js SDK to build an XML response
    const twiml = new VoiceResponse();

    //Ask Question
    twiml.say({ voice: 'alice' }, 'Thank you for your responses, someone will reach out to you to schedule an appointment as soon as possible.');
  
    twiml.hangup();
    // Render the response as XML in reply to the webhook request
    response.type('text/xml');
    response.send(twiml.toString());
  }
