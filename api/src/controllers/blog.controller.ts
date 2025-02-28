import { Request, Response, RequestHandler } from 'express';
import { Blog } from '../models/Blog';
import { logger } from '../services/logger.service';

export const createBlogPost: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, content, tags, author, image } = req.body;

        if (!title || !description || !content || !tags || !author) {
            res.status(400).json({ message: 'Title, description, content, tags, and author are required' });
            return;
        }

        const newBlogPost = new Blog({
            title,
            description,
            content,
            tags,
            author,
            image,
        });

        await newBlogPost.save();
        logger.info('Blog post created successfully', { title, author });
        res.status(201).json({ message: 'Blog post created successfully', blogPost: newBlogPost });
    } catch (error: any) {
        logger.error('Error creating blog post', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllBlogPosts: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const blogPosts = await Blog.find();
        logger.info('Fetched all blog posts', { count: blogPosts.length });
        res.status(200).json(blogPosts);
    } catch (error: any) {
        logger.error('Error fetching blog posts', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getBlogPostById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { blogId } = req.params;

    try {
        const blogPost = await Blog.findById(blogId);
        if (!blogPost) {
            logger.warn('Blog post not found', { blogId });
            res.status(404).json({ message: 'Blog post not found' });
            return;
        }

        logger.info('Fetched blog post by ID', { blogId, title: blogPost.title });
        res.status(200).json(blogPost);
    } catch (error: any) {
        logger.error('Error fetching blog post by ID', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateBlogPost: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { blogId } = req.params;
    const { title, description, content, tags, author, image } = req.body;

    try {
        const blogPost = await Blog.findById(blogId);
        if (!blogPost) {
            logger.warn('Blog post not found for update', { blogId });
            res.status(404).json({ message: 'Blog post not found' });
            return;
        }

        if (title) blogPost.title = title;
        if (description) blogPost.description = description;
        if (content) blogPost.content = content;
        if (tags) blogPost.tags = tags;
        if (author) blogPost.author = author;
        if (image) blogPost.image = image;

        await blogPost.save();
        logger.info('Blog post updated successfully', { blogId, title });
        res.status(200).json({ message: 'Blog post updated successfully', blogPost });
    } catch (error: any) {
        logger.error('Error updating blog post', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteBlogPost: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { blogId } = req.params;

    try {
        const blogPost = await Blog.findById(blogId);
        if (!blogPost) {
            logger.warn('Blog post not found for deletion', { blogId });
            res.status(404).json({ message: 'Blog post not found' });
            return;
        }

        await blogPost.deleteOne();
        logger.info('Blog post deleted successfully', { blogId });
        res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error: any) {
        logger.error('Error deleting blog post', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};
