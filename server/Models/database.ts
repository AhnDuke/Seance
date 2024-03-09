// import {Schema, model, connect } from 'mongoose';
// // const Schema = mongoose.Schema;

// const MONGO_URI = 'mongodb+srv://kimchi162:Brhhmw7zr2@seance.8ugcobe.mongodb.net/';

// // async function userSession() {

// // }
// await connect(MONGO_URI)
//   .then(() => console.log('Connected to Mongo DB.'))
//   .catch(err => console.log(err));

// const loginInfoSchema = new Schema({
//   userId: {type: String, required: true, unique: true},
//   roomStatus: {type: Boolean, required: true, default: false},
//   socketStatus: {type:Boolean, required: true, default: false}
// })

// const sessionInfo = model('login', loginInfoSchema);

// export default sessionInfo;
