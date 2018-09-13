var noteContent = ""
try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
  recognition.continuous = true
}
catch(e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}

recognition.onstart = function() {
  console.log('START');
}

recognition.onspeechend = function() {
  console.log('END');

}

recognition.onerror = function(event) {
  console.log('ERROR : ', event.error);
}

recognition.onresult = function(event) {

  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far.
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;

  // Add the current transcript to the contents of our Note.
  noteContent += transcript + ".";
  $("#textarea_coref").val(noteContent);

  analyze_story()

}

const toggle_asr = () => {
  if ($("#toggle_asr").prop("checked") == true) {
    noteContent = ""
    $("#textarea_coref").val(noteContent);
    recognition.start();
  } else {
    recognition.stop();
  }
}
