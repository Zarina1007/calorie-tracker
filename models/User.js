const mongoose = require('mongoose');
const AutoIncrementFactory = require('mongoose-sequence')(mongoose);
const { DateTime } = require('luxon');

const userSchema = new mongoose.Schema({
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

// Apply the auto-increment plugin to userSchema
userSchema.plugin(AutoIncrementFactory, { inc_field: 'id' });

module.exports = mongoose.model('User', userSchema);
