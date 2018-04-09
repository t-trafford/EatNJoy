/**
 * Card model events
 */

'use strict';

import {EventEmitter} from 'events';
var CardEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CardEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Card) {
  for(var e in events) {
    let event = events[e];
    Card.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    CardEvents.emit(event + ':' + doc._id, doc);
    CardEvents.emit(event, doc);
  };
}

export {registerEvents};
export default CardEvents;
