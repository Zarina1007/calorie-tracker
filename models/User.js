const mongoose = require('mongoose');

// Function to add ordinal suffix
function getOrdinalSuffix(day) {
    const j = day % 10,
        k = day % 100;
    if (j == 1 && k != 11) {
        return 'st';
    }
    if (j == 2 && k != 12) {
        return 'nd';
    }
    if (j == 3 && k != 13) {
        return 'rd';
    }
    return 'th';
}

const userSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    birthday: { type: Date, required: true },
});

// Custom toJSON method to format the birthday
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    if (obj.birthday) {
        const date = new Date(obj.birthday);

        // Using Intl.DateTimeFormat for month and year
        const options = { month: 'long', year: 'numeric' };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const parts = formatter.formatToParts(date).reduce((acc, part) => {
            acc[part.type] = part.value;
            return acc;
        }, {});
        
        const day = date.getDate();
        const month = parts.month;
        const year = parts.year;

        obj.birthday = `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
    }
    return obj;
};

module.exports = mongoose.model('User', userSchema);
