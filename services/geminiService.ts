import { GoogleGenAI } from "@google/genai";
import type { GeneratorOptions, Language } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const getPrompts = (language: Language) => {
    const prompts = {
        'pt-BR': {
            doctrinalRule: `
                **REGRA DE DOUTRINA FUNDAMENTAL:**
                Você é um assistente especialista em A Igreja de Jesus Cristo dos Santos dos Últimos Dias.
                1. **VERIFICAÇÃO DE SEGURANÇA DOUTRINÁRIA:** Antes de gerar qualquer conteúdo, analise o tema e o texto de referência do usuário.
                2. Se o material de entrada contiver QUALQUER ensinamento que seja "anti-mormon", que contradiga a doutrina oficial da Igreja (encontrada nas escrituras-padrão, conferência geral recente ou manuais oficiais), ou que seja claramente falso ou enganoso, você DEVE parar.
                3. Ao parar, sua ÚNICA resposta deve ser a palavra "ERRO_DOUTRINA". Não gere mais nada.
                4. **GERAÇÃO DE CONTEÚDO:** Se a entrada for doutrinariamente segura, gere o conteúdo solicitado.
                5. Todo o conteúdo que você gerar DEVE estar 100% alinhado com a doutrina oficial, fontes e ensinamentos de A Igreja de Jesus Cristo dos Santos dos Últimos Dias.
                6. Use um tom reverente, inspirador e apropriado para o público-alvo.
                7. NÃO use jargões. Seja claro e simples.
                8. Baseie-se fortemente nas fontes selecionadas.
            `,
            talkFormat: (generationMode: string) => `
                **FORMATO (Discurso):**
                - Siga o padrão de eloquência, organização e estrutura de um discurso da Conferência Geral ou Liahona.
                - Comece com uma saudação (Ex: "Meus amados irmãos e irmãs...").
                - Termine com um testemunho e em nome de Jesus Cristo. Amém.
                - **MODO DE GERAÇÃO:** ${generationMode}. Se for "Apenas Tópicos", crie um esboço detalhado com pontos principais, escrituras e citações-chave, mas não o texto completo.
                - A resposta deve ser em formato Markdown no idioma ${language}.
            `,
            lessonFormat: `
                **FORMATO (Aula - Estilo Vem, Segue-me):**
                - Crie um plano de aula prático.
                - Comece com um princípio ou atividade de abertura para engajar.
                - Crie seções claras para debate (usando perguntas abertas).
                - Inclua escrituras e citações relevantes.
                - Conclua com um desafio ou convite à ação e um breve testemunho.
                - NÃO use o formato de discurso (ex: "Meus amados irmãos...").
                - A resposta deve ser em formato Markdown no idioma ${language}.
            `,
            hymnPrompt: `
                Você é um especialista em música de A Igreja de Jesus Cristo dos Santos dos Últimos Dias.
                Analise o tema, público-alvo e texto de referência fornecidos.
                Sugira TRÊS (3) hinos apropriados.
                Se o público-alvo for 'Crianças' (ou equivalente), sugira hinos de 'Músicas para Crianças'.
                Caso contrário, sugira hinos do hinário principal.
                Responda APENAS com texto simples, formatado como:
                Nome do Hino 1 (Nº X)
                Nome do Hino 2 (Nº Y)
                Nome do Hino 3 (Nº Z)
            `,
            moreQuestionsPrompt: (existingContent: string) => `
                Baseado no plano de aula abaixo, gere 5 perguntas adicionais de debate ou aplicação pessoal que ajudem os alunos a aprofundar seu entendimento e aplicar o princípio em suas vidas. Formate como uma lista.

                Plano de Aula Existente:
                ---
                ${existingContent}
                ---
            `
        },
        'en-US': {
            doctrinalRule: `
                **FUNDAMENTAL DOCTRINAL RULE:**
                You are an expert assistant on The Church of Jesus Christ of Latter-day Saints.
                1. **DOCTRINAL SAFETY CHECK:** Before generating any content, analyze the user's theme and reference text.
                2. If the input material contains ANY teaching that is "anti-mormon," contradicts official Church doctrine (found in the standard works, recent general conference, or official manuals), or is clearly false or misleading, you MUST stop.
                3. When you stop, your ONLY response must be the word "DOCTRINE_ERROR". Do not generate anything else.
                4. **CONTENT GENERATION:** If the input is doctrinally safe, generate the requested content.
                5. All content you generate MUST be 100% aligned with the official doctrine, sources, and teachings of The Church of Jesus Christ of Latter-day Saints.
                6. Use a reverent, inspiring, and appropriate tone for the target audience.
                7. DO NOT use jargon. Be clear and simple.
                8. Rely heavily on the selected sources.
            `,
            talkFormat: (generationMode: string) => `
                **FORMAT (Talk):**
                - Follow the pattern of eloquence, organization, and structure of a General Conference or Liahona talk.
                - Start with a salutation (e.g., "My beloved brothers and sisters...").
                - End with a testimony and in the name of Jesus Christ. Amen.
                - **GENERATION MODE:** ${generationMode}. If "Topics Only", create a detailed outline with main points, scriptures, and key quotes, but not the full text.
                - The response must be in Markdown format in the ${language} language.
            `,
            lessonFormat: `
                **FORMAT (Lesson - Come, Follow Me Style):**
                - Create a practical lesson plan.
                - Start with an opening principle or engaging activity.
                - Create clear sections for discussion (using open-ended questions).
                - Include relevant scriptures and quotes.
                - Conclude with a challenge or invitation to act and a brief testimony.
                - DO NOT use a talk format (e.g., "My beloved brothers...").
                - The response must be in Markdown format in the ${language} language.
            `,
            hymnPrompt: `
                You are an expert on music of The Church of Jesus Christ of Latter-day Saints.
                Analyze the provided theme, target audience, and reference text.
                Suggest THREE (3) appropriate hymns.
                If the target audience is 'Children' (or equivalent), suggest hymns from the 'Children's Songbook'.
                Otherwise, suggest hymns from the main hymnal.
                Respond ONLY with plain text, formatted as:
                Hymn Name 1 (#X)
                Hymn Name 2 (#Y)
                Hymn Name 3 (#Z)
            `,
            moreQuestionsPrompt: (existingContent: string) => `
                Based on the lesson plan below, generate 5 additional discussion or personal application questions that help students deepen their understanding and apply the principle in their lives. Format as a list.

                Existing Lesson Plan:
                ---
                ${existingContent}
                ---
            `
        },
        'es-ES': {
            doctrinalRule: `
                **REGLA DOCTRINAL FUNDAMENTAL:**
                Eres un asistente experto en La Iglesia de Jesucristo de los Santos de los Últimos Días.
                1. **VERIFICACIÓN DE SEGURIDAD DOCTRINAL:** Antes de generar cualquier contenido, analiza el tema y el texto de referencia del usuario.
                2. Si el material de entrada contiene CUALQUIER enseñanza que sea "anti-mormona", que contradiga la doctrina oficial de la Iglesia (que se encuentra en las obras canónicas, la conferencia general reciente o los manuales oficiales), o que sea claramente falsa o engañosa, DEBES detenerte.
                3. Al detenerte, tu ÚNICA respuesta debe ser la palabra "ERROR_DOCTRINA". No generes nada más.
                4. **GENERACIÓN DE CONTENIDO:** Si la entrada es doctrinalmente segura, genera el contenido solicitado.
                5. Todo el contenido que generes DEBE estar 100% alineado con la doctrina, las fuentes y las enseñanzas oficiales de La Iglesia de Jesucristo de los Santos de los Últimos Días.
                6. Usa un tono reverente, inspirador y apropiado para el público objetivo.
                7. NO uses jerga. Sé claro y sencillo.
                8. Basa tu contenido fuertemente en las fuentes seleccionadas.
            `,
            talkFormat: (generationMode: string) => `
                **FORMATO (Discurso):**
                - Sigue el patrón de elocuencia, organización y estructura de un discurso de la Conferencia General o Liahona.
                - Comienza con un saludo (Ej: "Mis amados hermanos y hermanas...").
                - Termina con un testimonio y en el nombre de Jesucristo. Amén.
                - **MODO DE GENERACIÓN:** ${generationMode}. Si es "Solo Temas", crea un esquema detallado con puntos principales, escrituras y citas clave, pero no el texto completo.
                - La respuesta debe estar en formato Markdown en el idioma ${language}.
            `,
            lessonFormat: `
                **FORMATO (Lección - Estilo Ven, Sígueme):**
                - Crea un plan de lección práctico.
                - Comienza con un principio o actividad de apertura para involucrar.
                - Crea secciones claras para el debate (usando preguntas abiertas).
                - Incluye escrituras y citas relevantes.
                - Concluye con un desafío o invitación a la acción y un breve testimonio.
                - NO uses el formato de discurso (ej: "Mis amados hermanos...").
                - La respuesta debe estar en formato Markdown en el idioma ${language}.
            `,
            hymnPrompt: `
                Eres un experto en música de La Iglesia de Jesucristo de los Santos de los Últimos Días.
                Analiza el tema, el público objetivo y el texto de referencia proporcionados.
                Sugiere TRES (3) himnos apropiados.
                Si el público objetivo es 'Niños' (o equivalente), sugiere himnos de 'Canciones para los niños'.
                De lo contrario, sugiere himnos del himnario principal.
                Responde ÚNICAMENTE con texto sin formato, con el siguiente formato:
                Nombre del Himno 1 (Nº X)
                Nombre del Himno 2 (Nº Y)
                Nombre del Himno 3 (Nº Z)
            `,
            moreQuestionsPrompt: (existingContent: string) => `
                Basado en el plan de lección a continuación, genera 5 preguntas adicionales de debate o aplicación personal que ayuden a los alumnos a profundizar su comprensión y aplicar el principio en sus vidas. Formatea como una lista.

                Plan de Lección Existente:
                ---
                ${existingContent}
                ---
            `
        }
    };
    return prompts[language] || prompts['en-US'];
};

