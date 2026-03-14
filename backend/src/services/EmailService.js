import { Resend } from "resend";
import Handlebars from "handlebars";

class EmailService {
  constructor() {
    this.resend = null;
    this.from = process.env.EMAIL_FROM;
  }

  #getClient() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY não configurada");
    }
    if (!this.resend) {
      this.resend = new Resend(process.env.RESEND_API_KEY);
    }
    return this.resend;
  }

  async sendTemplate({ to, subject, template, data = {} }) {
    if (!this.from) {
      throw new Error("EMAIL_FROM não configurado");
    }
    if (!to) {
      throw new Error("Destino do e-mail não informado");
    }
    if (!subject) {
      throw new Error("Assunto do e-mail não informado");
    }
    if (!template) {
      throw new Error("Template do e-mail não informado");
    }

    const compile = Handlebars.compile(template, { noEscape: true });
    const html = compile(data);

    const client = this.#getClient();

    const result = await client.emails.send({
      from: this.from,
      to,
      subject,
      html,
    });

    console.log(result)

    return result;
  }
}

export default new EmailService();
