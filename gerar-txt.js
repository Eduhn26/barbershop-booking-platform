const fs = require('fs');
const path = require('path');

// Nome do arquivo de saída
const OUTPUT_FILE = 'projeto-completo.txt';

// Pastas para IGNORAR (Economiza espaço e foca no código)
const IGNORE_DIRS = [
    'node_modules',
    '.git',
    'dist',
    'coverage',
    '.idea',
    '.vscode',
    'build',
    '.next' // Caso use no futuro
];

// Arquivos específicos para IGNORAR (Geralmente arquivos de lock gigantes)
const IGNORE_FILES = [
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    '.DS_Store',
    OUTPUT_FILE,     // Não ler o próprio arquivo de saída
    'gerar-txt.js'   // Não ler este script
];

// Extensões permitidas (Abrange todo o ecossistema Nest/Prisma/DB)
const ALLOWED_EXTS = [
    '.ts', '.tsx',             // TypeScript
    '.js', '.jsx', '.cjs', '.mjs', // JavaScript e variações (CommonJS/Modules)
    '.json',                   // Configurações
    '.prisma',                 // Schemas do Prisma
    '.sql',                    // Migrations e Scripts SQL
    '.md',                     // Documentação
    '.yaml', '.yml',           // Docker e Configurações CI/CD
    '.css', '.scss',           // Estilos (se houver frontend junto)
    '.html'                    // Templates (se houver)
];

// Arquivos específicos importantes (Dotfiles e sem extensão)
const ALLOWED_SPECIFIC_FILES = [
    '.env.example',
    '.gitignore',
    '.dockerignore',
    '.eslintrc',
    '.prettierrc',
    '.editorconfig',
    'Dockerfile',
    'Makefile'
];

let outputContent = '';

function isAllowed(fileName) {
    // Verifica se é um arquivo ignorado
    if (IGNORE_FILES.includes(fileName)) return false;

    const ext = path.extname(fileName).toLowerCase();

    // Aceita se tiver a extensão permitida
    if (ALLOWED_EXTS.includes(ext)) return true;

    // Aceita se for um nome de arquivo específico (ex: .env.example)
    if (ALLOWED_SPECIFIC_FILES.includes(fileName)) return true;

    return false;
}

function scanDirectory(dir, rootDir) {
    const files = fs.readdirSync(dir);

    files.sort(); // Ordena alfabeticamente para facilitar leitura

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        // Caminho relativo para ficar limpo no arquivo (ex: src/main.ts)
        const relativePath = path.relative(rootDir, fullPath); 

        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                scanDirectory(fullPath, rootDir);
            }
        } else {
            if (isAllowed(file)) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    
                    // FORMATAÇÃO CLARA PARA LEITURA
                    outputContent += `\n`;
                    outputContent += `################################################################################\n`;
                    outputContent += `🔴 CAMINHO: ${relativePath}\n`;
                    outputContent += `################################################################################\n`;
                    outputContent += `${content}\n`;
                    
                } catch (err) {
                    console.error(`Erro ao ler ${relativePath}: ${err.message}`);
                }
            }
        }
    });
}

console.log('🔄 Iniciando varredura do projeto...');
scanDirectory(__dirname, __dirname);
fs.writeFileSync(OUTPUT_FILE, outputContent);
console.log(`✅ Sucesso! Arquivo "${OUTPUT_FILE}" gerado.`);
console.log(`📂 Envie este arquivo para o chat.`);