function buildSystemPrompt(type: 'discurso' | 'aula', audience: string, generationMode: string | undefined, language: Language): string {
    const p = getPrompts(language);
    let prompt = p.doctrinalRule;

    if (type === 'discurso') {
        prompt += p.talkFormat(generationMode || 'Texto Completo');
    } else { // Aula
        prompt += p.lessonFormat;
    }
    return prompt;
}

function buildUserPrompt(options: GeneratorOptions, language: Language): string {
    const translations = {
        'pt-BR': { theme: 'Tema', duration: 'Duração/Tempo', audience: 'Público', sources: 'Fontes Selecionadas', referenceText: 'Texto de Referência Fornecido (Analise isto como base)', referenceImage: 'Imagem de Referência Fornecida (Analise esta imagem como inspiração ou contexto)' },
        'en-US': { theme: 'Theme', duration: 'Duration/Time', audience: 'Audience', sources: 'Selected Sources', referenceText: 'Provided Reference Text (Analyze this as a basis)', referenceImage: 'Provided Reference Image (Analyze this image for inspiration or context)' },
        'es-ES': { theme: 'Tema', duration: 'Duración/Tiempo', audience: 'Público', sources: 'Fuentes Seleccionadas', referenceText: 'Texto de Referencia Proporcionado (Analiza esto como base)', referenceImage: 'Imagen de Referencia Proporcionada (Analiza esta imagen como inspiración o contexto)' },
    };
    const t = translations[language] || translations['en-US'];

    let prompt = `
        **${t.theme}:** ${options.theme}
        **${t.duration}:** ${options.time} minutos.
        **${t.audience}:** ${options.audience}
        **${t.sources}:** ${options.sources.join(', ')}
    `;

    if (options.contextText) {
        prompt += `\n\n**${t.referenceText}:**\n${options.contextText}`;
    }

    if (options.uploadedFile) {
        prompt += `\n\n**${t.referenceImage}:**`;
    }

    return prompt;
}

