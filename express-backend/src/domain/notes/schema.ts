import { z } from "zod";

export const noteSchema = z.object({
  id: z.string().min(1),
  ownerId: z.string().min(1),
  title: z.string().trim().min(1).max(200),
  body: z.string(), // plain text for now; JSON doc later
  version: z.number().int().positive(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Note = z.infer<typeof noteSchema>;

export const createNoteSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().default(""),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  body: z.string().optional(),
  version: z.number().int().positive(),
});

export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
