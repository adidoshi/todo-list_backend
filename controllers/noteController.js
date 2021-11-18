const Note = require("../models/NoteModel");
const asyncHandler = require("express-async-handler");

// GET request - /api/notes
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id });
  res.json(notes);
});

// POST request - /api/notes/create
const createNote = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    res.status(400);
    throw new Error("Please fill all the fields ");
  } else {
    const note = new Note({
      user: req.user._id,
      title,
      content,
      category,
    });

    const createdNote = await note.save();

    res.status(201).json(createdNote);
  }
});

// GET request - /api/notes/:id
const getSingleNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note) {
    res.json(note);
  } else {
    res.status(400).json({ message: "Note not found" });
  }
});

// PUT request - /api/notes/:id
const updateNote = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  const note = await Note.findById(req.params.id);

  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You can't perform this action");
  }

  if (note) {
    note.title = title;
    note.content = content;
    note.category = category;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(404);
    throw new Error("Note not found");
  }
});

// DELETE request - /api/notes/:id
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You can't perform this action");
  }

  if (note) {
    await note.remove();
    res.json({ message: "Note Removed" });
  } else {
    res.status(404);
    throw new Error("Note not Found");
  }
});

module.exports = {
  getNotes,
  createNote,
  getSingleNote,
  updateNote,
  deleteNote,
};
