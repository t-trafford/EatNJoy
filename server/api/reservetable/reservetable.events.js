/**
 * Reservetable model events
 */

'use strict';

import {EventEmitter} from 'events';
var ReservetableEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ReservetableEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Reservetable) {
  for(var e in events) {
    let event = events[e];
    Reservetable.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    ReservetableEvents.emit(event + ':' + doc._id, doc);
    ReservetableEvents.emit(event, doc);
  };
}

export {registerEvents};
export default ReservetableEvents;
