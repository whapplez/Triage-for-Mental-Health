const express = require('express');
const router = express.Router();
const VoiceController = require('./controller.js')

//Initial voice call endpoints
router.post('/initial', VoiceController.initial);
/* router.post('/initial/transcription', VoiceController.initial_transcription);
router.post('/initial/recording', VoiceController.initial_recording);

//Question 1 voice call endpoints
router.post('/q1', VoiceController.q1);
router.post('/q1/transcription', VoiceController.q1_transcription);
router.post('/q1/recording', VoiceController.q1_recording);

//Question 2 voice call endpoints
router.post('/q2', VoiceController.q2);
router.post('/q2/transcription', VoiceController.q2_transcription);
router.post('/q2/recording', VoiceController.q2_recording);

//Question 3 voice call endpoints
router.post('/q3', VoiceController.q3);
router.post('/q3/transcription', VoiceController.q3_transcription);
router.post('/q3/recording', VoiceController.q3_recording);

//Question 4 voice call endpoints
router.post('/q4', VoiceController.q4);
router.post('/q4/transcription', VoiceController.q4_transcription);
router.post('/q4/recording', VoiceController.q4_recording);

//Question 5 voice call endpoints
router.post('/q5', VoiceController.q5);
router.post('/q5/transcription', VoiceController.q5_transcription);
router.post('/q5/recording', VoiceController.q5_recording); */

module.exports = router;