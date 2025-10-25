import type { ScriptureData, Language } from './types';

const scripturesData: { [lang in Language]: ScriptureData } = {
    'pt-BR': {
        'bom': {
            name: 'O Livro de Mórmon',
            books: [
                { id: '1-ne', name: '1 Néfi', chapters: 22 },
                { id: '2-ne', name: '2 Néfi', chapters: 33 },
                { id: 'jacob', name: 'Jacó', chapters: 7 },
                { id: 'enos', name: 'Enos', chapters: 1 },
                { id: 'jarom', name: 'Jarom', chapters: 1 },
                { id: 'omni', name: 'Ômni', chapters: 1 },
                { id: 'wom', name: 'Palavras de Mórmon', chapters: 1 },
                { id: 'mosiah', name: 'Mosias', chapters: 29 },
                { id: 'alma', name: 'Alma', chapters: 63 },
                { id: 'helaman', name: 'Helamã', chapters: 16 },
                { id: '3-ne', name: '3 Néfi', chapters: 30 },
                { id: '4-ne', name: '4 Néfi', chapters: 1 },
                { id: 'mormon', name: 'Mórmon', chapters: 9 },
                { id: 'ether', name: 'Éter', chapters: 15 },
                { id: 'moroni', name: 'Morôni', chapters: 10 }
            ]
        },
        'dc': {
            name: 'Doutrina e Convênios',
            books: [
                { id: 'dc', name: 'Seções', chapters: 138 },
                { id: 'od', name: 'Declarações Oficiais', chapters: 2 }
            ]
        },
        'pgp': {
            name: 'Pérola de Grande Valor',
            books: [
                { id: 'moses', name: 'Moisés', chapters: 8 },
                { id: 'abraham', name: 'Abraão', chapters: 5 },
                { id: 'js-m', name: 'Joseph Smith—Mateus', chapters: 1 },
                { id: 'js-h', name: 'Joseph Smith—História', chapters: 1 },
                { id: 'aof', name: 'Regras de Fé', chapters: 1 }
            ]
        },
        'ot': {
            name: 'O Velho Testamento',
            books: [
                { id: 'gen', name: 'Gênesis', chapters: 50 }, { id: 'ex', name: 'Êxodo', chapters: 40 }, { id: 'lev', name: 'Levítico', chapters: 27 }, { id: 'num', name: 'Números', chapters: 36 }, { id: 'deut', name: 'Deuteronômio', chapters: 34 }, { id: 'josh', name: 'Josué', chapters: 24 }, { id: 'judg', name: 'Juízes', chapters: 21 }, { id: 'ruth', name: 'Rute', chapters: 4 }, { id: '1-sam', name: '1 Samuel', chapters: 31 }, { id: '2-sam', name: '2 Samuel', chapters: 24 }, { id: '1-kgs', name: '1 Reis', chapters: 22 }, { id: '2-kgs', name: '2 Reis', chapters: 25 }, { id: '1-chr', name: '1 Crônicas', chapters: 29 }, { id: '2-chr', name: '2 Crônicas', chapters: 36 }, { id: 'ezra', name: 'Esdras', chapters: 10 }, { id: 'neh', name: 'Neemias', chapters: 13 }, { id: 'esth', name: 'Ester', chapters: 10 }, { id: 'job', name: 'Jó', chapters: 42 }, { id: 'ps', name: 'Salmos', chapters: 150 }, { id: 'prov', name: 'Provérbios', chapters: 31 }, { id: 'eccl', name: 'Eclesiastes', chapters: 12 }, { id: 'song', name: 'Cantares de Salomão', chapters: 8 }, { id: 'isa', name: 'Isaías', chapters: 66 }, { id: 'jer', name: 'Jeremias', chapters: 52 }, { id: 'lam', name: 'Lamentações', chapters: 5 }, { id: 'ezek', name: 'Ezequiel', chapters: 48 }, { id: 'dan', name: 'Daniel', chapters: 12 }, { id: 'hosea', name: 'Oseias', chapters: 14 }, { id: 'joel', name: 'Joel', chapters: 3 }, { id: 'amos', name: 'Amós', chapters: 9 }, { id: 'obad', name: 'Obadias', chapters: 1 }, { id: 'jonah', name: 'Jonas', chapters: 4 }, { id: 'micah', name: 'Miqueias', chapters: 7 }, { id: 'nahum', name: 'Naum', chapters: 3 }, { id: 'hab', name: 'Habacuque', chapters: 3 }, { id: 'zeph', name: 'Sofonias', chapters: 3 }, { id: 'hag', name: 'Ageu', chapters: 2 }, { id: 'zech', name: 'Zacarias', chapters: 14 }, { id: 'mal', name: 'Malaquias', chapters: 4 }
            ]
        },
        'nt': {
            name: 'O Novo Testamento',
            books: [
                { id: 'matt', name: 'Mateus', chapters: 28 }, { id: 'mark', name: 'Marcos', chapters: 16 }, { id: 'luke', name: 'Lucas', chapters: 24 }, { id: 'john', name: 'João', chapters: 21 }, { id: 'acts', name: 'Atos', chapters: 28 }, { id: 'rom', name: 'Romanos', chapters: 16 }, { id: '1-cor', name: '1 Coríntios', chapters: 16 }, { id: '2-cor', name: '2 Coríntios', chapters: 13 }, { id: 'gal', name: 'Gálatas', chapters: 6 }, { id: 'eph', name: 'Efésios', chapters: 6 }, { id: 'philip', name: 'Filipenses', chapters: 4 }, { id: 'col', name: 'Colossenses', chapters: 4 }, { id: '1-thes', name: '1 Tessalonicenses', chapters: 5 }, { id: '2-thes', name: '2 Tessalonicenses', chapters: 3 }, { id: '1-tim', name: '1 Timóteo', chapters: 6 }, { id: '2-tim', name: '2 Timóteo', chapters: 4 }, { id: 'titus', name: 'Tito', chapters: 3 }, { id: 'philem', name: 'Filemom', chapters: 1 }, { id: 'heb', name: 'Hebreus', chapters: 13 }, { id: 'james', name: 'Tiago', chapters: 5 }, { id: '1-pet', name: '1 Pedro', chapters: 5 }, { id: '2-pet', name: '2 Pedro', chapters: 3 }, { id: '1-john', name: '1 João', chapters: 5 }, { id: '2-john', name: '2 João', chapters: 1 }, { id: '3-john', name: '3 João', chapters: 1 }, { id: 'jude', name: 'Judas', chapters: 1 }, { id: 'rev', name: 'Apocalipse', chapters: 22 }
            ]
        },
    },
    'en-US': {
        'bom': {
            name: 'The Book of Mormon',
            books: [
                { id: '1-ne', name: '1 Nephi', chapters: 22 }, { id: '2-ne', name: '2 Nephi', chapters: 33 }, { id: 'jacob', name: 'Jacob', chapters: 7 }, { id: 'enos', name: 'Enos', chapters: 1 }, { id: 'jarom', name: 'Jarom', chapters: 1 }, { id: 'omni', name: 'Omni', chapters: 1 }, { id: 'wom', name: 'Words of Mormon', chapters: 1 }, { id: 'mosiah', name: 'Mosiah', chapters: 29 }, { id: 'alma', name: 'Alma', chapters: 63 }, { id: 'helaman', name: 'Helaman', chapters: 16 }, { id: '3-ne', name: '3 Nephi', chapters: 30 }, { id: '4-ne', name: '4 Nephi', chapters: 1 }, { id: 'mormon', name: 'Mormon', chapters: 9 }, { id: 'ether', name: 'Ether', chapters: 15 }, { id: 'moroni', name: 'Moroni', chapters: 10 }
            ]
        },
        'dc': {
            name: 'Doctrine and Covenants',
            books: [
                { id: 'dc', name: 'Sections', chapters: 138 }, { id: 'od', name: 'Official Declarations', chapters: 2 }
            ]
        },
        'pgp': {
            name: 'Pearl of Great Price',
            books: [
                { id: 'moses', name: 'Moses', chapters: 8 }, { id: 'abraham', name: 'Abraham', chapters: 5 }, { id: 'js-m', name: 'Joseph Smith—Matthew', chapters: 1 }, { id: 'js-h', name: 'Joseph Smith—History', chapters: 1 }, { id: 'aof', name: 'Articles of Faith', chapters: 1 }
            ]
        },
        'ot': {
            name: 'Old Testament',
            books: [
                { id: 'gen', name: 'Genesis', chapters: 50 }, { id: 'ex', name: 'Exodus', chapters: 40 }, { id: 'lev', name: 'Leviticus', chapters: 27 }, { id: 'num', name: 'Numbers', chapters: 36 }, { id: 'deut', name: 'Deuteronomy', chapters: 34 }, { id: 'josh', name: 'Joshua', chapters: 24 }, { id: 'judg', name: 'Judges', chapters: 21 }, { id: 'ruth', name: 'Ruth', chapters: 4 }, { id: '1-sam', name: '1 Samuel', chapters: 31 }, { id: '2-sam', name: '2 Samuel', chapters: 24 }, { id: '1-kgs', name: '1 Kings', chapters: 22 }, { id: '2-kgs', name: '2 Kings', chapters: 25 }, { id: '1-chr', name: '1 Chronicles', chapters: 29 }, { id: '2-chr', name: '2 Chronicles', chapters: 36 }, { id: 'ezra', name: 'Ezra', chapters: 10 }, { id: 'neh', name: 'Nehemiah', chapters: 13 }, { id: 'esth', name: 'Esther', chapters: 10 }, { id: 'job', name: 'Job', chapters: 42 }, { id: 'ps', name: 'Psalms', chapters: 150 }, { id: 'prov', name: 'Proverbs', chapters: 31 }, { id: 'eccl', name: 'Ecclesiastes', chapters: 12 }, { id: 'song', name: 'Song of Solomon', chapters: 8 }, { id: 'isa', name: 'Isaiah', chapters: 66 }, { id: 'jer', name: 'Jeremiah', chapters: 52 }, { id: 'lam', name: 'Lamentations', chapters: 5 }, { id: 'ezek', name: 'Ezekiel', chapters: 48 }, { id: 'dan', name: 'Daniel', chapters: 12 }, { id: 'hosea', name: 'Hosea', chapters: 14 }, { id: 'joel', name: 'Joel', chapters: 3 }, { id: 'amos', name: 'Amos', chapters: 9 }, { id: 'obad', name: 'Obadiah', chapters: 1 }, { id: 'jonah', name: 'Jonah', chapters: 4 }, { id: 'micah', name: 'Micah', chapters: 7 }, { id: 'nahum', name: 'Nahum', chapters: 3 }, { id: 'hab', name: 'Habakkuk', chapters: 3 }, { id: 'zeph', name: 'Zephaniah', chapters: 3 }, { id: 'hag', name: 'Haggai', chapters: 2 }, { id: 'zech', name: 'Zechariah', chapters: 14 }, { id: 'mal', name: 'Malachi', chapters: 4 }
            ]
        },
        'nt': {
            name: 'New Testament',
            books: [
                { id: 'matt', name: 'Matthew', chapters: 28 }, { id: 'mark', name: 'Mark', chapters: 16 }, { id: 'luke', name: 'Luke', chapters: 24 }, { id: 'john', name: 'John', chapters: 21 }, { id: 'acts', name: 'Acts', chapters: 28 }, { id: 'rom', name: 'Romans', chapters: 16 }, { id: '1-cor', name: '1 Corinthians', chapters: 16 }, { id: '2-cor', name: '2 Corinthians', chapters: 13 }, { id: 'gal', name: 'Galatians', chapters: 6 }, { id: 'eph', name: 'Ephesians', chapters: 6 }, { id: 'philip', name: 'Philippians', chapters: 4 }, { id: 'col', name: 'Colossians', chapters: 4 }, { id: '1-thes', name: '1 Thessalonians', chapters: 5 }, { id: '2-thes', name: '2 Thessalonians', chapters: 3 }, { id: '1-tim', name: '1 Timothy', chapters: 6 }, { id: '2-tim', name: '2 Timothy', chapters: 4 }, { id: 'titus', name: 'Titus', chapters: 3 }, { id: 'philem', name: 'Philemon', chapters: 1 }, { id: 'heb', name: 'Hebrews', chapters: 13 }, { id: 'james', name: 'James', chapters: 5 }, { id: '1-pet', name: '1 Peter', chapters: 5 }, { id: '2-pet', name: '2 Peter', chapters: 3 }, { id: '1-john', name: '1 John', chapters: 5 }, { id: '2-john', name: '2 John', chapters: 1 }, { id: '3-john', name: '3 John', chapters: 1 }, { id: 'jude', name: 'Jude', chapters: 1 }, { id: 'rev', name: 'Revelation', chapters: 22 }
            ]
        },
    },
    'es-ES': {
        'bom': {
            name: 'El Libro de Mormón',
            books: [
                { id: '1-ne', name: '1 Nefi', chapters: 22 }, { id: '2-ne', name: '2 Nefi', chapters: 33 }, { id: 'jacob', name: 'Jacob', chapters: 7 }, { id: 'enos', name: 'Enós', chapters: 1 }, { id: 'jarom', name: 'Jarom', chapters: 1 }, { id: 'omni', name: 'Omni', chapters: 1 }, { id: 'wom', name: 'Palabras de Mormón', chapters: 1 }, { id: 'mosiah', name: 'Mosíah', chapters: 29 }, { id: 'alma', name: 'Alma', chapters: 63 }, { id: 'helaman', name: 'Helamán', chapters: 16 }, { id: '3-ne', name: '3 Nefi', chapters: 30 }, { id: '4-ne', name: '4 Nefi', chapters: 1 }, { id: 'mormon', name: 'Mormón', chapters: 9 }, { id: 'ether', name: 'Éter', chapters: 15 }, { id: 'moroni', name: 'Moroni', chapters: 10 }
            ]
        },
        'dc': {
            name: 'Doctrina y Convenios',
            books: [
                { id: 'dc', name: 'Secciones', chapters: 138 }, { id: 'od', name: 'Declaraciones Oficiales', chapters: 2 }
            ]
        },
        'pgp': {
            name: 'Perla de Gran Precio',
            books: [
                { id: 'moses', name: 'Moisés', chapters: 8 }, { id: 'abraham', name: 'Abraham', chapters: 5 }, { id: 'js-m', name: 'José Smith—Mateo', chapters: 1 }, { id: 'js-h', name: 'José Smith—Historia', chapters: 1 }, { id: 'aof', name: 'Artículos de Fe', chapters: 1 }
            ]
        },
        'ot': {
            name: 'Antiguo Testamento',
            books: [
                { id: 'gen', name: 'Génesis', chapters: 50 }, { id: 'ex', name: 'Éxodo', chapters: 40 }, { id: 'lev', name: 'Levítico', chapters: 27 }, { id: 'num', name: 'Números', chapters: 36 }, { id: 'deut', name: 'Deuteronomio', chapters: 34 }, { id: 'josh', name: 'Josué', chapters: 24 }, { id: 'judg', name: 'Jueces', chapters: 21 }, { id: 'ruth', name: 'Rut', chapters: 4 }, { id: '1-sam', name: '1 Samuel', chapters: 31 }, { id: '2-sam', name: '2 Samuel', chapters: 24 }, { id: '1-kgs', name: '1 Reyes', chapters: 22 }, { id: '2-kgs', name: '2 Reyes', chapters: 25 }, { id: '1-chr', name: '1 Crónicas', chapters: 29 }, { id: '2-chr', name: '2 Crónicas', chapters: 36 }, { id: 'ezra', name: 'Esdras', chapters: 10 }, { id: 'neh', name: 'Nehemías', chapters: 13 }, { id: 'esth', name: 'Ester', chapters: 10 }, { id: 'job', name: 'Job', chapters: 42 }, { id: 'ps', name: 'Salmos', chapters: 150 }, { id: 'prov', name: 'Proverbios', chapters: 31 }, { id: 'eccl', name: 'Eclesiastés', chapters: 12 }, { id: 'song', name: 'El Cantar de los Cantares', chapters: 8 }, { id: 'isa', name: 'Isaías', chapters: 66 }, { id: 'jer', name: 'Jeremías', chapters: 52 }, { id: 'lam', name: 'Lamentaciones', chapters: 5 }, { id: 'ezek', name: 'Ezequiel', chapters: 48 }, { id: 'dan', name: 'Daniel', chapters: 12 }, { id: 'hosea', name: 'Oseas', chapters: 14 }, { id: 'joel', name: 'Joel', chapters: 3 }, { id: 'amos', name: 'Amós', chapters: 9 }, { id: 'obad', name: 'Abdías', chapters: 1 }, { id: 'jonah', name: 'Jonás', chapters: 4 }, { id: 'micah', name: 'Miqueas', chapters: 7 }, { id: 'nahum', name: 'Nahúm', chapters: 3 }, { id: 'hab', name: 'Habacuc', chapters: 3 }, { id: 'zeph', name: 'Sofonías', chapters: 3 }, { id: 'hag', name: 'Hageo', chapters: 2 }, { id: 'zech', name: 'Zacarías', chapters: 14 }, { id: 'mal', name: 'Malaquías', chapters: 4 }
            ]
        },
        'nt': {
            name: 'Nuevo Testamento',
            books: [
                { id: 'matt', name: 'Mateo', chapters: 28 }, { id: 'mark', name: 'Marcos', chapters: 16 }, { id: 'luke', name: 'Lucas', chapters: 24 }, { id: 'john', name: 'Juan', chapters: 21 }, { id: 'acts', name: 'Hechos', chapters: 28 }, { id: 'rom', name: 'Romanos', chapters: 16 }, { id: '1-cor', name: '1 Corintios', chapters: 16 }, { id: '2-cor', name: '2 Corintios', chapters: 13 }, { id: 'gal', name: 'Gálatas', chapters: 6 }, { id: 'eph', name: 'Efesios', chapters: 6 }, { id: 'philip', name: 'Filipenses', chapters: 4 }, { id: 'col', name: 'Colosenses', chapters: 4 }, { id: '1-thes', name: '1 Tesalonicenses', chapters: 5 }, { id: '2-thes', name: '2 Tesalonicenses', chapters: 3 }, { id: '1-tim', name: '1 Timoteo', chapters: 6 }, { id: '2-tim', name: '2 Timoteo', chapters: 4 }, { id: 'titus', name: 'Tito', chapters: 3 }, { id: 'philem', name: 'Filemón', chapters: 1 }, { id: 'heb', name: 'Hebreos', chapters: 13 }, { id: 'james', name: 'Santiago', chapters: 5 }, { id: '1-pet', name: '1 Pedro', chapters: 5 }, { id: '2-pet', name: '2 Pedro', chapters: 3 }, { id: '1-john', name: '1 Juan', chapters: 5 }, { id: '2-john', name: '2 Juan', chapters: 1 }, { id: '3-john', name: '3 Juan', chapters: 1 }, { id: 'jude', name: 'Judas', chapters: 1 }, { id: 'rev', name: 'Apocalipsis', chapters: 22 }
            ]
        },
    },
};

export const getScriptures = (lang: Language): ScriptureData => {
    return scripturesData[lang] || scripturesData['en-US'];
};