const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    role_id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, unique: true, enum: ["admin", "moderator", "user"] }
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema);