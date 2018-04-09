'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './reservetable.events';

var ReservetableSchema = new mongoose.Schema({
  name: String,
  person: Number,
  email: String,
  time : { type : Date, default: Date.now },
  user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
},
{
  timestamps: true
});

registerEvents(ReservetableSchema);
export default mongoose.model('Reservetable', ReservetableSchema);
