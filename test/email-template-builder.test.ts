import { EmailTemplateBuilder } from '../server';

describe('EmailTemplateBuilder', () => {
    it('builds a simple email HTML with header and paragraph', () => {
        const builder = new EmailTemplateBuilder({ appConfig: { title: 'Test Email' } })
            .addBlock('h', 'Welcome!')
            .addBlock('p', 'Hello user!');
        const html = builder.buildHTML();
        expect(html).toContain('<h1');
        expect(html).toContain('Welcome!');
        expect(html).toContain('<p');
        expect(html).toContain('Hello user!');
        expect(html).toContain('Test Email');
    });

    it('throws an error for invalid block type', () => {
        const builder = new EmailTemplateBuilder();
        expect(() => builder.addBlock('invalid', 'text')).toThrow('Invalid block type: invalid');
    });

    it('supports custom footer', () => {
        const builder = new EmailTemplateBuilder({ appConfig: { title: 'Footer Test' } })
            .addBlock('p', 'Body')
            .setFooter('Custom Footer!');
        const html = builder.buildHTML();
        expect(html).toContain('Custom Footer!');
    });

    it('sanitizes HTML in block arguments', () => {
        const builder = new EmailTemplateBuilder({ appConfig: { title: 'Sanitize Test' } })
            .addBlock('p', '<script>alert("x")</script>');
        const html = builder.buildHTML();
        expect(html).not.toContain('<script>');
        expect(html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
    });
});
