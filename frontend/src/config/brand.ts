/**
 * Single source of truth for VYOMIK brand details, contact information,
 * and official social media channels.
 * 
 * Never hard-code these links or handles elsewhere in the codebase.
 */

export const brandName = 'VYOMIK' as const;
export const instagramUrl = 'https://www.instagram.com/simplyvyomik' as const;
export const instagramHandle = '@simplyvyomik' as const;
export const youtubeUrl = 'https://www.youtube.com/@simplyvyomik' as const;
export const discordUrl = 'https://discord.gg/vyomik' as const;
export const twitterUrl = 'https://x.com/simplyvyomik' as const;
export const contactEmail = 'simplyvyomik@gmail.com' as const;
export const mailtoUrl = 'mailto:simplyvyomik@gmail.com' as const;
export const defaultLaunchAt = '2026-11-10T00:00:00+05:30' as const;
export const defaultLaunchDate = '2026-11-10' as const;

export const brandConfig = {
  brandName,
  instagramUrl,
  instagramHandle,
  youtubeUrl,
  discordUrl,
  twitterUrl,
  contactEmail,
  mailtoUrl,
  defaultLaunchAt,
  defaultLaunchDate,
} as const;

export default brandConfig;
