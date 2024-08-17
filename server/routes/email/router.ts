import { KeystoneContext } from "@keystone-6/core/types";
import { Router } from "express";

import { sendEmail } from ".";

const router = Router();

export default function emailRouter(context: KeystoneContext) {
  router.post('/', sendEmail(context));

  return router;
}