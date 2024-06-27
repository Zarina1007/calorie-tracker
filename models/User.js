const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    birthday: { type: Date, required: true },
});

// Custom toJSON method to format the birthday
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    if (obj.birthday) {
        obj.birthday = DateTime.fromJSDate(obj.birthday).toFormat('MMMM dd, yyyy');
    }
    return obj;
};

module.exports = mongoose.model('User', userSchema);
