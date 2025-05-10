const Role = require('../models/roleModel');
const User = require('../models/User');

// Create a New Role
exports.createRole = async (req, res) => {
    try
    {
        const { name } = req.body;
        if (!["admin", "moderator", "user"].includes(name.toLowerCase()))
        {
            return res.status(400).json({ error: "Invalid role name" });
        }

        const newRole = new Role({ name: name.toLowerCase() });
        await newRole.save();
        res.status(201).json({ message: "Role created successfully", role: newRole });
    }
    catch (error)
    {
        console.error("Error creating role:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get All Roles
exports.getAllRoles = async (req, res) => {
    try
    {
        const roles = await Role.find();
        res.status(200).json(roles);
    }
    catch (error)
    {
        console.error("Error fetching roles:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get Role by ID
exports.getRoleById = async (req, res) => {
    try
    {
        const role = await Role.findById(req.params.id);
        if (!role)
        {
            return res.status(404).json({ error: "Role not found" });
        }
        res.status(200).json(role);
    }
    catch (error)
    {
        console.error("Error fetching role:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update Role
exports.updateRole = async (req, res) => {
    try
    {
        const { name } = req.body;
        const updatedRole = await Role.findByIdAndUpdate(req.params.id, { name: name.toLowerCase() }, { new: true });
        if (!updatedRole)
        {
            return res.status(404).json({ error: "Role not found" });
        }
        res.status(200).json({ message: "Role updated successfully", role: updatedRole });
    }
    catch (error)
    {
        console.error("Error updating role:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete Role
exports.deleteRole = async (req, res) => {
    try
    {
        const deletedRole = await Role.findByIdAndDelete(req.params.id);
        if (!deletedRole)
        {
            return res.status(404).json({ error: "Role not found" });
        }
        res.status(200).json({ message: "Role deleted successfully" });
    }
    catch (error)
    {
        console.error("Error deleting role:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};