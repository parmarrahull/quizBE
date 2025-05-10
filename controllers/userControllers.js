const User = require('../models/User');
const mongoose = require('mongoose');


//Get All Users
exports.getAllUsers = async (req, res) => {
    try
    {
        const users = await User.aggregate([
            {
                $match: {}
            },
            {
                $lookup:
                {
                    from: "roles",
                    let: { roleId: "$role_id" },
                    pipeline: [
                        { 
                            $match:
                            { 
                                $expr: { $eq: ["$_id", { $toObjectId: "$$roleId" }] } 
                            } 
                        }
                    ],
                    as: "role"
                }
            },
            {
                $unwind:
                {
                    path: "$role",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project:
                {
                    _id: 1,
                    firstname: 1,
                    lastname: 1,
                    email: 1,
                    phone_number: 1,
                    gender: 1,
                    role: { $ifNull: ["$role.name", "No Role Assigned"] }
                }
            }
        ]);

        if (users.length === 0)
        {
            return res.status(404).json({ error: "No users found" });
        }

        res.status(200).json(users);
    }
    catch (error)
    {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

//Get User by ID
exports.getUserById = async (req, res) => {
    try
    {
        const userId = new mongoose.Types.ObjectId(req.params.id);

        const user = await User.aggregate([
            { 
                $match: { _id: userId } 
            },
            {
                $lookup:
                {
                    from: "roles",
                    let: { roleId: "$role_id" },
                    pipeline: [
                        { 
                            $match:
                            { 
                                $expr: { $eq: ["$_id", { $toObjectId: "$$roleId" }] } 
                            } 
                        }
                    ],
                    as: "role"
                }
            },
            {
                $unwind:
                {
                    path: "$role",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project:
                {
                    _id: 1,
                    firstname: 1,
                    lastname: 1,
                    email: 1,
                    phone_number: 1,
                    gender: 1,
                    role: { $ifNull: ["$role.name", "No Role Assigned"] }
                }
            }
        ]);

        if (!user.length)
        {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user[0]);
    }
    catch (error)
    {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

//Update User
exports.updateUser = async (req, res) => {
    try
    {
        const { firstname, lastname, phone_number, email, gender } = req.body;
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId))
        {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        let user = await User.findById(userId);
        if (!user)
        {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedData =
        {
            firstname: firstname || user.firstname,
            lastname: lastname || user.lastname,
            phone_number: phone_number || user.phone_number,
            email: email || user.email,
            gender: gender || user.gender,
        };

        user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        res.status(200).json({ message: "User updated successfully", user });
    }
    catch (error)
    {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

//Delete User
exports.deleteUser = async (req, res) => {
    try
    {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user)
        {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error)
    {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};