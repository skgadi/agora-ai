export const events = (label: string, ...args: unknown[]) => {
  switch (label) {
    case 'app-init': {
      console.log('app-init', args[0]);
      return;
    }
    default:
      return;
  }
};

export default events;
