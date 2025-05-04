import { EmailTemplateBuilder } from "../server";

describe("EmailTemplateBuilder", () => {
    it("builds correct HTML output with all blocks", () => {
        const html = new EmailTemplateBuilder({ appConfig: { title: 'Test this tool' } })
            .addBlock('h', "Welcome to Shackuz!")
            .addBlock('p', "Hello {{name}},\n\nThank you for joining us.")
            .addBlock('d')
            .addBlock('p', 'Regards')
            .addBlock("p", "Shackuz")
            .buildHTML();

        [
            "Welcome to Shackuz!",
            "Hello {{name}},",
            "Thank you for joining us.",
            "Regards",
            "Shackuz"
        ].forEach(text => expect(html).toContain(text));
    });
});
