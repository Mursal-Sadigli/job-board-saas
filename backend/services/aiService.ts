import groq from '../lib/groq';

export interface AIAnalysisResult {
  matchScore: number;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  verdict: 'Pas keçdi' | 'Kəsildi' | 'Daha yaxın baxılmalı';
}

/**
 * CV mətni ilə iş elanını müqayisə edən AI servisi (ATS)
 */
export async function compareCVWithJob(resumeText: string, jobTitle: string, jobDescription: string): Promise<AIAnalysisResult> {
  try {
    const prompt = `
      Sən peşəkar bir ATS (Applicant Tracking System) mütəxəssisisən. 
      Aşağıdakı namizəd CV-si ilə iş elanının təsvirini müqayisə et və real bir analiz apar.
      
      İşin adı: ${jobTitle}
      İşin təsviri: ${jobDescription}
      
      Namizədin CV mətni:
      ${resumeText}
      
      Xahiş olunur, nəticəni yalnız JSON formatında, heç bir əlavə mətn olmadan belə qaytar:
      {
        "matchScore": 0-100 arası rəqəm,
        "summary": "Namizədin bu iş üçün uyğunluğu haqqında qısa Azərbaycan dilində rəy",
        "matchedSkills": ["namizəddə olan və işlə üst-üstə düşən bacarıqlar"],
        "missingSkills": ["iş üçün vacib olan amma namizəddə çatışmayan bacarıqlar"],
        "recommendations": ["namizədə və ya işəgötürənə tövsiyələr"],
        "verdict": "Pas keçdi" | "Kəsildi" | "Daha yaxın baxılmalı"
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(chatCompletion.choices[0].message.content || '{}');
    
    // Fallback values if parts are missing
    return {
      matchScore: result.matchScore || 0,
      summary: result.summary || 'Analiz mümkün olmadı.',
      matchedSkills: result.matchedSkills || [],
      missingSkills: result.missingSkills || [],
      recommendations: result.recommendations || [],
      verdict: result.verdict || 'Daha yaxın baxılmalı'
    };
  } catch (error) {
    console.error('AI CV Analysis Error:', error);
    throw new Error('Süni intellekt analizi zamanı xəta baş verdi.');
  }
}
