//Constructor for Patient Response
class PatientResponse{
    constructor(time, phone_number, medium){
        this.time = time;
        this.phone_number = phone_number;
        this.medium = medium;
    }
}

class VoiceResponseObject{
    constructor(question_id, recording_url, transcription_text, transcription_url)
    {
        this.question_id = question_id; //which question is this the response to
        this.recording_url = recording_url;
        this.transcription_text = transcription_text;
        this.transcript_url = transcription_url;
    }
}

exports.PatientResponse = PatientResponse;
exports.VoiceResponseObject = VoiceResponseObject;