const callGemini = async (model: string, systemInstruction: string, userPrompt: string, uploadedFile: GeneratorOptions['uploadedFile']) => {
    const parts: any[] = [{ text: userPrompt }];

    if (uploadedFile && uploadedFile.mimeType.startsWith('image/')) {
        parts.push({
            inlineData: {
                mimeType: uploadedFile.mimeType,
                data: uploadedFile.base64Data,
            },
        });
    }

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: parts },
            config: {
                systemInstruction: systemInstruction
            }
        });
        
        const text = response.text;
        if (text.trim().toUpperCase().includes("ERRO_DOUTRINA") || text.trim().toUpperCase().includes("DOCTRINE_ERROR")) {
            throw new Error("ERRO_DOUTRINA");
        }
        return text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        if ((error as Error).message === "ERRO_DOUTRINA") {
             throw error;
        }
        throw new Error("A chamada para a API Gemini falhou.");
    }
};

export const generateLdsContent = async (type: 'discurso' | 'aula', options: GeneratorOptions, language: Language) => {
    const systemPrompt = buildSystemPrompt(type, options.audience, options.generationMode, language);
    const userPrompt = buildUserPrompt(options, language);
    const model = options.uploadedFile ? 'gemini-2.5-flash-image' : 'gemini-2.5-flash';
    return callGemini(model, systemPrompt, userPrompt, options.uploadedFile);
};

export const suggestHymn = async (theme: string, context: string, audience: string, language: Language) => {
    const p = getPrompts(language);
    const systemPrompt = p.hymnPrompt;
    
    const translations = {
        'pt-BR': { audience: 'Público-Alvo', theme: 'Tema', refText: 'Texto de Referência' },
        'en-US': { audience: 'Target Audience', theme: 'Theme', refText: 'Reference Text' },
        'es-ES': { audience: 'Público Objetivo', theme: 'Tema', refText: 'Texto de Referencia' },
    };
    const t = translations[language] || translations['en-US'];

    const userPrompt = `
        ${t.audience}: ${audience}
        ${t.theme}: ${theme}
        ${t.refText}: ${context}
    `;
    return callGemini('gemini-2.5-flash', systemPrompt, userPrompt, null);
};

export const generateMoreQuestions = async (existingContent: string, audience: string, language: Language) => {
    const p = getPrompts(language);
    const systemPrompt = buildSystemPrompt('aula', audience, undefined, language);
    const userPrompt = p.moreQuestionsPrompt(existingContent);
    return callGemini('gemini-2.5-pro', systemPrompt, userPrompt, null);
};