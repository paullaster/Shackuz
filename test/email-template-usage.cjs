//Example usage of EmailTemplateBuilder from @bs/Shackuz

import { EmailTemplateBuilder } from "../server";

// Create a new email template builder instance
const email = new EmailTemplateBuilder({ appConfig: { title: 'Test this tool' } })
    .addBlock('h', "Welcome to Shackuz!")
    .addBlock('p', "Hello {{name}},\n\nThank you for joining us.")
    .addBlock('d')
    .addBlock('p', 'Regargs')
    .addBlock("p", "Shackuz")
    .buildHTML()

console.log(email);

