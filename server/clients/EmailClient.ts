import Handlebars from "handlebars";
import { Transporter, createTransport } from "nodemailer";
import { join, resolve } from "path";
import { readFileSync } from "fs";

import { ContactEmailData, ContactFormData, Email } from "../types/email";
import { Translation } from "../types/translation";
import { TranslationRepository } from "../repositories/TranslationRepository";

export class EmailClient {
  private transporter: Transporter;
  private contactTemplate: HandlebarsTemplateDelegate<ContactEmailData>;

  constructor(private readonly translationRepository: TranslationRepository) {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    const template = readFileSync(resolve(join(__dirname, '../views/emails', 'ContactRequest.hbs')), "utf-8");

    this.contactTemplate = Handlebars.compile<ContactEmailData>(template);
  }

  public async sendEmail(email: Email): Promise<boolean> {
    const res = await this.transporter.sendMail({
      from: email.from,
      to: email.to,
      subject: email.subject,
      html: email.body
    });

    console.log(res);

    return true;
  }

  public async buildContactEmail(subject: string, data: ContactFormData): Promise<Email> {
    const translations = await this.translationRepository.getTranslations('es');

    const emailData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => 
        [
          key,
          {
            key: (((translations.contact as Translation).form as Translation).input as Translation)[key],
            value: value || '-'
          }
        ]
      )
    ) as ContactEmailData;
    
    return {
      from: data.email,
      to: process.env.CONTACT_EMAIL!,
      subject: subject,
      body: this.contactTemplate({
        ...emailData,
      })
    }

  }
}