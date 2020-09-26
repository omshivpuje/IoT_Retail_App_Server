const mongoose = require('mongoose');

// Archive Schema
const ArchiveSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    itemPurchased: {
        type: Array,
        default: []
    }
});

const Archive = module.exports = mongoose.model('Archive', ArchiveSchema);

module.exports.getArchives = function(callback) {
    Archive.find(callback);
}
module.exports.getArchiveById = function(id, callback) {
    Archive.findById(id, callback);
}
// module.exports.getArchiveByEmail = function(email, callback) {
//     const query = {
//         email: email
//     };
//     Archive.findOne(query, callback);
// }
module.exports.addToArchive = function(newArchive, callback) {
    Archive.create(newArchive, callback);
}


module.exports.deleteArchive = (Archive, callback) => {
    const query = {
        email: Archive.email
    };
    Archive.findOne(query, (err, Archive) => {
        Archive.findByIdAndRemove(Archive._id, callback);
    });
}