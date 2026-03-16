import { Request, Response } from 'express';
import { generateCV } from '../services/aiService';

export const generateAIUserCV = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    
    if (!userData || Object.keys(userData).length === 0) {
      return res.status(400).json({ message: 'İstifadəçi məlumatları daxil edilməyib.' });
    }

    const cvContent = await generateCV(userData);
    
    return res.status(200).json({ 
      success: true, 
      content: cvContent 
    });
  } catch (error: any) {
    console.error('CV Generation Controller Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'CV yaradıla bilmədi.' 
    });
  }
};
