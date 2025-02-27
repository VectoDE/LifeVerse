import { Request, Response, RequestHandler } from 'express';
import { Role } from '../models/Role';
import { User } from '../models/User';

export const createRole: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, permissions } = req.body;

        if (!name || !permissions || !Array.isArray(permissions)) {
            res.status(400).json({ message: 'Name and permissions are required' });
            return;
        }

        const roleExists = await Role.findOne({ name });
        if (roleExists) {
            res.status(400).json({ message: 'Role already exists' });
            return;
        }

        const newRole = new Role({ name, permissions });
        await newRole.save();

        res.status(201).json({ message: 'Role created successfully', role: newRole });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllRoles: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getRoleById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { roleId } = req.params;

    try {
        const role = await Role.findById(roleId);
        if (!role) {
            res.status(404).json({ message: 'Role not found' });
            return;
        }

        const usersWithRole = await User.find({ role: roleId });

        res.status(200).json({ role, users: usersWithRole });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateRole: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { roleId } = req.params;
    const { name, permissions } = req.body;

    if (!name || !permissions || !Array.isArray(permissions)) {
        res.status(400).json({ message: 'Name and permissions are required' });
        return;
    }

    try {
        const updatedRole = await Role.findByIdAndUpdate(
            roleId,
            { name, permissions },
            { new: true }
        );

        if (!updatedRole) {
            res.status(404).json({ message: 'Role not found' });
            return;
        }

        res.status(200).json({ message: 'Role updated successfully', role: updatedRole });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteRole: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { roleId } = req.params;

    try {
        const deletedRole = await Role.findByIdAndDelete(roleId);
        if (!deletedRole) {
            res.status(404).json({ message: 'Role not found' });
            return;
        }

        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
