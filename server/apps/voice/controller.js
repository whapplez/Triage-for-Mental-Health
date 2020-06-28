//Import Patient Reponse Constructor
const Models = require('../models.js')
const { request } = require('express');
const e = require('express');
const moment = require('moment');

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

    //Check if initial response object doesn't exist
    var patient_response_doc;
    request.app.db.collection('patient_responses').findOne(
      {
        phone_number: request.body.From,
        responses: 
        {
          $elemMatch: {
            question_id: "initial"
          }
        }
      },
      {
        projection: 
        {
          responses: 
          {$elemMatch:
          {
            question_id: "initial"
          }}
        }
      },
      function (err, result)
      {
       if (err) throw err;
       patient_response_doc = result.responses[0]; 
       console.log(patient_response_doc);
        if (patient_response_doc == null)
        {
          console.log("Initial response not found");
          // if it doesn't exists add one to the response set
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("initial", null, request.body.TranscriptionText, request.body.TranscriptionUrl)}
            }
          );
        }
        else
        {
          //else update the existing response object for initial question
          //Hacky make better
          console.log("Initial response found");
          //pop old object
          request.app.db.collection('patient_responses').updateOne(
            {
              phone_number: request.From
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
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("initial", patient_response_doc.recording_url, request.body.TranscriptionText, request.body.TranscriptionUrl)}}
          );
        }
      });

    response.send("Transcription inserted into db.")
  }

  exports.initial_recording = (request, response) => {

    //Check if initial response object doesn't exist
    var patient_response_doc;
    request.app.db.collection('patient_responses').findOne(
      {
        phone_number: request.body.From,
        responses: 
        {
          $elemMatch: {
            question_id: "initial"
          }
        }
      },
      {
        projection: 
        {
          responses: 
          {$elemMatch:
          {
            question_id: "initial"
          }}
        }
      },
      function (err, result)
      {
       if (err) throw err;
       patient_response_doc = result.responses[0]; 
       console.log(patient_response_doc);
        if (patient_response_doc == null)
        {
          console.log("Initial response not found");
          // if it doesn't exists add one to the response set
          //insert updated object
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("initial", request.body.RecordingUrl, null, null)}}
          );
        }
        else
        {
          //else update the existing response object for initial question
          //Hacky make better
          console.log("Initial response found");
          //pop old object
          request.app.db.collection('patient_responses').updateOne(
            {
              phone_number: request.From
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
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("initial", request.body.RecordingUrl, patient_response_doc.transcription_text, patient_response_doc.transcription_url)}}
          );
        }
      });

    response.send("Recording url inserted into db.")
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

  exports.q1_transcription = (request, response) => {

    //Check if q1 response object doesn't exist
    var patient_response_doc;
    request.app.db.collection('patient_responses').findOne(
      {
        phone_number: request.body.From,
        responses: 
        {
          $elemMatch: {
            question_id: "q1"
          }
        }
      },
      {
        projection: 
        {
          responses: 
          {$elemMatch:
          {
            question_id: "q1"
          }}
        }
      },
      function (err, result)
      {
       if (err) throw err;
       patient_response_doc = result.responses[0]; 
       console.log(patient_response_doc);
        if (patient_response_doc == null)
        {
          console.log("q1 response not found");
          // if it doesn't exists add one to the response set
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q1", null, request.body.TranscriptionText, request.body.TranscriptionUrl)}
            }
          );
        }
        else
        {
          //else update the existing response object for q1 question
          //Hacky make better
          console.log("q1 response found");
          //pop old object
          request.app.db.collection('patient_responses').updateOne(
            {
              phone_number: request.From
            },
            {
              $pull: 
              { responses: 
                { 
                  question_id: "q1"
                }
              }
            }
          );

          //insert updated object
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q1", patient_response_doc.recording_url, request.body.TranscriptionText, request.body.TranscriptionUrl)}}
          );
        }
      });

    response.send("Transcription inserted into db.")
  }

  exports.q1_recording = (request, response) => {

    //Check if q1 response object doesn't exist
    var patient_response_doc;
    request.app.db.collection('patient_responses').findOne(
      {
        phone_number: request.body.From,
        responses: 
        {
          $elemMatch: {
            question_id: "q1"
          }
        }
      },
      {
        projection: 
        {
          responses: 
          {$elemMatch:
          {
            question_id: "q1"
          }}
        }
      },
      function (err, result)
      {
       if (err) throw err;
       patient_response_doc = result.responses[0]; 
       console.log(patient_response_doc);
        if (patient_response_doc == null)
        {
          console.log("q1 response not found");
          // if it doesn't exists add one to the response set
          //insert updated object
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q1", request.body.RecordingUrl, null, null)}}
          );
        }
        else
        {
          //else update the existing response object for q1 question
          //Hacky make better
          console.log("q1 response found");
          //pop old object
          request.app.db.collection('patient_responses').updateOne(
            {
              phone_number: request.From
            },
            {
              $pull: 
              { responses: 
                { 
                  question_id: "q1"
                }
              }
            }
          );

          //insert updated object
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q1", request.body.RecordingUrl, patient_response_doc.transcription_text, patient_response_doc.transcription_url)}}
          );
        }
      });

    response.send("Recording url inserted into db.")
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

  exports.q2_transcription = (request, response) => {

    //Check if q2 response object doesn't exist
    var patient_response_doc;
    request.app.db.collection('patient_responses').findOne(
      {
        phone_number: request.body.From,
        responses: 
        {
          $elemMatch: {
            question_id: "q2"
          }
        }
      },
      {
        projection: 
        {
          responses: 
          {$elemMatch:
          {
            question_id: "q2"
          }}
        }
      },
      function (err, result)
      {
       if (err) throw err;
       patient_response_doc = result.responses[0]; 
       console.log(patient_response_doc);
        if (patient_response_doc == null)
        {
          console.log("q2 response not found");
          // if it doesn't exists add one to the response set
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q2", null, request.body.TranscriptionText, request.body.TranscriptionUrl)}
            }
          );
        }
        else
        {
          //else update the existing response object for q2 question
          //Hacky make better
          console.log("q2 response found");
          //pop old object
          request.app.db.collection('patient_responses').updateOne(
            {
              phone_number: request.From
            },
            {
              $pull: 
              { responses: 
                { 
                  question_id: "q2"
                }
              }
            }
          );

          //insert updated object
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q2", patient_response_doc.recording_url, request.body.TranscriptionText, request.body.TranscriptionUrl)}}
          );
        }
      });

    response.send("Transcription inserted into db.")
  }

  exports.q2_recording = (request, response) => {

    //Check if q2 response object doesn't exist
    var patient_response_doc;
    request.app.db.collection('patient_responses').findOne(
      {
        phone_number: request.body.From,
        responses: 
        {
          $elemMatch: {
            question_id: "q2"
          }
        }
      },
      {
        projection: 
        {
          responses: 
          {$elemMatch:
          {
            question_id: "q2"
          }}
        }
      },
      function (err, result)
      {
       if (err) throw err;
       patient_response_doc = result.responses[0]; 
       console.log(patient_response_doc);
        if (patient_response_doc == null)
        {
          console.log("q2 response not found");
          // if it doesn't exists add one to the response set
          //insert updated object
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q2", request.body.RecordingUrl, null, null)}}
          );
        }
        else
        {
          //else update the existing response object for q2 question
          //Hacky make better
          console.log("q2 response found");
          //pop old object
          request.app.db.collection('patient_responses').updateOne(
            {
              phone_number: request.From
            },
            {
              $pull: 
              { responses: 
                { 
                  question_id: "q2"
                }
              }
            }
          );

          //insert updated object
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q2", request.body.RecordingUrl, patient_response_doc.transcription_text, patient_response_doc.transcription_url)}}
          );
        }
      });

    response.send("Recording url inserted into db.")
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

  exports.q3_transcription = (request, response) => {

    //Check if q3 response object doesn't exist
    var patient_response_doc;
    request.app.db.collection('patient_responses').findOne(
      {
        phone_number: request.body.From,
        responses: 
        {
          $elemMatch: {
            question_id: "q3"
          }
        }
      },
      {
        projection: 
        {
          responses: 
          {$elemMatch:
          {
            question_id: "q3"
          }}
        }
      },
      function (err, result)
      {
       if (err) throw err;
       patient_response_doc = result.responses[0]; 
       console.log(patient_response_doc);
        if (patient_response_doc == null)
        {
          console.log("q3 response not found");
          // if it doesn't exists add one to the response set
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q3", null, request.body.TranscriptionText, request.body.TranscriptionUrl)}
            }
          );
        }
        else
        {
          //else update the existing response object for q3 question
          //Hacky make better
          console.log("q3 response found");
          //pop old object
          request.app.db.collection('patient_responses').updateOne(
            {
              phone_number: request.From
            },
            {
              $pull: 
              { responses: 
                { 
                  question_id: "q3"
                }
              }
            }
          );

          //insert updated object
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q3", patient_response_doc.recording_url, request.body.TranscriptionText, request.body.TranscriptionUrl)}}
          );
        }
      });

    response.send("Transcription inserted into db.")
  }

  exports.q3_recording = (request, response) => {

    //Check if q3 response object doesn't exist
    var patient_response_doc;
    request.app.db.collection('patient_responses').findOne(
      {
        phone_number: request.body.From,
        responses: 
        {
          $elemMatch: {
            question_id: "q3"
          }
        }
      },
      {
        projection: 
        {
          responses: 
          {$elemMatch:
          {
            question_id: "q3"
          }}
        }
      },
      function (err, result)
      {
       if (err) throw err;
       patient_response_doc = result.responses[0]; 
       console.log(patient_response_doc);
        if (patient_response_doc == null)
        {
          console.log("q3 response not found");
          // if it doesn't exists add one to the response set
          //insert updated object
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q3", request.body.RecordingUrl, null, null)}}
          );
        }
        else
        {
          //else update the existing response object for q3 question
          //Hacky make better
          console.log("q3 response found");
          //pop old object
          request.app.db.collection('patient_responses').updateOne(
            {
              phone_number: request.From
            },
            {
              $pull: 
              { responses: 
                { 
                  question_id: "q3"
                }
              }
            }
          );

          //insert updated object
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q3", request.body.RecordingUrl, patient_response_doc.transcription_text, patient_response_doc.transcription_url)}}
          );
        }
      });

    response.send("Recording url inserted into db.")
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

  exports.q4_transcription = (request, response) => {

    //Check if q4 response object doesn't exist
    var patient_response_doc;
    request.app.db.collection('patient_responses').findOne(
      {
        phone_number: request.body.From,
        responses: 
        {
          $elemMatch: {
            question_id: "q4"
          }
        }
      },
      {
        projection: 
        {
          responses: 
          {$elemMatch:
          {
            question_id: "q4"
          }}
        }
      },
      function (err, result)
      {
       if (err) throw err;
       patient_response_doc = result.responses[0]; 
       console.log(patient_response_doc);
        if (patient_response_doc == null)
        {
          console.log("q4 response not found");
          // if it doesn't exists add one to the response set
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q4", null, request.body.TranscriptionText, request.body.TranscriptionUrl)}
            }
          );
        }
        else
        {
          //else update the existing response object for q4 question
          //Hacky make better
          console.log("q4 response found");
          //pop old object
          request.app.db.collection('patient_responses').updateOne(
            {
              phone_number: request.From
            },
            {
              $pull: 
              { responses: 
                { 
                  question_id: "q4"
                }
              }
            }
          );

          //insert updated object
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q4", patient_response_doc.recording_url, request.body.TranscriptionText, request.body.TranscriptionUrl)}}
          );
        }
      });

    response.send("Transcription inserted into db.")
  }

  exports.q4_recording = (request, response) => {

    //Check if q4 response object doesn't exist
    var patient_response_doc;
    request.app.db.collection('patient_responses').findOne(
      {
        phone_number: request.body.From,
        responses: 
        {
          $elemMatch: {
            question_id: "q4"
          }
        }
      },
      {
        projection: 
        {
          responses: 
          {$elemMatch:
          {
            question_id: "q4"
          }}
        }
      },
      function (err, result)
      {
       if (err) throw err;
       patient_response_doc = result.responses[0]; 
       console.log(patient_response_doc);
        if (patient_response_doc == null)
        {
          console.log("q4 response not found");
          // if it doesn't exists add one to the response set
          //insert updated object
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q4", request.body.RecordingUrl, null, null)}}
          );
        }
        else
        {
          //else update the existing response object for q4 question
          //Hacky make better
          console.log("q4 response found");
          //pop old object
          request.app.db.collection('patient_responses').updateOne(
            {
              phone_number: request.From
            },
            {
              $pull: 
              { responses: 
                { 
                  question_id: "q4"
                }
              }
            }
          );

          //insert updated object
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q4", request.body.RecordingUrl, patient_response_doc.transcription_text, patient_response_doc.transcription_url)}}
          );
        }
      });

    response.send("Recording url inserted into db.")
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

  exports.q5_transcription = (request, response) => {

    //Check if q5 response object doesn't exist
    var patient_response_doc;
    request.app.db.collection('patient_responses').findOne(
      {
        phone_number: request.body.From,
        responses: 
        {
          $elemMatch: {
            question_id: "q5"
          }
        }
      },
      {
        projection: 
        {
          responses: 
          {$elemMatch:
          {
            question_id: "q5"
          }}
        }
      },
      function (err, result)
      {
       if (err) throw err;
       patient_response_doc = result.responses[0]; 
       console.log(patient_response_doc);
        if (patient_response_doc == null)
        {
          console.log("q5 response not found");
          // if it doesn't exists add one to the response set
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q5", null, request.body.TranscriptionText, request.body.TranscriptionUrl)}
            }
          );
        }
        else
        {
          //else update the existing response object for q5 question
          //Hacky make better
          console.log("q5 response found");
          //pop old object
          request.app.db.collection('patient_responses').updateOne(
            {
              phone_number: request.From
            },
            {
              $pull: 
              { responses: 
                { 
                  question_id: "q5"
                }
              }
            }
          );

          //insert updated object
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q5", patient_response_doc.recording_url, request.body.TranscriptionText, request.body.TranscriptionUrl)}}
          );
        }
      });

    response.send("Transcription inserted into db.")
  }

  exports.q5_recording = (request, response) => {

    //Check if q5 response object doesn't exist
    var patient_response_doc;
    request.app.db.collection('patient_responses').findOne(
      {
        phone_number: request.body.From,
        responses: 
        {
          $elemMatch: {
            question_id: "q5"
          }
        }
      },
      {
        projection: 
        {
          responses: 
          {$elemMatch:
          {
            question_id: "q5"
          }}
        }
      },
      function (err, result)
      {
       if (err) throw err;
       patient_response_doc = result.responses[0]; 
       console.log(patient_response_doc);
        if (patient_response_doc == null)
        {
          console.log("q5 response not found");
          // if it doesn't exists add one to the response set
          //insert updated object
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q5", request.body.RecordingUrl, null, null)}}
          );
        }
        else
        {
          //else update the existing response object for q5 question
          //Hacky make better
          console.log("q5 response found");
          //pop old object
          request.app.db.collection('patient_responses').updateOne(
            {
              phone_number: request.From
            },
            {
              $pull: 
              { responses: 
                { 
                  question_id: "q5"
                }
              }
            }
          );

          //insert updated object
          request.app.db.collection('patient_responses').updateOne(
            {phone_number: request.From},
            {$addToSet: 
              {responses: new Models.VoiceResponseObject("q5", request.body.RecordingUrl, patient_response_doc.transcription_text, patient_response_doc.transcription_url)}}
          );
        }
      });

    response.send("Recording url inserted into db.")
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
