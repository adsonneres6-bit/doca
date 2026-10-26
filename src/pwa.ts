import { registerSW } from 'virtual:pwa-register';

registerSW({
  onNeedRefresh() {
    if (confirm('Nova versão disponível. Recarregar para atualizar?')) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.info('App pronto para uso offline.');
  },
});
