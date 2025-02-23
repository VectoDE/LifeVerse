# Database Design for LifeVerse Game

## Introduction

This document outlines the database design for the LifeVerse game. The database will store all relevant game data, including user profiles, game states, inventory items, player progress, and social interactions. The design focuses on scalability, data consistency, and ease of access to game data. MongoDB will be used as the database for its flexible schema and ability to scale horizontally.

## Table of Contents

- [Database Design for LifeVerse Game](#database-design-for-lifeverse-game)
  - [Introduction](#introduction)
  - [Table of Contents](#table-of-contents)
  - [1. Technology Stack](#1-technology-stack)
  - [2. Database Structure](#2-database-structure)
  - [3. Collections Overview](#3-collections-overview)
  - [4. Schema Design](#4-schema-design)
    - [Users Collection Schema](#users-collection-schema)
    - [Games Collection Schema](#games-collection-schema)
    - [Inventory Collection Schema](#inventory-collection-schema)
    - [Achievements Collection Schema](#achievements-collection-schema)
    - [Messages Collection Schema](#messages-collection-schema)
  - [5. Data Relationships](#5-data-relationships)
  - [6. Indexes](#6-indexes)
  - [7. Backup and Recovery](#7-backup-and-recovery)
  - [8. Data Validation](#8-data-validation)
  - [Conclusion](#conclusion)

## 1. Technology Stack

The database for LifeVerse will be powered by **MongoDB**, a NoSQL database that is ideal for handling large volumes of unstructured and semi-structured data. MongoDB allows for horizontal scaling and flexible schema design, making it an ideal choice for the game's needs. The database will be hosted on a cloud provider like **AWS** or **Azure**.

## 2. Database Structure

The database structure is designed to hold multiple collections, each representing a different aspect of the game. Collections are designed for different entities such as users, games, items, achievements, and events. Each collection contains documents that hold data about individual entities.

## 3. Collections Overview

Here is a list of the main collections that will be present in the LifeVerse database:

1. **Users**: Stores information about each user, including authentication details, personal settings, and in-game data.
2. **Games**: Holds data about each game session, such as the game state, players, and ongoing events.
3. **Inventory**: Stores player inventory items, such as weapons, resources, and collectibles.
4. **Achievements**: Tracks player achievements, milestones, and unlocked rewards.
5. **Messages**: Stores chat messages, notifications, and player interactions.
6. **Events**: Stores information about in-game events, triggers, and associated actions.
7. **NPCs**: Stores data about Non-Playable Characters, their states, behaviors, and interactions with players.

## 4. Schema Design

Each collection will have a well-defined schema that defines the structure of the data. Below are some example schemas for key collections.

### Users Collection Schema

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  profilePicture: { type: String }, // URL to profile picture
  achievements: [{ type: Schema.Types.ObjectId, ref: 'Achievement' }],
  inventory: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
  gameState: { type: Schema.Types.ObjectId, ref: 'Game' },
  lastLogin: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
```

### Games Collection Schema

```javascript
const gameSchema = new Schema({
  gameId: { type: String, required: true, unique: true },
  players: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  gameState: { type: String, required: true }, // e.g., 'active', 'paused', 'completed'
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
});

module.exports = mongoose.model('Game', gameSchema);
```

### Inventory Collection Schema

```javascript
const itemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['weapon', 'resource', 'tool', 'collectible'], required: true },
  value: { type: Number, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who owns the item
  isEquipped: { type: Boolean, default: false },
});

module.exports = mongoose.model('Item', itemSchema);
```

### Achievements Collection Schema

```javascript
const achievementSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  points: { type: Number, default: 0 },
  dateUnlocked: { type: Date },
  players: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Players who have unlocked this achievement
});

module.exports = mongoose.model('Achievement', achievementSchema);
```

### Messages Collection Schema

```javascript
const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  recipient: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});

module.exports = mongoose.model('Message', messageSchema);
```

## 5. Data Relationships

Data relationships between collections will be established using MongoDB ObjectId references. Here are some examples:
Users ↔ Inventory: A one-to-many relationship where one user can own multiple inventory items.
Games ↔ Users: A many-to-many relationship where multiple users can participate in a single game session.
Achievements ↔ Users: A many-to-many relationship where a user can unlock multiple achievements.

By using references and population in MongoDB, it is easy to join related data across collections.

## 6. Indexes

Indexes will be used to speed up data retrieval for commonly accessed fields. The following indexes will be created:

- Users:
  - Index on username for fast lookups during login or profile searches.
  - Index on email for secure login and user registration.
- Games:
  - Index on gameId for fast lookup of specific game sessions.
  - Index on players to quickly retrieve all games a player is involved in.
- Items:
  - Index on owner for quickly retrieving all items owned by a user.
- Messages:
  - Index on recipient to quickly retrieve messages for a user.
  - Index on timestamp for sorting messages by time.

## 7. Backup and Recovery

The database will be backed up regularly to ensure data durability and recovery in case of failures. Backups will be scheduled on a daily basis, with the ability to restore individual collections if needed.

Backup strategies include:

- MongoDB Atlas Backup: Automated cloud backups for high availability.
- Periodic Manual Backups: Snapshot backups at key milestones or after major updates.

## 8. Data Validation

To ensure data consistency and integrity, Mongoose validation will be used. Each field in the schema will have validation rules, including required fields, data types, and custom validation functions. For example, the email field will use a regular expression to validate the format of the email address.

Example of Mongoose Validation for Email:

```json
email: {
  type: String,
  required: true,
  unique: true,
  match: [/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, 'Please fill a valid email address'],
}
```

## Conclusion

The database design for LifeVerse is built to support large-scale game data, user profiles, and multiplayer features. MongoDB’s flexible schema allows for rapid iteration and scaling, ensuring the database can handle the evolving needs of the game. Through well-structured schemas, data relationships, and indexing, the design ensures efficient and consistent access to critical game data.
