import { useState, useEffect } from 'react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useAuth } from '@clerk/nextjs';
import { toast } from '@/hooks/use-toast';

export function useApplications() {
  const [isLoading, setIsLoading] = useState(false);
  const { setApplications } = useApplicationStore();
  const { getToken } = useAuth();

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const response = await fetch(`${API_BASE}/api/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Müraciətləri yükləmək mümkün olmadı');
      
      const data = await response.json();
      console.log('Fetched raw applications:', data);
      
      // Map backend data to frontend Application type
      const mappedApps = data.map((app: any) => ({
        id: app.id,
        name: app.candidate?.name || 'Anonim Namizəd',
        initials: (app.candidate?.name || 'A').charAt(0),
        color: app.isVirtual ? 'bg-orange-500/20 text-orange-600' : 'bg-primary',
        stage: app.stage || 'Applied',
        rating: app.rating || 0,
        appliedAt: app.appliedAt,
        jobTitle: app.job?.title || 'Bilinməyən Vakansiya',
        jobId: app.jobId,
        resumeUrl: app.resumeUrl || '',
        isVirtual: app.isVirtual || false
      }));
      
      setApplications(mappedApps);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Xəta",
        description: "Müraciətləri gətirərkən problem yarandı.",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return { isLoading, refresh: fetchApplications };
}
