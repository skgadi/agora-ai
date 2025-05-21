import { Notify, type QNotifyCreateOptions } from 'quasar';

export const notify = (
  message: string,
  caption = 'Switchgear',
  type:
    | 'error'
    | 'success'
    | 'positive'
    | 'info'
    | 'warning'
    | 'negative'
    | 'primary'
    | 'accent' = 'info',
  timeout = 2500,
  icon: string | undefined = undefined,
  progress = true,
  html = true,
  position:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'center' = 'bottom',
) => {
  if (html) {
    message = message.replace(/(?:\r\n|\r|\n)/g, '<br>');
    message = `<div style="max-width: 300px;">${message}</div>`;
  }
  if (type === 'error') {
    type = 'negative';
  }
  if (type === 'success') {
    type = 'positive';
  }
  if (!icon) {
    switch (type) {
      case 'positive':
        icon = 'check_circle';
        break;
      case 'info':
        icon = 'info';
        break;
      case 'warning':
        icon = 'warning';
        break;
      case 'negative':
        icon = 'error';
        break;
      case 'primary':
        icon = 'info';
        break;
      case 'accent':
        icon = 'info';
        break;
    }
  }
  const options: QNotifyCreateOptions = {
    message,
    caption,
    type,
    timeout,
    icon,
    progress,
    html,
    position,
  };
  Notify.create(options);
};
