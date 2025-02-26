import { Request, Response, RequestHandler } from 'express';
import { Blog } from '../models/Blog';

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
        res.status(201).json({ message: 'Blog post created successfully', blogPost: newBlogPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllBlogPosts: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const blogPosts = await Blog.find();
        res.status(200).json(blogPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getBlogPostById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { blogId } = req.params;

    try {
        const blogPost = await Blog.findById(blogId);
        if (!blogPost) {
            res.status(404).json({ message: 'Blog post not found' });
            return;
        }

        res.status(200).json(blogPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateBlogPost: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { blogId } = req.params;
    const { title, description, content, tags, author, image } = req.body;

    try {
        const blogPost = await Blog.findById(blogId);
        if (!blogPost) {
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
        res.status(200).json({ message: 'Blog post updated successfully', blogPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteBlogPost: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { blogId } = req.params;

    try {
        const blogPost = await Blog.findById(blogId);
        if (!blogPost) {
            res.status(404).json({ message: 'Blog post not found' });
            return;
        }

        await blogPost.deleteOne();
        res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
