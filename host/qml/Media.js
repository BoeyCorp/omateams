.pragma library

// Tells the host whether the page is in a call.
//
// Teams piles up state over a long session, and the host reloads a hidden
// page once it has grown too big (see Main.qml). A call keeps running with
// the window hidden, and a reload would drop it. The page is asked first: a
// microphone, camera or screen track that is still live means a call or a
// meeting is going on, whether or not anyone is speaking.

function pageScript() {
  return "(function () {\n"
    + "  if (window.__omateamsInCall || !navigator.mediaDevices) return;\n"
    + "  var tracks = [];\n"
    + "  function track(stream) {\n"
    + "    if (stream && stream.getTracks) tracks = tracks.concat(stream.getTracks());\n"
    + "    return stream;\n"
    + "  }\n"
    + "  ['getUserMedia', 'getDisplayMedia'].forEach(function (name) {\n"
    + "    var original = navigator.mediaDevices[name];\n"
    + "    if (typeof original !== 'function') return;\n"
    + "    navigator.mediaDevices[name] = function () {\n"
    + "      return original.apply(navigator.mediaDevices, arguments).then(track);\n"
    + "    };\n"
    + "  });\n"
    + "  window.__omateamsInCall = function () {\n"
    + "    tracks = tracks.filter(function (t) { return t.readyState === 'live'; });\n"
    + "    return tracks.length > 0;\n"
    + "  };\n"
    + "})();\n"
}
