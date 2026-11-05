/**
 * Single source of truth for VYOMIK brand details, contact information,
 * and official social media channels.
 * 
 * Never hard-code these links or handles elsewhere in the codebase.
 */

export const brandName = 'VYOMIK' as const;
export const instagramUrl = 'https://www.instagram.com/simplyvyomik' as const;
export const instagramHandle = '@simplyvyomik' as const;
export const contactEmail = 'simplyvyomik@gmail.com' as const;
export const mailtoUrl = 'mailto:simplyvyomik@gmail.com' as const;

export const brandConfig = {
  brandName,
  instagramUrl,
  instagramHandle,
  contactEmail,
  mailtoUrl,
} as const;

export default brandConfig;
