import { isMissingKeys, parseForResponse } from '../../utilities';

import { prisma } from "../../database";
import { Errors } from "../../errors";
import type { Request, Response } from 'express';

export async function createClassController(req: Request, res: Response) {
    try {
        if (isMissingKeys(req.body, ['name'])) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }

        const { name } = req.body;

        const cls = await prisma.class.create({
            data: {
                name
            }
        });

        res.status(201).json({ error: undefined, data: parseForResponse(cls), success: true });
    } catch (error) {
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
}