import { KeystoneContext } from "@keystone-6/core/types";
import { NextFunction, Request, Response } from "express";

import { EmailClient } from "../../clients/EmailClient";
import { TranslationRepository } from "../../repositories/TranslationRepository";

export function sendEmail(commonContext: KeystoneContext) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const context = (await commonContext.withRequest(req, res)).sudo();
      
      const translationRepository = new TranslationRepository(context);

      const formData = req.body;

      const client = new EmailClient(translationRepository);

      const email = await client.buildContactEmail('Petición de información', formData);

      await client.sendEmail(email);

      res.status(200).send();
    } catch (error) {
      next(error);
    }
  };
}