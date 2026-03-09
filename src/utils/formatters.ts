export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 60) return `${diffMinutes} dəqiqə əvvəl`;
  if (diffHours < 24) return `${diffHours} saat əvvəl`;
  if (diffDays < 7) return `${diffDays} gün əvvəl`;
  return date.toLocaleDateString("az-AZ", { month: "short", day: "numeric" });
}

export function formatSalary(salary?: string): string {
  if (!salary) return "";
  return salary;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
