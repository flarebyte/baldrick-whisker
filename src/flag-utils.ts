export const optionsToFlag = (options: { [name: string]: string }): string => {
  const flags = [];
  if (!options['ext']) {
    flags.push('drop');
  }
  if (!options['overwrite']) {
    flags.push('skip-overwrite');
  }
  return flags.join(' ');
};

export const shouldDropExtension = (flags: string) => flags.includes('drop');

export const shouldSkipOverwrite = (flags: string) => flags.includes('skip-overwrite');
