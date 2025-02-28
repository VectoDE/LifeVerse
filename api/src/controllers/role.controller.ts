import { Request, Response, RequestHandler } from 'express';
import { Role } from '../models/Role';
import { User } from '../models/User';
import { logger } from '../services/logger.service';

export const createRole: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { name, permissions } = req.body;

    if (!name || !permissions || !Array.isArray(permissions)) {
        logger.warn('Missing name or permissions', { name, permissions });
        res.status(400).json({ message: 'Name and permissions are required' });
        return;
    }

    try {
        logger.info('Checking if role already exists', { name });
        const roleExists = await Role.findOne({ name });
        if (roleExists) {
            logger.warn('Role already exists', { name });
            res.status(400).json({ message: 'Role already exists' });
            return;
        }

        const newRole = new Role({ name, permissions });
        await newRole.save();

        logger.info('Role created successfully', { name, permissions });
        res.status(201).json({ message: 'Role created successfully', role: newRole });
    } catch (error: any) {
        logger.error('Error creating role', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllRoles: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        logger.info('Fetching all roles');
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error: any) {
        logger.error('Error fetching all roles', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getRoleById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { roleId } = req.params;

    try {
        logger.info('Fetching role by ID', { roleId });
        const role = await Role.findById(roleId);
        if (!role) {
            logger.warn('Role not found', { roleId });
            res.status(404).json({ message: 'Role not found' });
            return;
        }

        const usersWithRole = await User.find({ role: roleId });
        logger.info('Role fetched successfully', { roleId, role });

        res.status(200).json({ role, users: usersWithRole });
    } catch (error: any) {
        logger.error('Error fetching role by ID', { roleId, error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateRole: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { roleId } = req.params;
    const { name, permissions } = req.body;

    if (!name || !permissions || !Array.isArray(permissions)) {
        logger.warn('Missing name or permissions for update', { name, permissions });
        res.status(400).json({ message: 'Name and permissions are required' });
        return;
    }

    try {
        logger.info('Updating role', { roleId, name, permissions });
        const updatedRole = await Role.findByIdAndUpdate(
            roleId,
            { name, permissions },
            { new: true }
        );

        if (!updatedRole) {
            logger.warn('Role not found for update', { roleId });
            res.status(404).json({ message: 'Role not found' });
            return;
        }

        logger.info('Role updated successfully', { roleId, updatedRole });
        res.status(200).json({ message: 'Role updated successfully', role: updatedRole });
    } catch (error: any) {
        logger.error('Error updating role', { roleId, error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteRole: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { roleId } = req.params;

    try {
        logger.info('Deleting role', { roleId });
        const deletedRole = await Role.findByIdAndDelete(roleId);
        if (!deletedRole) {
            logger.warn('Role not found for deletion', { roleId });
            res.status(404).json({ message: 'Role not found' });
            return;
        }

        logger.info('Role deleted successfully', { roleId });
        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error: any) {
        logger.error('Error deleting role', { roleId, error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};
