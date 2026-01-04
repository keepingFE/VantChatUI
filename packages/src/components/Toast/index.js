import { createApp } from 'vue';
import ToastComponent from './index.vue';

let instance = null;
let container = null;
let currentVm = null;

const defaultOptions = {
  message: '',
  type: 'info',
  duration: 2000,
  icon: ''
};

const iconMap = {
  success: 'success',
  error: 'cross',
  warning: 'warning',
  loading: 'loading'
};

function createToast(options) {
  if (instance) {
    instance.unmount();
    if (container && document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }

  const opts = { ...defaultOptions, ...options };
  
  if (!opts.icon && iconMap[opts.type]) {
    opts.icon = iconMap[opts.type];
  }

  container = document.createElement('div');
  document.body.appendChild(container);

  instance = createApp(ToastComponent, opts);
  currentVm = instance.mount(container);

  currentVm.show();

  return currentVm;
}

const Toast = (message, options = {}) => {
  if (typeof message === 'object') {
    return createToast(message);
  }
  return createToast({ ...options, message });
};

Toast.success = (message, options = {}) => {
  return createToast({ ...options, message, type: 'success' });
};

Toast.error = (message, options = {}) => {
  return createToast({ ...options, message, type: 'error' });
};

Toast.warning = (message, options = {}) => {
  return createToast({ ...options, message, type: 'warning' });
};

Toast.loading = (message, options = {}) => {
  return createToast({ ...options, message, type: 'loading', duration: 0 });
};

Toast.clear = () => {
  if (currentVm && currentVm.hide) {
    currentVm.hide();
  }
  setTimeout(() => {
    if (instance) {
      instance.unmount();
    }
    if (container && document.body.contains(container)) {
      document.body.removeChild(container);
    }
    instance = null;
    container = null;
    currentVm = null;
  }, 300);
};

export default Toast;
