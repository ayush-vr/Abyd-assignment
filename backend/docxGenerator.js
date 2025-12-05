const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require("docx");
const fs = require("fs");
const path = require("path");

async function createContractDocx(text, filename) {
    // Splitting    
    const lines = text.split('\n');
    
    const children = [];

    // Title
    children.push(
        new Paragraph({
            text: "Legal Contract",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
        })
    );

    // Content
    lines.forEach(line => {
        if (line.trim()) {
            children.push(
                new Paragraph({
                    children: [new TextRun(line.trim())],
                    spacing: { after: 200 }
                })
            );
        }
    });

    const doc = new Document({
        sections: [{
            properties: {},
            children: children,
        }],
    });

    // output dir
    const outputDir = path.join(__dirname, "generated_docs");
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const filePath = path.join(outputDir, filename);
    
    // Generate buffer and write to file
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(filePath, buffer);

    return filePath;
}

module.exports = { createContractDocx };
